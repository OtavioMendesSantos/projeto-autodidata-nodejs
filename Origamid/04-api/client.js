console.clear();

const BASE_URL = 'http://localhost:3000';

const functions = {
  async helloWorld() {
    const response = await fetch(BASE_URL);
    const body = await response.json();
    console.log(body);
  },
  async postCourse() {
    const response = await fetch(BASE_URL + '/lms/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: 'html-e-css',
        title: 'HTML e CSS completo',
        description: 'Curso completo, do básico ao avançado',
        lessons: '60',
        hours: '100',
      }),
    });
    const body = await response.json();
    console.log(body);
  },
};

const targetFunction = functions[process.argv[2]];
if (!targetFunction) {
  console.warn('Função não encontrada, escreva corretamente e tente novamente');
} else {
  targetFunction(); // node ./client.js getProducts
}
