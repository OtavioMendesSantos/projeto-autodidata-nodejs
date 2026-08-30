import { Api } from '../../core/utils/abstract.ts';
import { RouteError } from '../../core/utils/route-error.ts';
import { AuthMiddleware } from './middleware/auth.ts';
import { AuthQuery } from './query.ts';
import { COOKIE_SID_NAME, SessionService } from './services/session.ts';
import { authTables } from './tables.ts';
import { Password } from './utils/password.ts';

export default class authApi extends Api {
  query = new AuthQuery(this.db);

  session = new SessionService(this.core);
  authMiddleware = new AuthMiddleware(this.core);
  password = new Password('segredo');

  handlers = {
    postUser: async (req, res) => {
      const { name, username, email, password } = req.body;

      const emailExists = this.query.selectUser({
        key: 'email',
        value: email,
      });

      if (emailExists) {
        throw new RouteError(409, 'Email existente');
      }

      const usernameExists = this.query.selectUser({
        key: 'username',
        value: username,
      });
      if (usernameExists) {
        throw new RouteError(409, 'Username existente');
      }

      const password_hash = await this.password.hash(password);

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
    postLogin: async (req, res) => {
      const { email, password } = req.body;
      const user = this.query.selectUser({ key: 'email', value: email });
      if (!user) {
        throw new RouteError(400, 'Email ou senha incorretos');
      }
      const validPassword = await this.password.verify(
        password,
        user.password_hash,
      );
      if (!validPassword) {
        throw new RouteError(400, 'Email ou senha incorretos');
      }

      const { cookie } = await this.session.create({
        userId: user.id,
        ip: req.ip,
        ua: req.headers['user-agent'] ?? '',
      });
      res.setCookie(cookie);
      res.status(200).json({ title: 'Login realizado' });
    },
    getSession: async (req, res) => {
      if (!req.session) {
        throw new RouteError(401, 'Não autorizado');
      }
      res.status(200).json({ title: 'Sessão válida' });
    },
    deleteSession: async (req, res) => {
      const sid = req.cookies[COOKIE_SID_NAME];
      const { cookie } = await this.session.inValidate(sid);
      res.setCookie(cookie);
      res.setHeader('Cache-Control', 'private, no-store');
      res.setHeader('Vary', 'Cookie');
      res.status(204).json({ title: 'Logout' });
    },
    updatePassword: async (req, res) => {
      const { password, newPassword } = req.body;
console.log(password, req.body)
      const session = req.session;
      if (!session) throw new RouteError(401, 'Não autenticado');

      const user = this.query.selectUser({ key: 'id', value: session.userId });
      if (!user) throw new RouteError(404, 'Usuário não encontrado');

      const isValidPassword = await this.password.verify(
        password,
        user.password_hash,
      );
      if (!isValidPassword) throw new RouteError(400, 'Senha atual incorreta');

      const isSamePass = await this.password.verify(
        newPassword,
        user.password_hash,
      );
      if (password === newPassword || isSamePass)
        throw new RouteError(
          401,
          'A nova senha não pode ser igual à senha antiga',
        );

      const newPasswordHash = await this.password.hash(newPassword);
      const writeResult = this.query.updateUser({
        user_id: session.userId,
        key: 'password_hash',
        value: newPasswordHash,
      });
      if (!writeResult.changes) {
        throw new RouteError(400, 'Erro ao atualizar senha');
      }

      this.session.inValidateAll(session.userId);
      const { cookie } = await this.session.create({
        userId: session.userId,
        ip: req.ip,
        ua: req.headers['user-agent'] ?? '',
      });
      res.setCookie(cookie);
      res.status(200).json({ title: 'Senha alterada com sucesso' });
    },
  } satisfies Api['handlers'];

  tables() {
    this.db.exec(authTables);
  }

  routes() {
    this.router.post('/auth/user', this.handlers.postUser);
    this.router.post('/auth/login', this.handlers.postLogin);
    this.router.delete('/auth/logout', this.handlers.deleteSession);
    this.router.get('/auth/session', this.handlers.getSession, [
      this.authMiddleware.guard('user'),
    ]);
    this.router.put('/auth/update/password', this.handlers.updatePassword, [
      this.authMiddleware.guard('user'),
    ]);
  }
}
