import { Api } from '../../core/utils/abstract.ts';
import { lmsTables } from './tables.ts';

export default class lmsApi extends Api {
  handlers = {} satisfies Api['handlers'];

  tables() {
    this.db.exec(lmsTables);
  }

  routes() {}
}
