const BASE_URL = 'http://localhost:3000';

const response1 = await fetch(BASE_URL + '/curso/javascript')
console.log(await response1.json())

const response2 = await fetch(BASE_URL + '/curso/html/grade')
console.log(await response2.json())

const response3 = await fetch(BASE_URL + '/aula/inicio')
console.log(await response3.json())

const response4 = await fetch(BASE_URL + '/')
console.log(await response4.json())
