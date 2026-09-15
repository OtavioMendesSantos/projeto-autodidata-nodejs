import { createReadStream, createWriteStream } from 'node:fs';
import { rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { v } from '../../core/utils/validate.ts';
import { checkETag, limitBytes, mimeType } from './utils.ts';
import { randomUUID } from 'node:crypto';

const MAX_BYTES = 200 * 1024 * 1024; //200Mb
const FILES_PATH = './files';
export default class filesApi extends Api {
  handlers = {
    sendFile: async (req, res) => {
      const name = v.file(req.params.name);
      const filePath = path.join(FILES_PATH, name);
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
    uploadFile: async (req, res) => {
      if (req.headers['content-type'] !== 'application/octet-stream') {
        throw new RouteError(415, 'Use application');
      }

      const contentLength = Number(req.headers['content-length']);
      if (!Number.isInteger(contentLength)) {
        throw new RouteError(400, 'Content length inválido');
      }

      if (contentLength > MAX_BYTES) {
        throw new RouteError(400, 'Corpo grande');
      }

      const name = v.file(req.headers['x-filename']);
      const now = Date.now();
      const ext = path.extname(name);
      const finalName = `${name.replace(ext, '')}-${now}${ext}`;
      const tempPath = path.join(FILES_PATH, `${randomUUID()}.temp`);
      const writePath = path.join(FILES_PATH, finalName);
      const writeStream = createWriteStream(tempPath, { flags: 'wx' });
      try {
        await pipeline(req, limitBytes(MAX_BYTES), writeStream);
        await rename(tempPath, writePath);
        res
          .status(201)
          .json({
            title: 'Upload feito com sucesso',
            path: writePath,
            name: finalName,
          });
      } catch (err) {
        if (err instanceof RouteError) {
          throw new RouteError(err.status, err.message);
        } else {
          console.error(err)
          throw new RouteError(500, 'Ocorreu um erro');
        }
      } finally {
        await rm(tempPath, { force: true }).catch(() => {});
      }
    },
  } satisfies Api['handlers'];

  routes(): void {
    this.router.get('/files/:name', this.handlers.sendFile);
    this.router.post('/files', this.handlers.uploadFile);
  }
}
