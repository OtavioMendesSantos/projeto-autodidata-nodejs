import { createReadStream, createWriteStream } from 'node:fs';
import { createServer } from 'node:http';
import { pipeline } from 'node:stream/promises';

const log = createWriteStream('./log.txt', { flags: 'a' });

const server = createServer(async (req, res) => {
  try {
    const dados = createReadStream('./dados.json');
    log.write(`${req.method} ${req.socket.remoteAddress}\n`);
    res.setHeader('content-type', 'application/json');
    await pipeline(dados, res);
  } catch (err) {
    console.error(err);
    res.end('error')
  }
});

server.listen(3000).on('close', () => {
  log.end();
});
