console.clear();

const BASE_URL = 'http://localhost:3000';

const functions = {
  async getProducts() {
    const response = await fetch(BASE_URL + '/products/notebook');
    const body = await response.json();
    console.table(body);
  },
};

functions[process.argv[2]]();
