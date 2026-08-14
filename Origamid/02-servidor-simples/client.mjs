const BASE_URL = 'http://localhost:3000';

const curso1 = {
  slug: 'javascript',
  nome: 'JavaScript',
  descricao: 'JavaScript completo',
};

const curso2 = {
  slug: 'html',
  nome: 'HTML',
  descricao: 'HTML completo',
};

const aula1 = { cursoSlug: 'javascript', slug: 'aula-1', nome: 'Conteúdo' };
const aula2 = { cursoSlug: 'javascript', slug: 'aula-2', nome: 'Lógica de Programação' };

const resp1 = await fetch(BASE_URL + '/cursos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(curso1),
});
console.log(await resp1.json());

await fetch(BASE_URL + '/cursos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(curso2),
});

const resp2 = await fetch(BASE_URL + '/aulas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(aula1),
});
console.log(await resp2.json());
await fetch(BASE_URL + '/aulas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(aula2),
});

const resp3 = await fetch(BASE_URL + '/cursos')
console.log(await resp3.json())

const resp4 = await fetch(BASE_URL + '/curso?slug=javascript')
console.log(await resp4.json())

const resp5 = await fetch(BASE_URL + '/aulas?curso=javascript')
console.log(await resp5.json())

const resp6 = await fetch(BASE_URL + '/aula?curso=javascript&slug=aula-1')
console.log(await resp6.json())
