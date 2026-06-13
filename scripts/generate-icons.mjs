import fs from "fs";
import path from "path";
import sharp from "sharp";

const svgString = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark Background -->
  <rect width="512" height="512" fill="#05070d" />
  
  <!-- Subtle Background Grid -->
  <path d="M128 0 V512 M256 0 V512 M384 0 V512" stroke="#39ff88" stroke-opacity="0.1" stroke-width="4" />
  <path d="M0 128 H512 M0 256 H512 M0 384 H512" stroke="#39ff88" stroke-opacity="0.1" stroke-width="4" />

  <!-- D Monogram -->
  <g transform="translate(152, 128)">
    <path d="M 0 0 L 100 0 C 170 0 208 45 208 128 C 208 211 170 256 100 256 L 0 256 Z" fill="none" stroke="#39ff88" stroke-width="36" />
    <path d="M 0 -18 V 274" fill="none" stroke="#39ff88" stroke-width="36" stroke-linecap="round" />
    
    <!-- Check-in Block inside D -->
    <rect x="64" y="88" width="80" height="80" fill="#39ff88" rx="12" />
  </g>
</svg>
`;

const iconsDir = path.join(process.cwd(), "public", "icons");
const publicDir = path.join(process.cwd(), "public");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generate() {
  const buffer = Buffer.from(svgString);

  // Write source SVG just in case
  fs.writeFileSync(path.join(iconsDir, "icon-source.svg"), svgString);

  await sharp(buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, "icon-192.png"));
  console.log("Generated icon-192.png");

  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, "icon-512.png"));
  console.log("Generated icon-512.png");

  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, "maskable-icon-512.png"));
  console.log("Generated maskable-icon-512.png");

  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");

  // Create a 32x32 favicon
  await sharp(buffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon.png"));
  console.log("Generated public/favicon.png");
}

generate().catch(console.error);
