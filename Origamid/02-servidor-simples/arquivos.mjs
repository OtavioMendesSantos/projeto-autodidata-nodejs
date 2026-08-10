import fs from 'node:fs/promises'; // File System baseado em Promessas
import fsCallback from 'node:fs'; // File System baseado em Callbacks

try {
  await fs.mkdir('./produtos');
} catch {
  console.log('Diretório existente');
}

fsCallback.writeFile("./produtos/livro.json", JSON.stringify({
  nome: 'Livro',
}), null, (err) => {
  console.error(err);
})
fsCallback.readFile("./produtos/livro.json", "utf-8", (error, dados) => {
  console.log(dados);
});

const livro = fsCallback.readFileSync("./produtos/livro.json", "utf-8")
console.log("livro, executado antes de tudo",livro) // Evento síncrono, bloqueia event loop js

fs.writeFile('./produtos/teste.txt', 'teste');
fs.writeFile(
  './produtos/notebook.json',
  JSON.stringify({
    nome: 'Notebook',
  }),
);

const dados = await fs.readFile('./produtos/notebook.json', 'utf-8');
console.log(dados);
const dir = await fs.readdir('./produtos', { recursive: true });
console.log('Todos os arquivos:', dir);
console.log(
  'Arquivos filtrados:',
  dir.filter((file) => file.endsWith('.json')),
);
