const ESCAPE = '\u001b';

let clear = () => console.log('\033[2J\033[3J');

let line = (index, line) => console.log(`${ESCAPE}[${index + 1}H${ESCAPE}[K${line}`)

module.exports = {clear, line};
