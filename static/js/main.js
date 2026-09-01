/**
 * SahakariGig - Core JavaScript Engine
 * Handles Toast Notifications, Sound FX (Web Audio), Multilingual Switcher, Live Event Feed
 */

// Sound FX Engine using Web Audio API (zero external audio file dependencies)
const SoundFX = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
    },
    playTone(freq, type, duration, delay = 0) {
        try {
            this.init();
            if (!this.ctx) return;
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            }, delay);
        } catch (e) {
            console.warn("Audio not allowed yet:", e);
        }
    },
    success() {
        this.playTone(523.25, 'sine', 0.15, 0);   // C5
        this.playTone(659.25, 'sine', 0.25, 100); // E5
        this.playTone(783.99, 'sine', 0.35, 200); // G5
    },
    pop() {
        this.playTone(800, 'triangle', 0.08, 0);
    },
    sos() {
        this.playTone(880, 'sawtooth', 0.2, 0);
        this.playTone(660, 'sawtooth', 0.2, 220);
        this.playTone(880, 'sawtooth', 0.3, 440);
    },
    cash() {
        this.playTone(987.77, 'sine', 0.1, 0);
        this.playTone(1318.51, 'sine', 0.25, 80);
    }
};

// Toast Notification Manager
const Toast = {
    show(message, type = 'success', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        let icon = 'fa-circle-check text-emerald-400';
        let borderColor = 'border-emerald-500/40';
        let bgGlow = 'rgba(16, 185, 129, 0.15)';

        if (type === 'error' || type === 'sos') {
            icon = 'fa-triangle-exclamation text-rose-400';
            borderColor = 'border-rose-500/50';
            bgGlow = 'rgba(244, 63, 94, 0.2)';
            SoundFX.sos();
        } else if (type === 'info') {
            icon = 'fa-circle-info text-sky-400';
            borderColor = 'border-sky-500/40';
            bgGlow = 'rgba(56, 189, 248, 0.15)';
            SoundFX.pop();
        } else {
            SoundFX.success();
        }

        toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border ${borderColor} text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-3 opacity-0`;
        toast.style.background = `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))`;
        toast.style.boxShadow = `0 10px 25px -5px ${bgGlow}`;

        toast.innerHTML = `
            <i class="fa-solid ${icon} text-lg shrink-0"></i>
            <div class="text-sm font-medium pr-2">${message}</div>
            <button onclick="this.parentElement.remove()" class="ml-auto text-slate-400 hover:text-white text-xs">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Multilingual Dictionary (English, Hindi, Kannada, Tamil)
const TRANSLATIONS = {
    en: {
        tagline: "India's First Worker-Owned Household & Community Services Ecosystem",
        hero_title_1: "Fair Work.",
        hero_title_2: "Community Trust.",
        hero_title_3: "Zero Exploitation.",
        hero_sub: "100% transparent cooperative. 97% of your fee goes directly to your verified pro. 3% feeds the worker healthcare & dividend safety net.",
        book_now: "Book Cooperative Pro",
        sos_btn: "Emergency SOS (15 Min Dispatch)",
        nav_services: "Services",
        nav_worker_hub: "Worker-Owner Hub",
        nav_governance: "Co-op Council & DAO",
        nav_community: "Community RWAs",
        calc_title: "Fair Economy Calculator",
        calc_sub: "See how much more workers earn with SahakariGig vs traditional corporate gig apps"
    },
    hi: {
        tagline: "भारत का पहला श्रमिक-स्वामित्व वाला घरेलू एवं सामुदायिक सेवा सहकारी मंच",
        hero_title_1: "न्यायपूर्ण कार्य।",
        hero_title_2: "सामुदायिक विश्वास।",
        hero_title_3: "शून्य शोषण।",
        hero_sub: "100% पारदर्शी सहकारी मंच। आपकी फीस का 97% सीधे सत्यापित पेशेवर को जाता है। 3% स्वास्थ्य सुरक्षा और लाभांश कोष में जाता है।",
        book_now: "सहकारी सेवा बुक करें",
        sos_btn: "आपातकालीन SOS (15 मिनट सहायता)",
        nav_services: "सेवाएं",
        nav_worker_hub: "श्रमिक-मालिक हब",
        nav_governance: "सहकारी परिषद (मतदान)",
        nav_community: "सोसाइटी ग्रुप बुकिंग",
        calc_title: "निष्पक्ष आय गणक (कैलकुलेटर)",
        calc_sub: "देखें कि कॉर्पोरेट ऐप्स की तुलना में सहकारी मॉडल में कामगार कितना अधिक कमाते हैं"
    },
    kn: {
        tagline: "ಭಾರತದ ಮೊದಲ ಕಾರ್ಮಿಕ ಒಡೆತನದ ಗೃಹ ಮತ್ತು ಸಮುದಾಯ ಸೇವಾ ಸಹಕಾರಿ ವೇದಿಕೆ",
        hero_title_1: "ನ್ಯಾಯಯುತ ಕೆಲಸ.",
        hero_title_2: "ಸಮುದಾಯ ನಂಬಿಕೆ.",
        hero_title_3: "ಶೋಷಣೆ ಮುಕ್ತ.",
        hero_sub: "100% ಪಾರದರ್ಶಕ ಸಹಕಾರಿ. ನಿಮ್ಮ ಶುಲ್ಕದ 97% ನೇರವಾಗಿ ನುರಿತ ಕುಶಲಕರ್ಮಿಗೆ ತಲುಪುತ್ತದೆ. 3% ಆರೋಗ್ಯ ನಿಧಿಗೆ ಹೋಗುತ್ತದೆ.",
        book_now: "ಸಹಕಾರಿ ಸೇವೆ ಬುಕ್ ಮಾಡಿ",
        sos_btn: "ತುರ್ತು SOS (15 ನಿಮಿಷಗಳಲ್ಲಿ ಸಹಾಯ)",
        nav_services: "ಸೇವೆಗಳು",
        nav_worker_hub: "ಕಾರ್ಮಿಕ ಮಾಲೀಕರ ಹಬ್",
        nav_governance: "ಸಹಕಾರಿ ಮಂಡಳಿ ಮತದಾನ",
        nav_community: "ಸಮುದಾಯ ಸೇವೆಗಳು",
        calc_title: "ನ್ಯಾಯಯುತ ಆದಾಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
        calc_sub: "ಕಾರ್ಪೊರೇಟ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳಿಗೆ ಹೋಲಿಸಿದರೆ ಕಾರ್ಮಿಕರು ಎಷ್ಟು ಹೆಚ್ಚು ಗಳಿಸುತ್ತಾರೆ ಎಂದು ನೋಡಿ"
    },
    ta: {
        tagline: "இந்தியாவின் முதல் தொழிலாளர் உரிமையுடைய வீட்டு மற்றும் சமூக சேவை கூட்டுறவு",
        hero_title_1: "நியாயமான உழைப்பு.",
        hero_title_2: "சமூக நம்பிக்கை.",
        hero_title_3: "சுரண்டல் இல்லாத தளம்.",
        hero_sub: "100% வெளிப்படையான கூட்டுறவு. உங்கள் கட்டணத்தில் 97% நேரடியாக தொழிலாளியை சென்றடைகிறது.",
        book_now: "கூட்டுறவு சேவை முன்பதிவு",
        sos_btn: "அவசர SOS (15 நிமிட உதவி)",
        nav_services: "சேவைகள்",
        nav_worker_hub: "தொழிலாளர் மையம்",
        nav_governance: "கூட்டுறவு வாக்குப்பதிவு",
        nav_community: "குடியிருப்பு சமூகம்",
        calc_title: "நியாயமான வருமான கணக்கீடு",
        calc_sub: "கார்ப்பரேட் தளங்களை விட தொழிலாளர்கள் எவ்வளவு அதிகம் சம்பாதிக்கிறார்கள் என்று பாருங்கள்"
    }
};

function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    const t = TRANSLATIONS[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });

    localStorage.setItem('sg_lang', lang);
    Toast.show(`Language switched to ${lang.toUpperCase()}`, 'info');
}

// Global Voice Search Simulator
function startVoiceSearch() {
    SoundFX.pop();
    const searchInput = document.getElementById('service-search');
    if (!searchInput) return;

    Toast.show("🎙️ Listening... (Say 'Plumbing', 'AC Repair', 'Electrical', 'Elderly Care')", 'info');
    searchInput.placeholder = "Listening... 🎙️";
    
    // Simulate speech-to-text recognition
    setTimeout(() => {
        const sampleKeywords = ["Master AC Jet Servicing", "Electrical Safety Audit", "Deep Home Sanitation", "Overhead Water Tank", "Leak Detection"];
        const picked = sampleKeywords[Math.floor(Math.random() * sampleKeywords.length)];
        searchInput.value = picked;
        searchInput.placeholder = "Search services (e.g., Electrical, AC, Leak)...";
        if (typeof filterServices === 'function') {
            filterServices();
        }
        Toast.show(`Recognized: "${picked}"`, 'success');
    }, 2200);
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check saved language
    const savedLang = localStorage.getItem('sg_lang') || 'en';
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;
        changeLanguage(savedLang);
    }

    // Live Feed Automatic Subtle Rotation
    const feedContainer = document.getElementById('live-feed-ticker');
    if (feedContainer) {
        const feeds = [
            "⚡ Ramesh K. completed 'Safety Audit' in Indiranagar (+₹678)",
            "🌿 Green Glen Layout reached 64 pledges for AC Optimization",
            "🛡️ 3,420 Co-op Members insured under Ayushman-Sahakari Plan",
            "🗳️ Proposal #08 (EV 2-Wheeler Subsidy) surpassed 74% voter quorum",
            "💧 Master Plumber Suresh P. resolved kitchen pipe leak in 22 mins"
        ];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % feeds.length;
            feedContainer.style.opacity = '0';
            setTimeout(() => {
                feedContainer.innerText = feeds[idx];
                feedContainer.style.opacity = '1';
            }, 300);
        }, 5000);
    }
});
