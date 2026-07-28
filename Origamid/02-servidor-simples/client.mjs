const get = await fetch('http://localhost:3000/produtos?cor=azul&tamanho=g', { method: 'GET' });
console.log(await get.text());

// const post = await fetch('http://localhost:3000/produtos', {
//   method: 'POST',
//   headers: { 'content-type': 'application/json' },
// });
// console.log(await post.text());

// const response = await fetch('http://localhost:3000/', { method: 'GET' });
// console.log(await response.text());
// 