console.clear();

const BASE_URL = 'http://localhost:3000';

const functions = {
  async helloWorld() {
    const response = await fetch(BASE_URL);
    const body = await response.json();
    console.log(body);
  },
};

functions[process.argv[2]](); // node ./client.js getProducts
