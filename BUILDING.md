# מדריך הידור - PetCare Pro

מסמך זה מספק הוראות מפורטות לקימפול ולהפעלה של אפליקציית PetCare Pro על פני פלטפורמות שונות.

## 📋 דרישות מוקדמות

### כלים חובה
- **Node.js**: גרסה 18.x או חדשה יותר
- **npm** או **yarn**: מנהל חבילות
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**: לניהול גרסאות

### לפיתוח iOS
- **macOS**: נדרש לקימפול iOS
- **Xcode**: הגרסה העדכנית
- **iOS Simulator**: מגיע עם Xcode
- **חשבון מפתח Apple**: לפריסה על מכשירים פיזיים

### לפיתוח Android
- **Android Studio**: עם SDK ואמולטורים מוגדרים
- **Java Development Kit (JDK)**: גרסה 11 או חדשה יותר
- **Android SDK**: רמת API 33 או גבוהה יותר

## 🚀 הגדרת הסביבה

### 1. שכפול המאגר
```bash
git clone https://github.com/PetCareAi/consultorio-app.git
cd consultorio-app
```

### 2. התקנת התלויות
```bash
npm install
# או
yarn install
```

### 3. הגדרת מסד הנתונים
הריצו את סקריפט ה-SQL המסופק ב-`db/supabase.sql` בפרויקט ה-Supabase שלכם.

### 4. הגדרת משתני סביבה
צרו קובץ `.env` בשורש הפרויקט:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ תהליך הקימפול

### פיתוח מקומי
```bash
# מפעיל את שרת הפיתוח
npx expo start

# עבור iOS
npx expo start --ios

# עבור Android
npx expo start --android

# עבור Web
npx expo start --web
```

### קימפול להפקה

#### שימוש ב-EAS Build (מומלץ)
```bash
# התקנת EAS CLI
npm install -g eas-cli

# התחברות ל-Expo
eas login

# הגדרת הפרויקט
eas build:configure

# קימפול ל-Android
eas build --platform android

# קימפול ל-iOS
eas build --platform ios

# קימפול לשתי הפלטפורמות
eas build --platform all
```

#### קימפול מקומי
```bash
# ייצור קבצים נטיביים
npx expo prebuild

# עבור Android
npx expo run:android

# עבור iOS
npx expo run:ios
```

## 📱 בדיקת האפליקציה

### אמולטורים
```bash
# הפעלה באמולטור Android
npx expo start --android

# הפעלה בסימולטור iOS (macOS בלבד)
npx expo start --ios
```

### מכשירים פיזיים
1. התקינו את האפליקציה **Expo Go** במכשיר
2. הריצו `npx expo start`
3. סרקו את קוד ה-QR עם המצלמה (iOS) או Expo Go (Android)

## 🔧 פתרון בעיות

### ניקוי Cache
```bash
# ניקוי cache של Expo
npx expo start --clear

# ניקוי cache של npm
npm start -- --reset-cache

# ניקוי node_modules
rm -rf node_modules
npm install
```

### בעיות בתלויות
```bash
# תיקון תלויות אוטומטי
npx expo install --fix

# התקנה מחדש של כל התלויות
rm -rf node_modules package-lock.json
npm install
```

### בעיות בקימפולים
```bash
# ניקוי קימפולים קודמים
npx expo prebuild --clean

# איפוס מלא של הפרויקט
rm -rf .expo android ios
npx expo prebuild
```

## 📊 מדדי Build

### גדלי Bundle
- **Android APK**: כ-25-30 MB
- **iOS IPA**: כ-30-35 MB
- **Web Bundle**: כ-5-8 MB

### זמני קימפול
- **פיתוח**: 30-60 שניות
- **הפקת Android**: 5-10 דקות
- **הפקת iOS**: 10-15 דקות

## 🌐 הפצה לחנויות

### Google Play Store
1. הגדירו חתימות ב-EAS
2. הריצו `eas build --platform android --profile production`
3. העלו את קובץ ה-AAB שנוצר ל-Play Console

### Apple App Store
1. הגדירו תעודות הפצה
2. הריצו `eas build --platform ios --profile production`
3. השתמשו ב-Xcode או ב-EAS Submit לשליחה ל-App Store

## 🔄 אוטומציית CI/CD

### GitHub Actions
הפרויקט כולל Workflows עבור:
- בדיקות אוטומטיות
- Build פיתוח
- פריסה אוטומטית
- ניתוח קוד

### סקריפטים זמינים
```bash
# פיתוח
npm start

# בדיקות
npm test

# Build להפקה
npm run build:android
npm run build:ios

# Linting
npm run lint

# פורמט קוד
npm run format
```

## 📚 משאבים נוספים

- [תיעוד Expo](https://docs.expo.dev/)
- [תיעוד React Native](https://reactnative.dev/)
- [מדריך EAS Build](https://docs.expo.dev/build/introduction/)
- [תיעוד Supabase](https://supabase.com/docs)

## 🆘 תמיכה

אם אתם נתקלים בבעיות במהלך הקימפול:
1. בדקו את [הבעיות הידועות](./TROUBLESHOOTING.md)
2. עיינו ב[תיעוד התרומה](./CONTRIBUTING.md)
3. פתחו Issue ב-GitHub עם פרטי השגיאה
