// دالة لتحديث الوقت والتاريخ بشكل حي
function updateLiveStatus() {
    const now = new Date();
    
    // تنسيق التاريخ والوقت للغة العربية
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const dateString = now.toLocaleDateString('ar-SA', dateOptions);
    const timeString = now.toLocaleTimeString('ar-SA', timeOptions);

    const displayElement = document.getElementById('time-display');

    if (displayElement) {
        displayElement.innerHTML = `
            <div>التاريخ: ${dateString}</div>
            <div style="font-size: 1.2em; margin-top:5px;">الساعة الآن: ${timeString}</div>
        `;
    }
}

// تشغيل الدالة فوراً ثم كل ثانية
updateLiveStatus();
setInterval(updateLiveStatus, 1000);

console.log("Vercel Deployment is active and secure.");