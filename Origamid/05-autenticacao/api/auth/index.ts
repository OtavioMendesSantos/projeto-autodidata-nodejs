import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { AuthQuery } from './query.ts';
import { authTables } from './tables.ts';

export default class authApi extends Api {
  query = new AuthQuery(this.db);

  handlers = {
    postUser: (req, res) => {
      const { name, username, email, password } = req.body;
      const password_hash = password;
      const writeResult = this.query.insertUser({
        name,
        username,
        email,
        role: 'user',
        password_hash,
      });
      if (!writeResult.changes)
        throw new RouteError(400, 'Erro ao criar usuário');
      res.status(201).json({ title: 'Usuário criado' });
    },
    postLogin: (req, res) => {
      const { email, password } = req.body;
      console.log('login', req.body);
      const user = this.db.query(/*sql*/`
        SELECT "id", "password_hash"
        FROM users WHERE email = ?
      `).get(email);
      console.log('user', user);
      if (!user || user.password_hash !== password) {
        throw new RouteError(404, "Email ou senha incorretos");
      }
      res.setHeader("Set-Cookie", `sid=${user.id}; Path=/;`)
      res.status(200).json({ title: 'Login realizado' });
    }
  } satisfies Api['handlers'];

  tables() {
    this.db.exec(authTables);
  }

  routes() {
    this.router.post('/auth/user', this.handlers.postUser);
    this.router.post('/auth/login',this.handlers.postLogin);
  }
}
