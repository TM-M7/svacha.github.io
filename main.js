// === Мультиязычность и переключение ===
const infoRU = [
    { emoji: "🤝", text: "Вручную анализируем анкеты — учитываем не только интересы, но и атмосферу человека." },
    { emoji: "🕯", text: "Каждую анкету смотрит живой куратор с опытом" },
    { emoji: "🔮", text: "Без баллов и формул — только индивидуальный, душевный подход." },
    { emoji: "💌", text: "Что получите: подбор по душе, советы для переписки и встречи." },
    { emoji: "🆓", text: "Регистрация и анкета — бесплатно!" },
    { emoji: "💳", text: "Передача контактов — платно (только если реально захотите познакомиться)." }
];
const infoEN = [
    { emoji: "🤝", text: "Manual matching: we consider not only interests, but your vibe." },
    { emoji: "🕯", text: "Every profile is reviewed by a real human curator." },
    { emoji: "🔮", text: "No points, no algorithms — just a personal, soulful approach." },
    { emoji: "💌", text: "What you get: true match, advice for chatting & meetings." },
    { emoji: "🆓", text: "Registration & application are free!" },
    { emoji: "💳", text: "Contacts exchange is paid (only if you really want to connect)." }
];
const LEGAL = {
    ru: { title: 'Сваха — клуб знакомств', age: '18+ только для взрослых', agree: 'Мне исполнилось 18 лет, я согласен с правилами', cta: 'Перейти к анкете', after: 'Переходите — ничего не платите, пока не увидите результат!' },
    en: { title: 'Svacha — matchmaking club', age: '18+ adults only', agree: "I'm 18+, I accept the rules", cta: 'Go to the profile', after: 'Go ahead — you pay only if you see real results!' }
};

let lang = "ru";
function renderAll() {
    document.getElementById('mainTitle').textContent = LEGAL[lang].title;
    document.getElementById('ageNote').textContent = LEGAL[lang].age;
    document.getElementById('agreeText').textContent = LEGAL[lang].agree;
    document.getElementById('goBot').textContent = LEGAL[lang].cta;
    const info = lang === "ru" ? infoRU : infoEN;
    document.getElementById('info-section').innerHTML = info.map(i =>
        `<div class="info-block"><span class="emoji">${i.emoji}</span>${i.text}</div>`
    ).join('');
}
renderAll();
document.getElementById('lang-ru').onclick = function () {
    lang = "ru";
    this.classList.add("lang-active");
    document.getElementById('lang-en').classList.remove("lang-active");
    renderAll();
};
document.getElementById('lang-en').onclick = function () {
    lang = "en";
    this.classList.add("lang-active");
    document.getElementById('lang-ru').classList.remove("lang-active");
    renderAll();
};

// === Canvas эффекты ===
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
function resizeCanvas() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
}
window.addEventListener('resize', resizeCanvas); resizeCanvas();

const main = document.querySelector('main.glass');
const flyingHearts = [];
let sparks = [];
let waveFlashTimer = 0;

// --- Сердечки по клику только вне карточки ---
document.addEventListener('click', e => {
    const rect = main.getBoundingClientRect();
    if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) return;
    // Добавим сразу несколько сердечек (с кучкой) для эффекта
    for (let k = 0; k < 3; k++) {
        flyingHearts.push({
            x: e.clientX + Math.random()*16-8,
            y: e.clientY + Math.random()*10-5,
            vx: (Math.random() - 0.5) * 0.23,
            vy: 1.2 + Math.random() * 0.8,
            scale: 0.8 + Math.random() * 0.3,
            color: ['#f84e6c', '#e694c7', '#bf35d6', '#f78fa0'][Math.floor(Math.random() * 4)],
            life: 0, maxLife: 1.1 + Math.random() * 0.6,
            trail: []
        });
    }
});

function drawHeart(ctx, color, size) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -size / 2, -size, -size / 2, -size, 0);
    ctx.bezierCurveTo(-size, size * 0.7, 0, size * 0.85, 0, size * 1.22);
    ctx.bezierCurveTo(0, size * 0.85, size, size * 0.7, size, 0);
    ctx.bezierCurveTo(size, -size / 2, 0, -size / 2, 0, 0);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color + "cc";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawSparkle(ctx, x, y, r, c1, c2) {
    let g = ctx.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2 || "transparent");
    ctx.save();
    ctx.globalAlpha = 0.24 + 0.15 * Math.random();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = g;
    ctx.shadowColor = "#fff9";
    ctx.shadowBlur = 13;
    ctx.fill();
    ctx.restore();
}

// --- FX: три волны, блёстки, сердечки ---
let bgSparkles = [];
for (let i = 0; i < 20; i++) {
    bgSparkles.push({
        x: Math.random()*w,
        y: h*0.7 + Math.random()*h*0.27,
        r: 8+8*Math.random(),
        t: Math.random()*Math.PI*2
    });
}
function draw(time) {
    ctx.clearRect(0, 0, w, h);

    // === МНОГО ВОЛН ===
    for (let i = 0; i < 3; i++) {
        let amp = [19, 28, 13][i] + (waveFlashTimer>0 ? 13*(waveFlashTimer/15)*(i==1?1.5:1) : 0);
        let baseY = h*0.8 + i*24;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 8) {
            let y = baseY
                + Math.sin(x / (180-18*i) + time/(1600+400*i)) * amp
                + Math.sin(x / (60+30*i) - time/(1900-120*i)) * (7+3*i);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.globalAlpha = 0.07 + 0.05 * (2-i);
        ctx.fillStyle = ['#bf35d6', '#f78fa0', '#e694c7'][i];
        ctx.shadowColor = ['#bf35d6', '#f84e6c', '#e694c7'][i];
        ctx.shadowBlur = 19-6*i;
        ctx.fill();
        ctx.restore();
    }
    if (waveFlashTimer > 0) waveFlashTimer--;

    // === Фоновая "магия" (блёстки) ===
    bgSparkles.forEach((sp, idx) => {
        let tt = time/1700+sp.t;
        let y = sp.y + Math.sin(tt)*8;
        let r = sp.r + Math.sin(tt*2+idx)*1.4;
        drawSparkle(ctx, sp.x, y, r, "#fff", "#f78fa088");
    });

    // === Сердечки (ограничение 60) ===
    for (let i = 0; i < flyingHearts.length; i++) {
        let hrt = flyingHearts[i];
        hrt.trail.push({ x: hrt.x, y: hrt.y, t: hrt.life });
        if (hrt.trail.length > 7) hrt.trail.shift();
        hrt.x += hrt.vx; hrt.y += hrt.vy; hrt.vy += 0.017;
        hrt.life += 0.016;
        // шлейф
        for (let j = 0; j < hrt.trail.length; j++) {
            let p = hrt.trail[j];
            ctx.save();
            ctx.globalAlpha = 0.09 * (j / hrt.trail.length);
            ctx.translate(p.x, p.y);
            ctx.scale(0.75, 0.75);
            drawHeart(ctx, hrt.color, 13 * hrt.scale * (j / hrt.trail.length));
            ctx.restore();
        }
        // основное сердечко
        ctx.save();
        ctx.translate(hrt.x, hrt.y);
        ctx.scale(hrt.scale, hrt.scale);
        ctx.globalAlpha = 0.73 - (hrt.life / hrt.maxLife);
        drawHeart(ctx, hrt.color, 14);
        ctx.restore();
    }
    for (let i = flyingHearts.length - 1; i >= 0; i--) {
        if (flyingHearts[i].life > flyingHearts[i].maxLife) flyingHearts.splice(i, 1);
    }
    if (flyingHearts.length > 60) flyingHearts.splice(0, flyingHearts.length - 60);

    // === Салютные/магические спарклы ===
    let now = performance.now();
    for(const sp of sparks){
        let age = (now-sp.t)/900;
        if (age>1) continue;
        let r = 14 + 10*Math.sin((now-sp.t)/66);
        drawSparkle(ctx, sp.x, sp.y, r, "#fffbe9", "#f84e6c");
    }
    if (sparks.length > 25) sparks.splice(0, sparks.length - 25);

    requestAnimationFrame(draw);
}
draw(performance.now());

// --- Параллакс на карточку (мягко) ---
document.addEventListener('mousemove', e => {
    let x = (e.clientX / window.innerWidth - 0.5) * 5;
    let y = (e.clientY / window.innerHeight - 0.5) * 2.5;
    main.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) scale(1.009)`;
});
document.addEventListener('mouseleave', () => main.style.transform = "scale(1)");

// === Салют только сверху, много всего, дергает волны ===
function fireworksHeartsMagic() {
    const heartColors = ['#f84e6c', '#e694c7', '#bf35d6', '#f78fa0'];
    const fireworks = [
        { x: w * 0.17, y: h * 0.07 },
        { x: w / 2,    y: h * 0.055 },
        { x: w * 0.83, y: h * 0.07 }
    ];
    fireworks.forEach((fw) => {
        let N = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < N; i++) {
            let angle = Math.PI/2 + (Math.random()-0.5)*0.85;
            let speed = 1.35 + Math.random()*0.5;
            let vx = Math.cos(angle) * (0.09 + Math.random()*0.11);
            let vy = Math.sin(angle) * speed;
            flyingHearts.push({
                x: fw.x, y: fw.y,
                vx: vx, vy: vy,
                scale: 0.8 + Math.random() * 0.25,
                color: heartColors[Math.floor(Math.random() * heartColors.length)],
                life: 0, maxLife: 1.1 + Math.random() * 0.8,
                trail: []
            });
        }
    });
    // Много спарклов сверху
    for (let i = 0; i < 16; i++) {
        let xx = w * (0.10 + 0.80 * Math.random());
        let yy = h * (0.01 + 0.14 * Math.random());
        sparks.push({ x: xx, y: yy, t: performance.now() + Math.random() * 300 });
    }
    // Дергает волны
    waveFlashTimer = 15;
}

// --- Чекбокс и кнопка ---
function bindAgree() {
    const agree = document.getElementById('agree18');
    const btn = document.getElementById('goBot');
    const afterBtn = document.getElementById('afterBtn');
    btn.disabled = !agree.checked;
    let saluteLaunched = false;
    agree.onchange = () => {
        btn.disabled = !agree.checked;
        if (agree.checked && !saluteLaunched) {
            saluteLaunched = true;
            fireworksHeartsMagic();
        }
        if (!agree.checked) {
            saluteLaunched = false;
        }
    };
    btn.onclick = () => {
        if (agree.checked) {
            btn.innerText = lang === 'en' ? "Opening Telegram..." : "Открываем Telegram...";
            afterBtn.innerHTML = `<span>${LEGAL[lang].after}</span>`;
            setTimeout(() => window.open('https://t.me/svacha_bot', '_blank'), 400);
            setTimeout(() => { btn.innerText = LEGAL[lang].cta; afterBtn.innerHTML = ""; }, 3000);
        }
    };
}
bindAgree();
