import {
  addCurso,
  addAula,
  getCursos,
  getCurso,
  getAulas,
  getAula,
} from './database.ts';
import type { Handler } from './router.ts';

export const handleAddCurso: Handler = (req, res) => {
  try {
    const { slug, nome, descricao } = req.body;
    if (!slug || !nome || !descricao) {
      res
        .status(404)
        .json({ message: 'Slug, nome e descrição são obrigatórios.' });
      return;
    }
    const curso = addCurso({ slug, nome, descricao });
    if (!curso) {
      res.status(400).json({ message: 'Erro ao adicionar curso.' });
      return;
    }
    res.status(201).json({ message: 'Curso adicionado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};

export const handleAddAula: Handler = (req, res) => {
  try {
    const { cursoSlug, slug, nome } = req.body;
    if (!slug || !nome || !cursoSlug) {
      res
        .status(404)
        .json({ message: 'Slug, nome e curso slug são obrigatórios.' });
      return;
    }
    const aula = addAula({ cursoSlug, slug, nome });
    if (!aula) {
      res.status(400).json({ message: 'Erro ao adicionar aula.' });
      return;
    }
    res.status(201).json({ message: 'Aula adicionada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};

export const handleGetCursos: Handler = (req, res) => {
  try {
    const cursos = getCursos();
    if (!cursos || !cursos.length) {
      res.status(400).json({ message: 'Cursos não encontrados.' });
      return;
    }
    res
      .status(200)
      .json({ message: 'Cursos buscados com sucesso', data: cursos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};

export const handleGetCurso: Handler = (req, res) => {
  try {
    const slug = req.query.get('slug');
    if (!slug) {
      res.status(404).json({ message: 'Slug é obrigatório.' });
      return;
    }
    const curso = getCurso({ slug });
    if (!curso) {
      res.status(400).json({ message: 'Curso não encontrado.' });
      return;
    }
    res.status(200).json({ message: 'Curso buscado com sucesso', data: curso });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};

export const handleGetAulas: Handler = (req, res) => {
  try {
    const cursoSlug = req.query.get('curso');
    if (!cursoSlug) {
      res.status(400).json({ message: 'Curso é obrigatório' });
      return;
    }

    const aulas = getAulas({ cursoSlug });
    if (!aulas || !aulas.length) {
      res.status(400).json({ message: 'Aulas não encontrados.' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Aulas buscadas com sucesso', data: aulas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};

export const handleGetAula: Handler = (req, res) => {
  try {
    const slug = req.query.get('slug');
    const curso = req.query.get('curso');
    if (!slug || !curso) {
      res.status(400).json({ message: 'Slug e curso são obrigatórios' });
      return;
    }
    const aula = getAula({ slug, curso });
    if (!aula) {
      res.status(404).json({ message: 'Aula não encontrada.' });
      return;
    }
    res
      .status(200)
      .json({ message: 'Aula encontrada com sucesso.', data: aula });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
};
