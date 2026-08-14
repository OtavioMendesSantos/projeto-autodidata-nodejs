const BASE_URL = 'http://localhost:3000';

const curso = {
  slug: 'html',
  nome: 'HTML',
  descricao: 'HTML completo',
};

const aula = {  curso_id: '1',  slug: 'aula-1',
  nome: 'Grade horária'};

const resp1 = await fetch(BASE_URL + '/cursos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(curso),
});
console.log(await resp1.json());

// await fetch(BASE_URL + '/aulas', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(aula),
// });

// const response = await fetch('http://localhost:3000/produtos', { method: 'GET' });
// console.log(await response.text())

// const response = await fetch('http://localhost:3000/produto?categoria=eletronicos&slug=notebook', { method: 'GET' });
// console.log(await response.json())

// const response = await fetch('http://localhost:3000/produto?cor=azul&tamanho=g', { method: 'POST' });
// console.log(response.headers)
// console.log(typeof await response.text()); // String
// console.log(await response.json()); // Object

// const response = await fetch('http://localhost:3000/', { method: 'GET' });
// console.log(await response.text());
