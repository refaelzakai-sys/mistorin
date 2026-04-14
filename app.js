import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCSasC04P47s6hUaADppcWwOatcuwvU3g",
  authDomain: "ataramistorin.firebaseapp.com",
  projectId: "ataramistorin",
  storageBucket: "ataramistorin.firebasestorage.app",
  messagingSenderId: "195901209419",
  appId: "1:195901209419:web:d06ebc537d46c25a9086ce",
  measurementId: "G-ZF711QE9M1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TG_TOKEN = "8478781604:AAGDXQnCp5kYKeGjoOp6SomxseseoSLyX7A";
const ADMIN_IDS = ["8373785890", "7089165458"];

// מאגר רמזים מוגדר מראש לכל החודש הראשון
const clues = {
    daily: {
        "14-04": "0x53 0x54 0x41 0x52 0x54 - האתחול החל. המעגל נפתח.",
        "15-04": "האם אתה מרגיש את העדשה? היא תמיד מופנית אליך.",
        "16-04": "קואורדינטות אותרו: 32.9646° N (צפון).",
        "17-04": "קואורדינטות הושלמו: 35.4944° E (צפת).",
        "18-04": "מערכת הניטור עברה למצב 'פעיל'. אל תזוז.",
        "19-04": "דוח שבועי 01 זמין. המעגל מתהדק.",
        "20-04": "Subject ID: 1092. הסטטוס: תחת מעקב.",
        "21-04": "בינארי: 01010111 01000001 01010100 01000011 01001000 (WATCH)",
        "22-04": "הקלטה נמחקה. שרידים נותרו בתיקייה 04.",
        "23-04": "יום ההולדת של המערכת? או אולי יום הדין?",
        "24-04": "מישהו השאיר את המצלמה דולקת במעבדה.",
        "25-04": "אל תבטח בחיווי הירוק. הוא משקר.",
        "26-04": "דוח שבועי 02 זמין. הקולות בוקעים מהקופסה.",
        "27-04": "המרחק בינך לבין המצלמה הקרובה: 1.2 מטר.",
        "28-04": "משפט מהארכיון: 'המעגל הוא המקום הבטוח היחיד'.",
        "29-04": "שגיאה 404: הפרטיות לא נמצאה.",
        "30-04": "טעינת פרוטוקול 'עין צופייה'... 88% הושלמו.",
        "01-05": "SYSTEM BREACH: האתר נפרץ. המערכת כחולה.",
        "02-05": "מי היה שם לפניך? הריח של האוזון עוד באוויר.",
        "03-05": "דוח שבועי 03 זמין. הם יודעים עליך הכל.",
        "04-05": "קוד גישה זמני: 8478-ALPHA.",
        "05-05": "השתקפות בחלון. זו לא רק השתקפות שלך.",
        "06-05": "תדר 440Hz זוהה. מסר חבוי בתוך הצליל.",
        "07-05": "לופ אינסופי. לופ אינסופי. לופ אינסופי.",
        "08-05": "סריקת רשת הושלמה. נמצאו 7 מכשירי הקלטה בקרבתך.",
        "09-05": "האמת נמצאת בין הפריימים.",
        "10-05": "דוח שבועי 04 זמין. המעגל הסגור מתחיל לדבר.",
        "11-05": "337 ימים נותרו. הספירה בדם.",
        "12-05": "זיהוי פנים: 99.2% התאמה למטרה.",
        "13-05": "הלילה המעגל ייסגר לראשונה.",
        "14-05": "סוף שלב האתחול. שלב החדירה מתחיל."
    },
    weekly: {
        "1": "דוח 01: נמצא קובץ טקסט מוצפן: 'הם לא צריכים דלתות כשיש להם עדשות'.",
        "2": "דוח 02: הקלטת קול מחדר השרתים: (צליל של מפתח מסתובב).",
        "3": "דוח 03: תמונה ראשונה מהשטח: (מיקום זוהה - צפת).",
        "4": "דוח 04: מסמך 'אופטיקה אומני': פרויקט מעגל סגור יוצא לדרך."
    },
    monthly: {
        "1": "פרוטוקול חודש 01: המערכת זיהתה ניסיון פריצה חיצוני. המעגל מתרחב."
    }
};

// פונקציה לקבלת תאריך יעד קבוע מ-Firebase
async function getTargetDate() {
    const configRef = doc(db, "system", "config");
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
        return new Date(configSnap.data().targetDate);
    } else {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        nextYear.setHours(0, 0, 0, 0); // 12 בבוקר
        await setDoc(configRef, { targetDate: nextYear.toISOString() });
        return nextYear;
    }
}

// עדכון טיימרים ותצוגת רמזים
function updateUI(finalTarget) {
    const now = new Date();
    
    // 1. טיימר ראשי (לשנה)
    const fDiff = finalTarget - now;
    const fDays = Math.floor(fDiff / 86400000);
    const fHours = Math.floor((fDiff % 86400000) / 3600000);
    const fMins = Math.floor((fDiff % 3600000) / 60000);
    const fSecs = Math.floor((fDiff % 60000) / 1000);
    document.getElementById('final-timer').innerText = `${fDays}d ${fHours}h ${fMins}m ${fSecs}s`;

    // 2. טיימר יומי (עד 12:00 בצהריים הבא)
    let nextDaily = new Date();
    nextDaily.setHours(12, 0, 0, 0);
    if (now > nextDaily) nextDaily.setDate(nextDaily.getDate() + 1);
    const dDiff = nextDaily - now;
    document.getElementById('daily-timer').innerText = `${Math.floor(dDiff/3600000)}h ${Math.floor((dDiff%3600000)/60000)}m ${Math.floor((dDiff%60000)/1000)}s`;

    // הצגת רמז יומי (של היום הנוכחי)
    const dateKey = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('daily-content').innerText = clues.daily[dateKey] || "המערכת מחפשת נתונים...";

    // 3. טיימר שבועי (עד יום ראשון הקרוב ב-13:00)
    let nextWeekly = new Date();
    nextWeekly.setDate(now.getDate() + (7 - now.getDay()) % 7);
    nextWeekly.setHours(13, 0, 0, 0);
    if (now > nextWeekly) nextWeekly.setDate(nextWeekly.getDate() + 7);
    const wDiff = nextWeekly - now;
    document.getElementById('weekly-timer').innerText = `${Math.floor(wDiff/86400000)}d ${Math.floor((wDiff%86400000)/3600000)}h ${Math.floor((wDiff%3600000)/60000)}m`;

    // חישוב מספר השבוע והצגת רמז שבועי
    const startDate = new Date("2026-04-14");
    const weekNum = Math.ceil((((now - startDate) / 86400000) + 1) / 7);
    document.getElementById('weekly-content').innerText = clues.weekly[weekNum] || "ממתין לדוח שבועי...";

    // 4. טיימר חודשי (עד ה-1 לחודש הבא ב-12:30)
    let nextMonthly = new Date(now.getFullYear(), now.getMonth() + 1, 1, 12, 30);
    const mDiff = nextMonthly - now;
    document.getElementById('monthly-timer').innerText = `${Math.floor(mDiff/86400000)}d ${Math.floor((mDiff%86400000)/3600000)}h`;
    
    // רמז חודשי (של החודש הנוכחי)
    document.getElementById('monthly-content').innerText = clues.monthly[now.getMonth() + 1] || "בתהליך קידוד...";
}

// טיפול בטופס הרשמה
document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = "מתחבר...";
    
    const userDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        timestamp: new Date()
    };

    try {
        // שמירה ל-Firebase
        await addDoc(collection(db, "users"), userDetails);
        
        // שליחה לטלגרם
        const text = `🚨 משתמש חדש נרשם!\nשם: ${userDetails.name}\nמייל: ${userDetails.email}\nתאריך לידה: ${userDetails.dob}`;
        ADMIN_IDS.forEach(id => {
            fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${id}&text=${encodeURIComponent(text)}`);
        });

        // עדכון מצב מקומי
        localStorage.setItem('enrolled', 'true');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        
        const finalTarget = await getTargetDate();
        setInterval(() => updateUI(finalTarget), 1000);
        
    } catch (err) {
        console.error(err);
        alert("שגיאה בחיבור למערכת.");
        btn.innerText = "נסה שוב";
    }
});

// בדיקה אם המשתמש כבר נרשם בעבר
if (localStorage.getItem('enrolled')) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    getTargetDate().then(finalTarget => {
        setInterval(() => updateUI(finalTarget), 1000);
    });
}

