const resp1 = await fetch('http://localhost:3000/produtos', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify( {
    "nome": "Notebook",
    "slug": "notebook",
    "categoria": "eletronicos",
    "preco": 5000
  }),
});
console.log(await resp1.json());

const resp2 = await fetch('http://localhost:3000/produtos', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify( {
    "nome": "Cadeira",
    "slug": "cadeira",
    "categoria": "escritorio",
    "preco": 600
  }),
});
console.log(await resp2.json());

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
