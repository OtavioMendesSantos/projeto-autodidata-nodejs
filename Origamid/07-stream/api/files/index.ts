import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { v } from '../../core/utils/validate.ts';
import { checkETag, mimeType } from './utils.ts';

export default class filesApi extends Api {
  handlers = {
    sendFile: async (req, res) => {
      const name = v.file(req.params.name);
      const filePath = `./files/${name}`;
      const ext = path.extname(name);
      
      let st;
      try {
        st = await stat(filePath);
      } catch (e) {
        throw new RouteError(404, 'Arquivo não encontrado');
      }

      const eTag = `W/${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}`;

      res.setHeader('ETag', eTag);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Length', `${st.size}`);
      res.setHeader('Last-Modified', `${st.mtime.toUTCString()}`);
      res.setHeader(
        'Content-Type',
        mimeType[ext] || 'application/octet-stream',
      );
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

      if (checkETag(req.headers['if-none-match'], eTag)) {
        res.status(304);
        res.end();
        console.log('cache :)');
        return;
      }
      res.status(200);

      const file = createReadStream(filePath);
      await pipeline(file, res);
    },
  } satisfies Api['handlers'];

  routes(): void {
    this.router.get('/files/:name', this.handlers.sendFile);
  }
}
