import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const transform = new Transform({
  transform(chunk: Buffer, _enc, next) {
    console.log(chunk.toString());
    const dados = JSON.parse(chunk.toString());
    const filtrados = dados.filter((item: any) => item.vitalicio === 'true');
    this.push(JSON.stringify(filtrados));
    next();
    // next(null, text);
  },
});

await pipeline(
  createReadStream('./dados.json', { highWaterMark: 20 }),
  transform,
  // createGzip(), // transformador nativo do node
  createWriteStream('./dados-saida.json'),
);
