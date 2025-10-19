// ======================= Áp dụng lời chúc =======================
const toInput = document.getElementById('toInput');
const messageInput = document.getElementById('messageInput');
const fromInput = document.getElementById('fromInput');
const toLine = document.getElementById('toLine');
const messageLine = document.getElementById('messageLine');
const fromLine = document.getElementById('fromLine');
const applyBtn = document.getElementById('applyBtn');
const copyBtn = document.getElementById('copyBtn');
const printBtn = document.getElementById('printBtn');

function applyChanges() {
    if (!toLine || !messageLine || !fromLine) return;
    toLine.textContent = 'Gửi: ' + (toInput?.value.trim() || 'Người phụ nữ yêu dấu');
    messageLine.textContent = messageInput?.value.trim() || 'Chúc bạn một ngày 20/10 thật ý nghĩa và nhiều niềm vui.';
    fromLine.textContent = fromInput?.value.trim() || 'Người thân';
    // reset scroll to top whenever content is applied
    try {
        const msgWrap = document.querySelector('.message-wrap');
        if (msgWrap) msgWrap.scrollTop = 0;
    } catch (e) { }
}

applyBtn?.addEventListener('click', () => {
    applyChanges();
    applyBtn.textContent = 'Đã áp dụng ✓';
    setTimeout(() => applyBtn.textContent = 'Áp dụng', 1200);
});

// ======================= Sao chép =======================
copyBtn?.addEventListener('click', async () => {
    applyChanges();
    const payload = `${toLine.textContent}\n\n${messageLine.textContent}\n\n— ${fromLine.textContent}\n(Chúc mừng 20/10)`;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(payload);
        } else {
            throw new Error('Clipboard API không hỗ trợ');
        }
        copyBtn.textContent = 'Đã sao chép ✓';
        setTimeout(() => (copyBtn.textContent = 'Sao chép'), 1400);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = payload;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
        } catch (e) { }
        ta.remove();
        copyBtn.textContent = 'Đã sao chép ✓';
        setTimeout(() => (copyBtn.textContent = 'Sao chép'), 1400);
    }
});

// ======================= In thiệp =======================
printBtn?.addEventListener('click', () => {
    applyChanges();
    const printContents = document.getElementById('cardPreview')?.innerHTML;
    const w = window.open('', '_blank');
    if (!w) {
        alert('Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup để in.');
        return;
    }
    w.document.write(`
    <!doctype html>
    <html><head><meta charset="utf-8"><title>In thiệp 20/10</title>
    <style>
      body { font-family: Segoe UI, Roboto, Arial; margin: 30px; background: #fff3f9; }
      .preview { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    </style></head>
    <body><div class="preview">${printContents}</div></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
        w.print();
        w.close();
    }, 300);
});

// ======================= Album ảnh tự động =======================
(function initAlbum() {
    const album = document.getElementById('album');
    if (!album) return;
    const slides = album.querySelectorAll('img');
    if (!slides || slides.length === 0) return;

    let currentSlide = 0;
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));

    const slideInterval = 4000; // ms
    const overlapDelay = 200; // ms

    setInterval(() => {
        const next = (currentSlide + 1) % slides.length;
        slides[next].classList.add('active');
        setTimeout(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = next;
        }, overlapDelay);
    }, slideInterval);
})();

// ======================= Heart particles (tsParticles) =======================
// tsParticles loader on-demand: load subtle hearts or a burst
(function prepareHeartsLoader() {
    const containerId = 'heartParticles';

    function createConfig(burst = false) {
        const base = {
            fullScreen: { enable: false },
            particles: {
                number: { value: 0 },
                color: { value: ['#ff6f91', '#ff9aa2', '#ff5f8a'] },
                shape: { type: 'char', character: { value: ['❤', '♥'], font: 'Verdana' } },
                opacity: { value: 0.9, random: { enable: true, minimumValue: 0.4 } },
                size: { value: { min: 6, max: 18 } },
                move: { enable: true, speed: 1, direction: 'top', outModes: { default: 'out' } }
            }
        };

        if (burst) {
            // continuous subtle emitter + one-shot burst
            base.emitters = [
                {
                    direction: 'top',
                    rate: { delay: 0.18, quantity: 1 },
                    position: { x: 50, y: 90 }
                },
                {
                    position: { x: 50, y: 60 },
                    rate: { delay: 0.01, quantity: 20 },
                    life: { count: 1, duration: 0.2 }
                }
            ];
        } else {
            base.emitters = {
                direction: 'top',
                rate: { delay: 0.2, quantity: 1 },
                position: { x: 50, y: 90 }
            };
        }

        return base;
    }

    window.loadHearts = function (burst = false) {
        const el = document.getElementById(containerId);
        if (!el) return;
        function tryInit() {
            if (window.tsParticles && window.tsParticles.load) {
                window.tsParticles.load(containerId, createConfig(burst));
            } else {
                setTimeout(tryInit, 250);
            }
        }
        tryInit();
    };
})();

// ======================= Corner hearts =======================
(function initCornerHearts() {
    const corners = [
        // { id: 'cornerHeartTL', cls: 'corner-heart top-left' },
        // { id: 'cornerHeartTR', cls: 'corner-heart top-right' },
        // { id: 'cornerHeartBL', cls: 'corner-heart bottom-left' },
        // { id: 'cornerHeartBR', cls: 'corner-heart bottom-right' },
    ];

    corners.forEach(c => {
        if (!document.getElementById(c.id)) {
            const div = document.createElement('div');
            div.id = c.id;
            div.className = c.cls;
            document.body.appendChild(div);
        }
    });

    function cfgForCorner() {
        return {
            fullScreen: { enable: false },
            particles: {
                number: { value: 0 },
                color: { value: ['#ff6f91'] },
                shape: { type: 'char', character: { value: ['❤'], font: 'Verdana' } },
                opacity: { value: 0.9, random: { enable: true, minimumValue: 0.3 } },
                size: { value: { min: 6, max: 12 } },
                move: { enable: true, speed: 0.6, direction: 'top', outModes: { default: 'out' } }
            },
            emitters: { position: { x: 50, y: 100 }, rate: { delay: 0.8, quantity: 1 } }
        };
    }

    function tryLoad(id) {
        const tryInit = () => {
            if (window.tsParticles && window.tsParticles.load) {
                window.tsParticles.load(id, cfgForCorner());
            } else setTimeout(tryInit, 400);
        };
        tryInit();
    }

    corners.forEach(c => tryLoad(c.id));
})();

// ======================= Bottom heart bar (full-width) =======================
(function initBottomHeartBar() {
    const id = 'bottomHeartBar';
    if (!document.getElementById(id)) {
        const div = document.createElement('div');
        div.id = id;
        div.className = 'bottom-heart-bar';
        document.body.appendChild(div);
    }

    function createBottomConfig() {
        // create multiple emitters spaced across width
        const emitters = [];
        const count = 10; // number of emitters across width
        for (let i = 0; i < count; i++) {
            emitters.push({ position: { x: (i + 0.5) / count * 100, y: 100 }, rate: { delay: 0.9 + Math.random() * 0.6, quantity: 1 } });
        }

        return {
            fullScreen: { enable: false },
            particles: {
                number: { value: 0 },
                shape: { type: 'char', character: { value: ['❤'], font: 'Verdana' } },
                color: { value: ['#ff4d7a', '#ff8aa3'] },
                size: { value: { min: 6, max: 12 } },
                move: { enable: true, speed: 0.8, direction: 'top', outModes: { default: 'out' } },
                opacity: { value: 0.95 }
            },
            emitters: emitters
        };
    }

    function tryInit() {
        if (window.tsParticles && window.tsParticles.load) {
            window.tsParticles.load(id, createBottomConfig());
        } else setTimeout(tryInit, 300);
    }
    tryInit();
})();
// ======================= Mở thư (envelope) =======================
(function initEnvelope() {
    const card = document.getElementById('cardPreview');
    const openBtn = document.getElementById('openLetterBtn');
    const envelope = card ? card.querySelector('.envelope-cover') : null;
    const autoBtn = document.getElementById('autoScrollBtn');
    if (!card || !envelope || !openBtn) return;

    function openLetter() {
        card.classList.remove('closed');
        card.classList.add('open');
        envelope.style.pointerEvents = 'none';
        // if auto-scroll was active, start it
        try {
            if (autoBtn && autoBtn.textContent && autoBtn.textContent.includes('Dừng')) {
                // simulate a click to start auto-scroll
                autoBtn.click();
            }
        } catch (e) { }
        try {
            if (window.loadHearts) {
                // burst when opened
                window.loadHearts(true);
                // then start subtle continuous hearts after 2s
                setTimeout(() => { try { window.loadHearts(false); } catch (e) { } }, 2000);
            }
        } catch (e) { }
    }

    function closeLetter() {
        card.classList.add('closed');
        card.classList.remove('open');
        envelope.style.pointerEvents = '';
    }

    openBtn.addEventListener('click', (ev) => { ev.stopPropagation(); openLetter(); });
    envelope.addEventListener('click', () => openLetter());
})();

// ======================= Hoa rơi (nâng cấp) =======================
(function initFlowers() {
    const flowerImages = [
        'https://cdn-icons-png.flaticon.com/512/4150/4150907.png',
        'https://cdn-icons-png.flaticon.com/512/4150/4150905.png',
        'https://cdn-icons-png.flaticon.com/512/4150/4150909.png',
        'https://cdn-icons-png.flaticon.com/128/9037/9037453.png',
        'https://cdn-icons-png.flaticon.com/128/3199/3199998.png',
        'https://cdn-icons-png.flaticon.com/128/2839/2839214.png',
        'https://cdn-icons-png.flaticon.com/128/19025/19025741.png'
    ];

    function createFlower() {
        const flower = document.createElement('div');
        flower.classList.add('flower-fall');
        const size = 20 + Math.random() * 20;
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (5 + Math.random() * 5) + 's';
        flower.style.backgroundImage = `url('${flowerImages[Math.floor(Math.random() * flowerImages.length)]}')`;
        flower.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(flower);
        setTimeout(() => flower.remove(), 10000);
    }

    if (document.body) {
        setInterval(createFlower, 700);
    } else {
        window.addEventListener('DOMContentLoaded', () => setInterval(createFlower, 700));
    }
})();

// ======================= Khởi tạo mặc định =======================
applyChanges();

// ======================= Auto-scroll cho lời chúc =======================
(function initAutoScroll() {
    const msgWrap = document.querySelector('.message-wrap');
    const autoBtn = document.getElementById('autoScrollBtn');
    if (!msgWrap || !autoBtn) return;

    let autoScrolling = false;
    let autoTimer = null;
    const pxPerTick = 1.5; // pixels per interval
    const tickMs = 18; // interval ms -> ~55fps

    function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        autoScrolling = false;
        autoBtn.textContent = 'Tự động lướt';
    }

    function startAuto() {
        if (autoScrolling) return;
        autoScrolling = true;
        autoBtn.textContent = 'Dừng lướt';
        autoTimer = setInterval(() => {
            if (!msgWrap) return stopAuto();
            msgWrap.scrollTop += pxPerTick;
            if (msgWrap.scrollTop + msgWrap.clientHeight >= msgWrap.scrollHeight - 1) {
                stopAuto();
            }
        }, tickMs);
    }

    autoBtn.addEventListener('click', () => {
        if (autoScrolling) stopAuto(); else startAuto();
    });

    // stop auto-scroll when user interacts (wheel/touch)
    msgWrap.addEventListener('wheel', () => { if (autoScrolling) stopAuto(); }, { passive: true });
    msgWrap.addEventListener('touchstart', () => { if (autoScrolling) stopAuto(); }, { passive: true });
    msgWrap.addEventListener('pointerdown', () => { if (autoScrolling) stopAuto(); });
})();
