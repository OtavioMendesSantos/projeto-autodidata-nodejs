const post = await fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    name: 'Otávio',
    email: 'otavio@gmail.com',
    senha: '123123',
  }),
});
console.log(await post.text());

// const get = await fetch('http://localhost:3000/produtos?cor=azul&tamanho=g', { method: 'GET' });
// console.log(await get.text());
//
// const response = await fetch('http://localhost:3000/', { method: 'GET' });
// console.log(await response.text());

