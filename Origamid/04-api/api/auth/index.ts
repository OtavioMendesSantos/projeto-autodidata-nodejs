import { Api } from '../../core/utils/abstract.ts';
import { authTables } from './tables.ts';

export default class authApi extends Api {
  handlers = {} satisfies Api['handlers'];

  tables() {
    this.db.exec(authTables);
  }

  routes() {}
}
