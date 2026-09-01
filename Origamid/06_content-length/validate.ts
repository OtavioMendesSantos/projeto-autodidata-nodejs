function string(x: unknown) {
  if (typeof x !== 'string' || x.trim().length === 0) return undefined;
  return x;
}

function number(x: unknown) {
  if (typeof x === 'number') return Number.isFinite(x) ? x : undefined;
  return undefined;
}

function boolean(x: unknown) {
  if (typeof x === 'boolean') return x;
  if (x === true || x === 'true' || x === 1 || x === '1' || x === 'on')
    return true;
  if (x === false || x === 'false' || x === 0 || x === '0' || x === 'off')
    return false;
  return undefined;
}

// console.log(string(' a'));
// console.log(number(NaN));
// console.log(boolean('true'));
// console.log(boolean('false'));

// formatar
// normalizar
// escapar
// sanitizar 

function cpf(x: string) {
  return x.replace(/\D+/g, '');
}

cpf('123.456.789-09');

const a = `é`.normalize('NFC');
const b = `e\u0301`.normalize('NFC');

console.log(a === b, a, b);

const nome = ' Otávio '.trim();

function escapeHtml(x: string) {
  return x
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function email(x: string) {
  return /^[^@]+@[^@]+$/.test(x) ? x : undefined;
}

console.log(email('teste@exemplo.com'));
console.log(email('testeexemplo.com'));