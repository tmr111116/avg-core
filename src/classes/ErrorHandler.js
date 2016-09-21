

export function error(text, isThrow = true) {
  console.error('Error: ' + text + '.');
  if (isThrow) throw 'Error: ' + text + '.';
}

export function warn(text, isThrow = false) {
  console.warn('Warning: ' + text + '.');
  if (isThrow) throw 'Warning: ' + text + '.';
}

module.exports = {
  error,
  warn,
};
