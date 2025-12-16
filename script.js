// وظيفة التحقق من الوصول (ACL Mechanism)
function checkPass() {
    const passwordInput = document.getElementById('pass-input').value;
    const errorMsg = document.getElementById('error-msg');
    
    // كلمة المرور التي ستعطيها للدكتورة
    const secureKey = "CYS2025"; 

    if (passwordInput === secureKey) {
        // إخفاء شاشة القفل وإظهار المحتوى
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        console.log("Access Granted - Authenticated");
    } else {
        // إظهار رسالة خطأ
        errorMsg.style.display = 'block';
        console.warn("Access Denied - Unauthorized Attempt");
    }
}

// دالة تحديث الوقت (الكود السابق)
function updateLiveStatus() {
    const now = new Date();
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

updateLiveStatus();
setInterval(updateLiveStatus, 1000);