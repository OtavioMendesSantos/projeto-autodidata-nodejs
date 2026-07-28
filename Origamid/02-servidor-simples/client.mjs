const post = await fetch('http://localhost:3000/', { method: 'POST' });
console.log(await post.text());

const get = await fetch('http://localhost:3000/produtos', { method: 'GET' });
console.log(await get.text());

const response = await fetch('http://localhost:3000/produtos', { method: 'DELETE' });
console.log(await response.text());
