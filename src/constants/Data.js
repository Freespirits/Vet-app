export const ESPECIES = [
  'כלב', 'חתול', 'ציפור', 'דג', 'אוגר', 'ארנב', 'זוחל', 'אחר'
];

export const RACAS_CAES = [
  'כלב מעורב (ללא גזע מוגדר)', 'לברדור', 'גולדן רטריבר', 'רועה גרמני',
  'בולדוג צרפתי', 'פודל', 'רוטוויילר', 'יורקשייר טרייר', 'ביגל',
  'דאקסהונד (תחש)', 'בוקסר', 'האסקי סיבירי', 'בורדר קולי', 'צ׳יוואווה',
  'שי צו', 'פיטבול', 'מאלטז', 'אקיטה', 'דוברמן', 'קוקר ספנייל'
];

export const RACAS_GATOS = [
  'חתול מעורב (ללא גזע מוגדר)', 'פרסי', 'סיאמי', 'מיין קון', 'רגדול',
  'בריטי קצר שיער', 'אביסיני', 'ספינקס', 'בנגאלי', 'רוסי כחול',
  'חתול יער נורווגי', 'סקוטיש פולד', 'בירמן', 'אוריינטלי', 'אמריקאי קצר שיער'
];

export const TIPOS_CONSULTA = [
  'בדיקת שגרה', 'חיסון', 'טיפול בתולעים', 'ניתוח', 'חירום',
  'בדיקה', 'רחצה ותספורת', 'ביקור חוזר', 'עיקור/סירוס', 'אחרים'
];

export const MEDICAMENTOS = [
  {
    id: '1',
    name: 'Dipirona',
    category: 'משכך כאבים',
    dosage: '25mg/kg',
    frequency: 'כל 8 שעות',
    contraindications: 'רגישות יתר, אי ספיקת כליות',
    observations: 'להעדיף מתן לאחר אוכל'
  },
  {
    id: '2',
    name: 'Amoxicilina',
    category: 'אנטיביוטיקה',
    dosage: '20mg/kg',
    frequency: 'כל 12 שעות',
    contraindications: 'אלרגיה לפניצילין',
    observations: 'לסיים את הטיפול גם אם הסימפטומים משתפרים'
  },
  {
    id: '3',
    name: 'Prednisona',
    category: 'קורטיקוסטרואיד',
    dosage: '1-2mg/kg',
    frequency: 'כל 24 שעות',
    contraindications: 'זיהומים מערכתיים, סוכרת',
    observations: 'להפחית את המינון בהדרגה'
  },
  {
    id: '4',
    name: 'Metronidazol',
    category: 'אנטיביוטי/אנטי-פרוטוזואלי',
    dosage: '15-25mg/kg',
    frequency: 'כל 12 שעות',
    contraindications: 'הריון, הנקה',
    observations: 'לא לתת עם אלכוהול'
  }
];

export const VACINAS = [
  {
    id: '1',
    name: 'V8 ou V10',
    species: 'כלב',
    diseases: ['כלבלבת', 'הפטיטיס', 'פרוו', 'פאראינפלואנזה', 'אדנווירוס', 'קורונה', 'לפטוספירוזיס'],
    schedule: '6-8 שבועות, 10-12 שבועות, 14-16 שבועות',
    booster: 'שנתי'
  },
  {
    id: '2',
    name: 'כלבת',
    species: 'כלב/חתול',
    diseases: ['כלבת'],
    schedule: '12-16 שבועות',
    booster: 'שנתי'
  },
  {
    id: '3',
    name: 'חיסון משולש לחתולים',
    species: 'חתול',
    diseases: ['רינוטרכאיטיס', 'קליציבירוזיס', 'פנלוקופניה'],
    schedule: '6-8 שבועות, 10-12 שבועות',
    booster: 'שנתי'
  },
  {
    id: '4',
    name: 'לוקמיה חתולית',
    species: 'חתול',
    diseases: ['לוקמיה חתולית'],
    schedule: '8-10 שבועות, 12-14 שבועות',
    booster: 'שנתי'
  }
];

export const PROCEDIMENTOS = [
  { id: '1', name: 'בדיקה קלינית', duration: 30, price: 80 },
  { id: '2', name: 'חיסון', duration: 15, price: 45 },
  { id: '3', name: 'סירוס זכר', duration: 90, price: 300 },
  { id: '4', name: 'עיקור נקבה', duration: 120, price: 450 },
  { id: '5', name: 'ניקוי שיניים', duration: 60, price: 200 },
  { id: '6', name: 'רחצה ותספורת', duration: 90, price: 65 },
  { id: '7', name: 'בדיקת דם', duration: 15, price: 120 },
  { id: '8', name: 'צילום רנטגן', duration: 20, price: 150 },
  { id: '9', name: 'אולטרסאונד', duration: 30, price: 180 },
  { id: '10', name: 'ניתוח פשוט', duration: 120, price: 500 }
];