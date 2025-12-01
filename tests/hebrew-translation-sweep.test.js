const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const readFile = (relativePath) => {
  const fullPath = path.join(__dirname, '..', relativePath);
  return fs.readFileSync(fullPath, 'utf8');
};

test('Main navigator branding and screen ids are translated to Hebrew', () => {
  const content = readFile('src/navigation/MainNavigator.js');
  assert.ok(content.includes('פטקייר פרו'));
  assert.ok(!content.includes('PetCare Pro'));
  assert.ok(!content.includes('Inicio'));
  assert.ok(!content.includes('Voltar'));
});

test('Loading component defaults to Hebrew messaging', () => {
  const content = readFile('src/components/common/Loading.js');
  assert.ok(content.includes('טוען...'));
  assert.ok(!content.includes('Carregando'));
});

test('Pet list experience is localized to Hebrew', () => {
  const content = readFile('src/screens/pets/PetListScreen.js');
  assert.ok(content.includes('לא נרשמו חיות מחמד ללקוח זה'));
  assert.ok(content.includes('לא נמצאו חיות מחמד'));
  assert.ok(content.includes('נסו חיפוש אחר'));
  assert.ok(content.includes('הוספת חיית מחמד'));
  assert.ok(content.includes('טוען חיות מחמד...'));
  assert.ok(content.includes('חיפוש חיות מחמד...'));
  assert.ok(content.includes('חדש'));
  assert.ok(content.includes('מציג חיות מחמד של לקוח מסוים'));
  assert.ok(content.includes('הצגת כל חיות המחמד'));
  assert.ok(!content.includes('Nenhum pet'));
  assert.ok(!content.includes('Cadastre o primeiro pet'));
  assert.ok(!content.includes('Buscar pets'));
});

test('Consultation creation flow uses Hebrew copy', () => {
  const content = readFile('src/screens/consultations/NewConsultationScreen.js');
  assert.ok(content.includes('טוען נתונים...'));
  assert.ok(content.includes('ייעוץ חדש'));
  assert.ok(content.includes('עריכת ייעוץ'));
  assert.ok(content.includes('סיכום הייעוץ'));
  assert.ok(content.includes('עלות הייעוץ (₪)'));
  assert.ok(content.includes('נתוני הייעוץ'));
  assert.ok(!content.includes('Nova Consulta'));
  assert.ok(!content.includes('Editar Consulta'));
});

test('Agenda empty state is translated to Hebrew', () => {
  const content = readFile('src/screens/agenda/AgendaScreen.js');
  assert.ok(content.includes('אין פגישות ביום זה'));
  assert.ok(!content.includes('Nenhum compromisso para este dia'));
});

test('Vet library search placeholder uses Hebrew', () => {
  const content = readFile('src/screens/library/VetLibraryScreen.js');
  assert.ok(content.includes('חיפוש בספרייה...'));
  assert.ok(!content.includes('Buscar na biblioteca...'));
});

test('Help and support content is localized to Hebrew', () => {
  const content = readFile('src/screens/profile/HelpSupportScreen.js');
  assert.ok(content.includes('עזרה ותמיכה'));
  assert.ok(content.includes('ערוצי שירות'));
  assert.ok(content.includes('שאלות נפוצות'));
  assert.ok(content.includes('שליחת הודעה'));
  assert.ok(!content.includes('Ajuda e Suporte'));
  assert.ok(!content.includes('Canais de Atendimento'));
  assert.ok(!content.includes('Perguntas Frequentes'));
});
