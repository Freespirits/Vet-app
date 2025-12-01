const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const readFile = (relativePath) => {
  const fullPath = path.join(__dirname, '..', relativePath);
  return fs.readFileSync(fullPath, 'utf8');
};

test('App splash screen uses Hebrew app name', () => {
  const content = readFile('App.js');
  assert.ok(content.includes('פטקייר פרו'));
});

test('Species list is translated to Hebrew', () => {
  const content = readFile('src/constants/Data.js');
  assert.ok(content.includes("'כלב'"));
});

test('Home screen greetings use Hebrew', () => {
  const content = readFile('src/screens/HomeScreen.js');
  assert.ok(content.includes('בוקר טוב'));
});

test('Login validation messages are in Hebrew', () => {
  const content = readFile('src/screens/auth/LoginScreen.js');
  assert.ok(content.includes('אימייל הוא שדה חובה'));
});
