const BASE_URL = 'http://localhost:3000';

const response = await fetch(BASE_URL + '/')
console.log(await response.json())
