const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'qa-assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 1. Business Financial PDF (Base64)
// Content: "Financial Report: TechNova (TNVA). Sector: Cloud. Revenue: 500000. Net Income: 50000."
const businessPdfBase64 = 'JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqMiAwIG9iajw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kb2JqMyAwIG9iajw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqNCAwIG9iajw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+ZW5kb2JqNSAwIG9iajw8L0xlbmd0aCA4NT4+c3RyZWFtCkJULy9GMSAxMiBUZiA1MCA3MDAgVGQgKEZpbmFuY2lhbCBSZXBvcnQ6IFRlY2hOb3ZhIFwoVE5WQVwpLiBTZWN0b3I6IENsb3VkLiBSZXZlbnVlOiA1MDAwMDAuIE5ldCBJbmNvbWU6IDUwMDAwLikgVmogRVQKZW5kc3RyZWFtZW5kb2JqCnRyYWlsZXI8PC9Sb290IDEgMCBSPj4%%RU9G';

// 2. Non-Business PDF (Base64)
// Content: "My Holiday to Bali. We went to the beach and it was sunny."
const nonBusinessPdfBase64 = 'JVBERi0xLjEKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqMiAwIG9iajw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kb2JqMyAwIG9iajw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqNCAwIG9iajw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+ZW5kb2JqNSAwIG9iajw8L0xlbmd0aCA2MD4+c3RyZWFtCkJULy9GMSAxMiBUZiA1MCA3MDAgVGQgKE15IEhvbGlkYXkgdG8gQmFsaS4gV2Ugd2VudCB0byB0aGUgYmVhY2ggYW5kIGl0IHdhcyBzdW5ueS4pIFZqIEVUCmVuZHN0cmVhbWVuZG9iagp0cmFpbGVyPDwvUm9vdCAxIDAgUj4+%%RU9G';

// 3. Business Image (PNG - Small 100x100 with some "pixels" representing text/table)
// Using a generic valid small PNG base64
const businessImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gYKEiYwMzY2NgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLm3EAAAAnElEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgM8AsvEAAWv6SrkAAAAASUVORK5CYII=';

// 4. Simple WAV (Silence/Beep)
const voiceWavBase64 = 'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0Yf7///8AAAAA';

function writeBase64File(filename, base64) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  console.log(`Created: ${filename}`);
}

writeBase64File('business-report.pdf', businessPdfBase64);
writeBase64File('holiday-plan.pdf', nonBusinessPdfBase64);
writeBase64File('financial-table.png', businessImageBase64);
writeBase64File('voice-memo.wav', voiceWavBase64);

console.log('\nAll QA assets generated in /qa-assets/');
