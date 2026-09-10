import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

setInterval(() => {
  for (let i = 0; i < 100; i++) {
    // entrada.txt -> 20mb 
    // receiveFile(i);   // -> +32GB de memória kkkk
    receiveFileStream(i) // +/- 1.5 GB de memória
  }
}, 500);

async function receiveFile(i: number) {
  const body = await readFile('./entrada.txt');
  await writeFile(`./saida/saida-${i}.txt`, body);
}

async function receiveFileStream (i: number){
  const read = createReadStream('./entrada.txt');
  const write = createWriteStream(`./saida/saida-${i}.txt`)
  await pipeline(read, write)
}