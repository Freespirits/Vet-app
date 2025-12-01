module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // סוגי הקומיטים המותרים
    'type-enum': [
      2,
      'always',
      [
        'feat',      // יכולת חדשה
        'fix',       // תיקון באג
        'docs',      // תיעוד
        'style',     // פורמט (ללא שינוי קוד)
        'refactor',  // ריפקטורינג
        'test',      // הוספה או שינוי של בדיקות
        'chore',     // עבודות תחזוקה
        'perf',      // שיפורי ביצועים
        'ci',        // שינויים ב-CI/CD
        'build',     // שינויים במערכת ה-Build
        'revert'     // החזרה לקומיט קודם
      ]
    ],

    // אורך מקסימלי של הנושא
    'subject-max-length': [2, 'always', 72],
    
    // נושא לא יכול להיות ריק
    'subject-empty': [2, 'never'],
    
    // נושא חייב להתחיל באות קטנה
    'subject-case': [2, 'always', 'lower-case'],
    
    // נושא לא אמור להסתיים בנקודה
    'subject-full-stop': [2, 'never', '.'],
    
    // סוג לא יכול להיות ריק
    'type-empty': [2, 'never'],
    
    // סוג חייב להיות באותיות קטנות
    'type-case': [2, 'always', 'lower-case'],
    
    // Scope חייב להיות באותיות קטנות
    'scope-case': [2, 'always', 'lower-case'],
    
    // אורך שורה מקסימלי לגוף
    'body-max-line-length': [1, 'always', 100],
    
    // אורך שורה מקסימלי ל-Footer
    'footer-max-line-length': [1, 'always', 100]
  },
  
  // הגדרות ייעודיות לפרויקט
  ignores: [
    // התעלמות מקומיטי merge
    (commit) => commit.includes('Merge'),

    // התעלמות מקומיטים אוטומטיים של Dependabot
    (commit) => commit.includes('dependabot'),

    // התעלמות מקומיטים ראשוניים
    (commit) => commit.includes('Initial commit')
  ],

  // פונקציות בדיקה מותאמות
  plugins: [
    {
      rules: {
        // בדיקה שקיימת הפניה ל-Issue עבור סוגים מסוימים
        'require-issue-ref': (parsed) => {
          const { type, body, footer } = parsed;

          // סוגים שדורשים הפניה ל-Issue
          const typesRequiringIssue = ['feat', 'fix'];
          
          if (typesRequiringIssue.includes(type)) {
            const hasIssueRef = 
              (body && /(?:close|closes|fix|fixes|resolve|resolves)\s+#\d+/i.test(body)) ||
              (footer && /(?:close|closes|fix|fixes|resolve|resolves)\s+#\d+/i.test(footer));
            
            return [
              hasIssueRef,
              `קומיטים מסוג '${type}' חייבים להפנות ל-Issue (לדוגמה: 'fixes #123')`
            ];
          }
          
          return [true];
        }
      }
    }
  ],
  
  // הגדרה עבור Scopes מותרים
  rules: {
    ...module.exports.rules,
    'scope-enum': [
      1,
      'always',
      [
        'auth',        // אימות
        'clients',     // מודול לקוחות
        'pets',        // מודול חיות מחמד
        'consultas',   // מודול ביקורים
        'agenda',      // מודול יומן
        'biblioteca',  // ספרייה וטרינרית
        'perfil',      // פרופיל משתמש
        'navegacao',   // מערכת ניווט
        'api',         // אינטגרציות API
        'db',          // מסד נתונים
        'ui',          // ממשק משתמש
        'utils',       // שירותי עזר
        'config',      // הגדרות
        'deps',        // תלותים
        'release'      // גרסאות
      ]
    ]
  }
};
