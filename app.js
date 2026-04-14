import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config
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

// --- שליחה לטלגרם ---
async function sendToTelegram(userData) {
    const message = `🚨 נרשם חדש למעגל הסגור!\n👤 שם: ${userData.name}\n📧 מייל: ${userData.email}\n🎂 יומולדת: ${userData.dob}`;
    for (const id of ADMIN_IDS) {
        try {
            await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: id, text: message })
            });
        } catch (e) { console.error("Telegram Error"); }
    }
}

// --- הרשמה ---
document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = "מעבד...";
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        timestamp: new Date()
    };

    try {
        await addDoc(collection(db, "users"), userData);
        await sendToTelegram(userData);
        localStorage.setItem('user_enrolled', 'true');
        alert("המערכת זיהתה אותך. המעגל נסגר.");
        btn.innerText = "מחובר למערכת";
    } catch (err) { alert("שגיאת התחברות למסד הנתונים."); }
});

// --- מאגר רמזים חודש 1 ---
const dailyDatabase = {
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
};

const weeklyDatabase = {
    "1": "דוח 01: נמצא קובץ טקסט מוצפן: 'הם לא צריכים דלתות כשיש להם עדשות'.",
    "2": "דוח 02: הקלטת קול מחדר השרתים: (צליל של מפתח מסתובב).",
    "3": "דוח 03: תמונה ראשונה מהשטח: (מיקום זוהה - צפת).",
    "4": "דוח 04: מסמך 'אופטיקה אומני': פרויקט מעגל סגור יוצא לדרך."
};

// --- עדכון תוכן לפי זמן ---
function updateContent() {
    const now = new Date();
    const dateKey = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // יומי ב-12:00
    if (hours >= 12) {
        document.getElementById('daily-clue').innerText = dailyDatabase[dateKey] || "המערכת מנתחת נתונים...";
    }

    // שבועי (יום ראשון ב-13:00)
    if (now.getDay() === 0 && hours >= 13) {
        const startDate = new Date("2026-04-14");
        const weekNum = Math.ceil((((now - startDate) / 86400000) + 1) / 7);
        document.getElementById('weekly-clue').innerText = weeklyDatabase[weekNum] || "ממתין לדוח הבא.";
    }

    // חודשי (1 לחודש ב-12:30)
    if (now.getDate() === 1 && (hours > 12 || (hours === 12 && minutes >= 30))) {
        document.body.style.boxShadow = "inset 0 0 100px #ff0000";
    }
}

// --- טיימר ---
function runTimer() {
    const target = new Date("April 14, 2027 00:00:00").getTime();
    setInterval(() => {
        const diff = target - new Date().getTime();
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('timer').innerText = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

runTimer();
updateContent();
setInterval(updateContent, 60000);

