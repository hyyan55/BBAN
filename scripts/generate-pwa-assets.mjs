import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createPngBuffer(width, height, pixelFn) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// 5x7 bitmap fonts for "BBAN"
const glyphs = {
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
};

function renderIconPixel(x, y, size, isMaskable) {
  const center = size / 2;
  const cornerRadius = size * 0.22;

  // Squircle clipping for regular icon
  if (!isMaskable) {
    const dx = Math.max(0, Math.abs(x - center) - (size / 2 - cornerRadius));
    const dy = Math.max(0, Math.abs(y - center) - (size / 2 - cornerRadius));
    if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
      return [0, 0, 0, 0];
    }
  }

  // Gradient background #0A192F -> #16427C
  const t = (x + y) / (2 * size);
  let r = Math.round(10 + t * 14);
  let g = Math.round(25 + t * 45);
  let b = Math.round(47 + t * 85);
  const a = 255;

  // Safe margin multiplier
  const padding = isMaskable ? 0.15 : 0.08;
  const startX = Math.floor(size * (padding + 0.1));
  const endX = Math.floor(size * (1 - padding - 0.1));

  // Top Sudan color bar: Red, White, Green, Gold
  const barY1 = Math.floor(size * (padding + 0.12));
  const barY2 = Math.floor(size * (padding + 0.14));
  if (y >= barY1 && y <= barY2 && x >= startX && x <= endX) {
    const seg = (x - startX) / (endX - startX);
    if (seg < 0.28) return [210, 16, 52, 255]; // Sudan red
    if (seg < 0.32) return [r, g, b, 255];
    if (seg < 0.64) return [248, 250, 252, 255]; // white
    if (seg < 0.68) return [r, g, b, 255];
    return [0, 114, 41, 255]; // Sudan green
  }

  // Gold accent line under center
  const goldY1 = Math.floor(size * (1 - padding - 0.25));
  const goldY2 = Math.floor(size * (1 - padding - 0.23));
  if (y >= goldY1 && y <= goldY2 && x >= startX && x <= endX) {
    return [229, 193, 88, 255]; // Gold
  }

  // Draw "BBAN" text
  const word = ['B', 'B', 'A', 'N'];
  const scale = Math.max(1, Math.floor(size / 34));
  const charW = 5 * scale;
  const charH = 7 * scale;
  const gap = 1 * scale;
  const totalW = word.length * charW + (word.length - 1) * gap;
  const textX = Math.floor((size - totalW) / 2);
  const textY = Math.floor((size - charH) / 2);

  if (x >= textX && x < textX + totalW && y >= textY && y < textY + charH) {
    const relX = x - textX;
    const relY = y - textY;
    const step = charW + gap;
    const charIdx = Math.floor(relX / step);
    const inCharX = relX % step;
    if (charIdx >= 0 && charIdx < word.length && inCharX < charW) {
      const gx = Math.floor(inCharX / scale);
      const gy = Math.floor(relY / scale);
      const pattern = glyphs[word[charIdx]];
      if (pattern && pattern[gy] && pattern[gy][gx] === '1') {
        return [255, 255, 255, 255];
      }
    }
  }

  return [r, g, b, a];
}

function renderMobileScreenshot(x, y, w, h) {
  // Mobile Frame (540x960)
  // Background: clean light slate #F8FAFC
  if (y < 70) {
    // Header dark bar #0A192F
    return [10, 25, 47, 255];
  }

  // Card container (x: 40 to 500, y: 120 to 680)
  if (x >= 40 && x <= 500 && y >= 120 && y <= 680) {
    // White card background
    let r = 255, g = 255, b = 255;
    // Input simulated boxes
    if (y >= 200 && y <= 270 && x >= 70 && x <= 470) {
      r = 241; g = 245; b = 249; // Bank select box
    } else if (y >= 330 && y <= 400 && x >= 70 && x <= 470) {
      r = 241; g = 245; b = 249; // Account number input
    } else if (y >= 440 && y <= 500 && x >= 70 && x <= 470) {
      r = 15; g = 44; b = 89; // Primary button navy
    } else if (y >= 540 && y <= 640 && x >= 70 && x <= 470) {
      r = 10; g = 25; b = 47; // Monospace result card
    }
    return [r, g, b, 255];
  }

  // Footer area
  return [248, 250, 252, 255];
}

function renderDesktopScreenshot(x, y, w, h) {
  // Desktop Frame (1280x720)
  if (y < 60) {
    // Top bar navy
    return [10, 25, 47, 255];
  }

  // Centered main converter card (x: 360 to 920, y: 100 to 620)
  if (x >= 360 && x <= 920 && y >= 100 && y <= 620) {
    let r = 255, g = 255, b = 255;
    if (y >= 180 && y <= 250 && x >= 400 && x <= 880) {
      r = 241; g = 245; b = 249; // bank dropdown
    } else if (y >= 290 && y <= 360 && x >= 400 && x <= 880) {
      r = 241; g = 245; b = 249; // account input
    } else if (y >= 390 && y <= 450 && x >= 400 && x <= 880) {
      r = 15; g = 44; b = 89; // action button
    } else if (y >= 480 && y <= 580 && x >= 400 && x <= 880) {
      r = 10; g = 25; b = 47; // BBAN result card
    }
    return [r, g, b, 255];
  }

  return [248, 250, 252, 255];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons and screenshots...');

// 1. 192x192 PNG Icon
fs.writeFileSync(
  path.join(publicDir, 'pwa-192x192.png'),
  createPngBuffer(192, 192, (x, y, w, h) => renderIconPixel(x, y, 192, false))
);

// 2. 512x512 PNG Icon
fs.writeFileSync(
  path.join(publicDir, 'pwa-512x512.png'),
  createPngBuffer(512, 512, (x, y, w, h) => renderIconPixel(x, y, 512, false))
);

// 3. 512x512 Maskable PNG Icon
fs.writeFileSync(
  path.join(publicDir, 'pwa-maskable-512x512.png'),
  createPngBuffer(512, 512, (x, y, w, h) => renderIconPixel(x, y, 512, true))
);

// 4. Apple Touch Icon 180x180 PNG
fs.writeFileSync(
  path.join(publicDir, 'apple-touch-icon.png'),
  createPngBuffer(180, 180, (x, y, w, h) => renderIconPixel(x, y, 180, true))
);

// 5. Mobile Screenshot (540x960)
fs.writeFileSync(
  path.join(publicDir, 'screenshot-mobile.png'),
  createPngBuffer(540, 960, renderMobileScreenshot)
);

// 6. Desktop Screenshot (1280x720)
fs.writeFileSync(
  path.join(publicDir, 'screenshot-desktop.png'),
  createPngBuffer(1280, 720, renderDesktopScreenshot)
);

console.log('All PWA assets generated successfully in /public!');
