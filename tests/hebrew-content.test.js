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

test('Vet library categories and errors use Hebrew labels', () => {
  const content = readFile('src/screens/library/VetLibraryScreen.js');
  assert.ok(content.includes("'הכול'"));
  assert.ok(content.includes('תרופות'));
  assert.ok(!content.includes('Erro'));
});

test('Profile editor validation is translated to Hebrew', () => {
  const content = readFile('src/screens/profile/EditProfileScreen.js');
  assert.ok(content.includes('שם הוא שדה חובה'));
  assert.ok(content.includes('מקצוע הוא שדה חובה'));
  assert.ok(content.includes('שם המרפאה הוא שדה חובה'));
  assert.ok(!content.includes('Nome é obrigatório'));
});

test('Change password validation is translated to Hebrew', () => {
  const content = readFile('src/screens/profile/ChangePasswordScreen.js');
  assert.ok(content.includes('הסיסמה החדשה היא שדה חובה'));
  assert.ok(content.includes('יש לאשר את הסיסמה החדשה'));
  assert.ok(content.includes('הסיסמאות אינן זהות'));
  assert.ok(!content.includes('Nova senha é obrigatória'));
});

test('New client form validation is in Hebrew', () => {
  const content = readFile('src/screens/clients/NewClientScreen.js');
  assert.ok(content.includes('שם הלקוח הוא שדה חובה'));
  assert.ok(content.includes('האימייל הוא שדה חובה'));
  assert.ok(content.includes('טלפון הוא שדה חובה'));
  assert.ok(!content.includes('Nome é obrigatório'));
});

test('Agenda screen uses Hebrew labels and errors', () => {
  const content = readFile('src/screens/agenda/AgendaScreen.js');
  assert.ok(content.includes('שגיאה בטעינת היומן'));
  assert.ok(content.includes('קביעת תור'));
  assert.ok(content.includes('תסמינים'));
  assert.ok(!content.includes('Erro ao carregar agenda'));
});

test('New appointment form validation is translated to Hebrew', () => {
  const content = readFile('src/screens/agenda/NewAppointmentScreen.js');
  assert.ok(content.includes('הלקוח הוא שדה חובה'));
  assert.ok(content.includes('חיית המחמד היא שדה חובה'));
  assert.ok(content.includes('סוג הביקור הוא שדה חובה'));
  assert.ok(content.includes('תאריך ושעה הם שדות חובה'));
  assert.ok(!content.includes('Cliente é obrigatrio'));
});

test('Notification settings screen is in Hebrew', () => {
  const content = readFile('src/screens/profile/NotificationSettingsScreen.js');
  assert.ok(content.includes('התראות'));
  assert.ok(content.includes('תזכורות'));
  assert.ok(content.includes('התראות דחופות'));
  assert.ok(!content.includes('Notificações'));
});

test('Backup settings messaging is translated to Hebrew', () => {
  const content = readFile('src/screens/profile/BackupSettingsScreen.js');
  assert.ok(content.includes('גיבוי ושחזור'));
  assert.ok(content.includes('הנתונים שוחזרו בהצלחה'));
  assert.ok(content.includes('הגיבוי כולל את כל הייעוצים'));
  assert.ok(!content.includes('Backup e Restauração'));
});

test('Patient details view uses Hebrew labels', () => {
  const content = readFile('src/screens/PatientDetailsScreen.js');
  assert.ok(content.includes('מטופל לא נמצא'));
  assert.ok(content.includes('מין'));
  assert.ok(content.includes('תצפיות'));
  assert.ok(!content.includes('Paciente não encontrado'));
});

test('Version info screen changelog is translated to Hebrew', () => {
  const content = readFile('src/screens/profile/VersionInfoScreen.js');
  assert.ok(content.includes('גרסת אפליקציה נוכחית'));
  assert.ok(content.includes('יומן שינויים'));
  assert.ok(content.includes('שיפור ביצועים כללי'));
  assert.ok(!content.includes('Lançamento inicial do VetApp'));
  assert.ok(!content.includes('Melhorias na sincronização de dados'));
});

test('New pet form copy is localized to Hebrew', () => {
  const content = readFile('src/screens/pets/NewPetScreen.js');
  assert.ok(content.includes('שם חיית המחמד הוא שדה חובה'));
  assert.ok(content.includes('בעלים הוא שדה חובה'));
  assert.ok(content.includes('סוג החיה הוא שדה חובה'));
  assert.ok(content.includes('יש לבחור מין לחיית המחמד'));
  assert.ok(!content.includes('Nome é obrigatório'));
});

test('Profile settings and actions use Hebrew labels', () => {
  const content = readFile('src/screens/profile/ProfileScreen.js');
  assert.ok(content.includes('הגדרות'));
  assert.ok(content.includes('גיבוי ושחזור'));
  assert.ok(content.includes('התראות'));
  assert.ok(content.includes('התנתקות מהחשבון'));
  assert.ok(!content.includes('Backup e Restauração'));
});

test('About screen FAQ is fully translated to Hebrew', () => {
  const content = readFile('src/screens/profile/AboutScreen.js');
  assert.ok(content.includes('מהו ה-VetApp?'));
  assert.ok(content.includes('איך קובעים תור במערכת?'));
  assert.ok(content.includes('האם המידע שלי מאובטח?'));
  assert.ok(!content.includes('O que é o VetApp?'));
});

test('Client list screen messages are in Hebrew', () => {
  const content = readFile('src/screens/clients/ClientListScreen.js');
  assert.ok(content.includes('לא נמצאו לקוחות'));
  assert.ok(content.includes('חיפוש לקוחות'));
  assert.ok(content.includes('מחיקת לקוח'));
  assert.ok(!content.includes('Nenhum cliente encontrado'));
});
