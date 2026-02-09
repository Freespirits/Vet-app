const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const readFile = (relativePath) => {
  const fullPath = path.join(__dirname, '..', relativePath);
  return fs.readFileSync(fullPath, 'utf8');
};

test('Selected pet display uses a defined variable', () => {
  const content = readFile('src/screens/agenda/NewAppointmentScreen.js');
  assert.ok(
    content.includes('selectedPet && ('),
    'Selected pet display should guard on a defined selectedPet variable'
  );
});
