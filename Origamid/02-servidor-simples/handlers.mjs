import {
  addCurso,
  addAula,
  getCursos,
  getCurso,
  getAulas,
  getAula,
} from './database.mjs';

export async function handleAddCurso(req, res) {
  try {
    const { slug, nome, descricao } = req.body;
    if (!slug || !nome || !descricao) {
      res
        .status(404)
        .json({ message: 'Slug, nome e descrição são obrigatórios.' });
      return;
    }
    const curso = addCurso({ slug, nome, descricao });
    if (curso) {
      res.status(201).json({ message: 'Curso adicionado com sucesso!' });
    } else {
      res.status(400).json({ message: 'Erro ao adicionar curso!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleAddAula(req, res) {
  try {
    const { curso_id, slug, nome } = req.body;
    if (!slug || !nome || !curso_id) {
      res
        .status(404)
        .json({ message: 'Slug, nome e curso_id são obrigatórios.' });
      return;
    }
    addAula({ curso_id, slug, nome });
    res.status(201).json({ message: 'Aula adicionada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetCursos(req, res) {
  try {
    const { curso } = req.body;

    res.status(201).json({ message: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetCurso(req, res) {
  try {
    const { curso } = req.body;

    res.status(201).json({ message: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetAulas(req, res) {
  try {
    const { slug, curso } = req.body;

    res.status(201).json({ message: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetAula(req, res) {
  try {
    const { slug, curso } = req.body;

    res.status(201).json({ message: '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}
