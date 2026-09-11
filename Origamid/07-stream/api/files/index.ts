import { readFile } from 'node:fs/promises';
import { Api } from '../../core/utils/abstract.ts';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export default class filesApi extends Api {
  handlers = {
    sendFile: async (req, res) => {
      const filePath = `./files/${req.params.name}`;
      const file = createReadStream(filePath);
      await pipeline(file, res);
    },
  } satisfies Api['handlers'];

  routes(): void {
    this.router.get('/files/:name', this.handlers.sendFile);
  }
}
