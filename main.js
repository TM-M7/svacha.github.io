// --- Данные на русском и английском ---
const infoRU = [
  {emoji:"🤝", text:"Вручную анализируем анкеты — учитываем не только интересы, но и атмосферу человека."},
  {emoji:"🕯", text:"Каждую анкету смотрит живой куратор с опытом"},
  {emoji:"🔮", text:"Без баллов и формул — только индивидуальный, душевный подход."},
  {emoji:"💌", text:"Что получите: подбор по душе, советы для переписки и встречи."},
  {emoji:"🆓", text:"Регистрация и анкета — бесплатно!"},
  {emoji:"💳", text:"Передача контактов — платно (только если реально захотите познакомиться)."}
];
const infoEN = [
  {emoji:"🤝", text:"Manual matching: we consider not only interests, but your vibe."},
  {emoji:"🕯", text:"Every profile is reviewed by a real human curator."},
  {emoji:"🔮", text:"No points, no algorithms — just a personal, soulful approach."},
  {emoji:"💌", text:"What you get: true match, advice for chatting & meetings."},
  {emoji:"🆓", text:"Registration & application are free!"},
  {emoji:"💳", text:"Contacts exchange is paid (only if you really want to connect)."}
];
const LEGAL = {
  ru: {title: 'Сваха — клуб знакомств', age: '18+ только для взрослых', agree: 'Мне исполнилось 18 лет, я согласен с правилами', cta: 'Перейти к анкете', after: 'Переходите — ничего не платите, пока не увидите результат!'},
  en: {title: 'Svacha — matchmaking club', age: '18+ adults only', agree: "I'm 18+, I accept the rules", cta: 'Go to the profile', after: 'Go ahead — you pay only if you see real results!'}
};

let lang = "ru";
function renderAll() {
  // Язык
  document.getElementById('mainTitle').textContent = LEGAL[lang].title;
  document.getElementById('ageNote').textContent = LEGAL[lang].age;
  document.getElementById('agreeText').textContent = LEGAL[lang].agree;
  document.getElementById('goBot').textContent = LEGAL[lang].cta;

  // Информация
  const info = lang === "ru" ? infoRU : infoEN;
  const block = info.map(i=>`<div class="info-block"><span class="emoji">${i.emoji}</span>${i.text}</div>`).join('');
  document.getElementById('info-section').innerHTML = block;
}

renderAll();

// Языковой переключатель
document.getElementById('lang-ru').onclick = function(){
  lang = "ru";
  this.classList.add("lang-active");
  document.getElementById('lang-en').classList.remove("lang-active");
  renderAll();
};
document.getElementById('lang-en').onclick = function(){
  lang = "en";
  this.classList.add("lang-active");
  document.getElementById('lang-ru').classList.remove("lang-active");
  renderAll();
};

// Чекбокс и кнопка
function bindAgree() {
  const agree = document.getElementById('agree18');
  const btn = document.getElementById('goBot');
  const afterBtn = document.getElementById('afterBtn');
  btn.disabled = !agree.checked;
  agree.onchange = () => {
    btn.disabled = !agree.checked;
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


// ---- Magic Canvas: дым, волны, sparkles ----
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
function resizeCanvas() {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
}
window.addEventListener('resize', resizeCanvas); resizeCanvas();

const dots = Array.from({length: 23}).map(() => ({
  x: Math.random()*w, y: Math.random()*h,
  r: 1.3 + Math.random()*2.7,
  dx: (Math.random()-.5)*0.16, dy: (Math.random()-.5)*0.16,
  p: Math.random()*Math.PI*2
}));

let sparks = [];
canvas.addEventListener('pointermove', e => {
  sparks.push({x: e.clientX, y: e.clientY, t: performance.now()});
  if (sparks.length>12) sparks = sparks.slice(-12);
});
canvas.addEventListener('click', e => {
  sparks.push({x: e.clientX, y: e.clientY, t: performance.now()});
  if (sparks.length>12) sparks = sparks.slice(-12);
});

function waveY(x, t, offset) {
  return Math.sin(x/240 + t + offset)*16 +
         Math.sin(x/130 - t*0.8 - offset)*9 +
         Math.sin(x/80 + t*1.2 + offset)*6;
}

function draw(time) {
  ctx.clearRect(0,0,w,h);
  // Волны-дым
  ctx.save();
  for(let i=0; i<2; ++i){
    ctx.beginPath();
    ctx.moveTo(0, h/2+60+16*i);
    for(let x=0;x<w;x+=10){
      let y = h/2+60+16*i + waveY(x, time/1500, i*1.2);
      ctx.lineTo(x, y);
    }
    ctx.lineWidth = 33-i*8;
    ctx.globalAlpha = 0.09 + 0.06*i;
    ctx.strokeStyle = ['#bf35d6','#e694c7'][i];
    ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.restore();

  // Парящие точки
  dots.forEach(d=>{
    d.x += d.dx; d.y += d.dy;
    d.x = (d.x+w)%w; d.y = (d.y+h)%h;
    let py = d.y + Math.sin(time/1100 + d.p)*2.5;
    ctx.beginPath();
    ctx.arc(d.x, py, d.r+Math.sin(time/1900+d.p)*1.2, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    ctx.shadowColor = "#e694c7";
    ctx.shadowBlur = 11;
    ctx.fill(); ctx.shadowBlur = 0;
  });

  // Магия по мыши/клику
  let now = performance.now();
  for(const sp of sparks){
    let age = (now-sp.t)/1100;
    if (age>1) continue;
    let r = 23 + 15*Math.sin((now-sp.t)/100);
    ctx.save();
    ctx.globalAlpha = 0.45-age*0.42;
    let g2 = ctx.createRadialGradient(sp.x, sp.y, 2, sp.x, sp.y, r);
    g2.addColorStop(0, "#fffbe9");
    g2.addColorStop(0.2, "#f84e6c");
    g2.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fillStyle = g2;
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
draw(performance.now());
