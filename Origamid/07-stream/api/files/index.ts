import { Api } from '../../core/utils/abstract.ts';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { v } from '../../core/utils/validate.ts';

export default class filesApi extends Api {
  handlers = {
    sendFile: async (req, res) => {
      const name = v.file(req.params.name);
      const filePath = `./files/${name}`;
      const file = createReadStream(filePath);
      await pipeline(file, res);
    },
  } satisfies Api['handlers'];

  routes(): void {
    this.router.get('/files/:name', this.handlers.sendFile);
  }
}
