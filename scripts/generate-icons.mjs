import fs from "fs";
import path from "path";
import sharp from "sharp";

const svgString = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#030712" />
  <path d="M128 128 L384 128 L384 384 L128 384 Z" fill="none" stroke="#39ff88" stroke-width="48" />
  <path d="M256 128 L256 384" fill="none" stroke="#39ff88" stroke-width="48" />
  <path d="M128 256 L384 256" fill="none" stroke="#39ff88" stroke-width="48" />
</svg>
`;

const iconsDir = path.join(process.cwd(), "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generate() {
  const buffer = Buffer.from(svgString);

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

  // For maskable icon, it's identical here as the design fits within safe zone
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, "maskable-icon-512.png"));
  console.log("Generated maskable-icon-512.png");

  // Apple touch icon
  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");
}

generate().catch(console.error);
