//** trim e não aceita string vazia*/
function string(x: unknown) {
  if (typeof x !== 'string' || x.trim().length === 0) return undefined;
  const s = x.trim();
  if (s.length === 0) return undefined;
  return s;
}

//** valida e se possível converte para número*/
function number(x: unknown) {
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : undefined;
  }
  if (typeof x === 'string' && x.trim().length !== 0) {
    const n = Number(x);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

//** aceita valores boolean like */
function boolean(x: unknown) {
  if (typeof x === 'boolean') return x;
  if (x === true || x === 'true' || x === 1 || x === '1' || x === 'on')
    return true;
  if (x === false || x === 'false' || x === 0 || x === '0' || x === 'off')
    return false;
  return undefined;
}

/** aceita apenas objetos literais */
function object(x: unknown): Record<string, unknown> | undefined {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
    ? x as Record<string, unknown>
    : undefined;
}

// console.log(string(' a'));
// console.log(number(NaN));
// console.log(boolean('true'));
// console.log(boolean('false'));

const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

//** valida email */
function email(x: unknown) {
  const s = string(x)?.toLowerCase();
  if (!s) return undefined;
  return emailRegex.test(s) ? x : undefined;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

//** minimo 10, maximo 256 caracteres, deve conter pelo menos uma letra minuscula, uma letra maiuscula e um numero */
function password(x: unknown) {
  if (typeof x !== 'string') return undefined;
  if (x.length < 10 || x.length > 256) return undefined;
  return passwordRegex.test(x) ? x : undefined;
}

console.log(email('teste@exemplo.com'));
console.log(email('testeexemplo.com'));
