import { createWriteStream } from 'node:fs';
import { createServer } from 'node:http';

const log = createWriteStream('./log.txt', { flags: 'a' });

const server = createServer((req, res) => {
  log.write(`${req.method} ${req.socket.remoteAddress}\n`);
  res.write('pre teste ')
  res.end('teste');
});

server.listen(3000).on('close', () => {
  log.end();
});
