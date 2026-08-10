export const routes = {
  GET: {
    '/': (req, res) => {
      res.end('Home');
    },
    '/produto/notebook': (req, res) => {
      res.end('Produto - Notebook');
    },
  },
  POST: {
    '/produto': (req, res) => {
      res.end('Notebook Post');
    },
  },
};
