// show-qr.js
const qrcode = require("qrcode-terminal");
// Cambia esta IP/puerto si tu server cambia
const url = "http://192.168.0.3:3000";

console.log("\nEscanea este QR para abrir tu app en el móvil:\n");
qrcode.generate(url, { small: true });
console.log(`\nO abre manualmente: ${url}\n`);
