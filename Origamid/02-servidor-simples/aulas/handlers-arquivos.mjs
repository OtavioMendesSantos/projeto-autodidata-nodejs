import fs from 'node:fs/promises';
import path from 'node:path';

export async function handleAddProduto(req, res) {
  try {
    const { slug, categoria } = req.body;
    if (!slug || !categoria) {
      res.status(400).json({
        message: 'Falta categoria e/ou slug.',
      });
      return;
    }

    const diretorio = `./produtos/${categoria}`;
    await fs.mkdir(diretorio, { recursive: true });

    await fs.writeFile(`${diretorio}/${slug}.json`, JSON.stringify(req.body));

    res.status(201).json({ message: 'Produto inserido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetProduto(req, res) {
  try {
    const categoria = req.query.get('categoria');
    const slug = req.query.get('slug');
    if (!slug || !categoria) {
      req.status(400).json({
        message: 'Falta categoria e/ou slug.',
      });
      return;
    }

    path.join('.', 'produtos', categoria, `${slug}.json`);
    const file = await fs.readFile(filePath, 'utf-8');
    if (!file) {
      res.status(404).json({
        message: 'Arquivo não encontrado.',
      });
      return;
    }

    res.status(200).json({
      message: 'Produto retornado com sucesso.',
      data: JSON.parse(file),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aconteceu um erro.' });
  }
}

export async function handleGetProdutos(req, res) {
  try {
    const dir = await fs.readdir('./produtos', { recursive: true });
    const filteredData = dir.filter((file) => file.endsWith('.json'));
    const data = await Promise.all(
      filteredData.map(async (item) => {
        const filePath = path.join('./produtos', item);
        const file = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(file);
      }),
    );

    res.status(200).json({
      message: 'Produtos retornados com sucesso.',
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Aconteceu um erro.' });
  }
}
