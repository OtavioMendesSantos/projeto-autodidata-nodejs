import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const transform = new Transform({
  transform(chunk: Buffer, _enc, next) {
    const text = chunk.toString().toUpperCase()
    this.push(text)
    console.log("=================================")
    console.log(text.slice(0, 100))
    next()
    // next(null, text);
  },
});

await pipeline(
  createReadStream('./dados.json'),
//   transform,
  createGzip(), // transformador nativo do node
  createWriteStream('./dados-saida.gz'),
);
