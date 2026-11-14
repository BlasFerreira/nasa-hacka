// Genera los íconos PNG de la app (sin dependencias: dibuja con distancias a formas y codifica el PNG a mano).
//   node prototype/src/make_icons.js
// Marca: una planta (tallo + dos hojas) en blanco sobre azul NASA, con un punto rojo. No usa el logo de NASA.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const AZUL = [11, 61, 145], BLANCO = [255, 255, 255], ROJO = [252, 61, 33];

// Distancia con signo a una elipse rotada (aproximada, suficiente para suavizar bordes).
function elipse(x, y, cx, cy, a, b, grados) {
  const t = grados * Math.PI / 180, dx = x - cx, dy = y - cy;
  const u = dx * Math.cos(t) + dy * Math.sin(t), v = -dx * Math.sin(t) + dy * Math.cos(t);
  return (Math.sqrt((u / a) ** 2 + (v / b) ** 2) - 1) * Math.min(a, b);
}
function barra(x, y, x0, y0, x1, y1, r) { // segmento redondeado
  const px = x - x0, py = y - y0, dx = x1 - x0, dy = y1 - y0;
  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - t * dx, py - t * dy) - r;
}

// escala = tamaño del dibujo respecto del lienzo (la versión «maskable» lo deja dentro de la zona segura).
function pixel(u, v, escala) {
  const x = 0.5 + (u - 0.5) / escala, y = 0.5 + (v - 0.5) / escala;
  const d = Math.min(
    barra(x, y, 0.5, 0.74, 0.5, 0.34, 0.024),
    elipse(x, y, 0.385, 0.46, 0.17, 0.075, -38),
    elipse(x, y, 0.615, 0.37, 0.19, 0.082, 38),
  );
  if (d < 0) return BLANCO;
  if (Math.hypot(x - 0.5, y - 0.80) < 0.045) return ROJO;
  return AZUL;
}

function render(tam, escala) {
  const filas = [], ss = 3;
  for (let j = 0; j < tam; j++) {
    const fila = Buffer.alloc(1 + tam * 3); fila[0] = 0;
    for (let i = 0; i < tam; i++) {
      let r = 0, g = 0, b = 0;
      for (let sj = 0; sj < ss; sj++) for (let si = 0; si < ss; si++) {
        const c = pixel((i + (si + .5) / ss) / tam, (j + (sj + .5) / ss) / tam, escala);
        r += c[0]; g += c[1]; b += c[2];
      }
      const n = ss * ss; fila[1 + i * 3] = r / n; fila[2 + i * 3] = g / n; fila[3 + i * 3] = b / n;
    }
    filas.push(fila);
  }
  return png(tam, tam, Buffer.concat(filas));
}

const TABLA = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = buf => { let c = 0xffffffff; for (const b of buf) c = TABLA[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function trozo(tipo, datos) {
  const len = Buffer.alloc(4); len.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo), datos]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(cuerpo));
  return Buffer.concat([len, cuerpo, c]);
}
function png(w, h, crudo) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; // 8 bits, RGB
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), trozo('IHDR', ihdr), trozo('IDAT', zlib.deflateSync(crudo, { level: 9 })), trozo('IEND', Buffer.alloc(0))]);
}

const dir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(dir, { recursive: true });
const salidas = [
  ['icon-192.png', 192, 1], ['icon-512.png', 512, 1],
  ['icon-maskable-512.png', 512, 0.62],   // contenido dentro del 80 % central que respeta cualquier máscara
  ['apple-touch-icon.png', 180, 0.86],
];
for (const [nombre, tam, escala] of salidas) {
  const buf = render(tam, escala);
  fs.writeFileSync(path.join(dir, nombre), buf);
  console.log(nombre, tam + 'x' + tam, buf.length, 'bytes');
}
