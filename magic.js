// MAGIC FX CANVAS by ChatGPT

const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
canvas.width = w; canvas.height = h;

function resize() {
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w; canvas.height = h;
}
window.addEventListener('resize', resize);

// -- Анимированные точки (parallax magic) --
const dots = Array.from({length: 32}).map(() => ({
  x: Math.random()*w,
  y: Math.random()*h,
  s: 1.5 + Math.random()*2.5,
  dx: (Math.random()-.5)*0.16,
  dy: (Math.random()-.5)*0.16,
  phase: Math.random()*Math.PI*2
}));

// -- Волны/дым (Perlin-подобный лоу-фай) --
function waveY(x, t, offset) {
  return Math.sin(x/200 + t + offset)*16 +
         Math.sin(x/130 - t*0.8 - offset)*9 +
         Math.sin(x/80 + t*1.2 + offset)*6;
}

// -- Искра (магия на клик или по мыши) --
let spark = null, sparkTime = 0;
canvas.addEventListener('pointermove', e => {
  spark = {x: e.clientX, y: e.clientY, r: 0};
  sparkTime = performance.now();
});
canvas.addEventListener('click', e => {
  spark = {x: e.clientX, y: e.clientY, r: 0};
  sparkTime = performance.now();
});

function draw(time) {
  ctx.clearRect(0,0,w,h);

  // 1. Тонкий дым-волна под карточкой
  ctx.save();
  for(let i=0; i<3; ++i){
    ctx.beginPath();
    ctx.moveTo(0, h/2+60+16*i);
    for(let x=0;x<w;x+=10){
      let y = h/2+60+16*i + waveY(x, time/1500, i*1.2);
      ctx.lineTo(x, y);
    }
    ctx.lineWidth = 40-i*10;
    ctx.globalAlpha = 0.07 + 0.04*i;
    ctx.strokeStyle = ['#bf35d6','#f78fa0','#e694c7'][i];
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // 2. Лёгкая светящаяся аура в центре
  let g = ctx.createRadialGradient(w/2, h/2-30, 70, w/2, h/2-30, w/2);
  g.addColorStop(0, "#bf35d677");
  g.addColorStop(0.19, "#e694c770");
  g.addColorStop(0.45, "#00000011");
  g.addColorStop(1, "transparent");
  ctx.globalAlpha = 0.88;
  ctx.beginPath(); ctx.arc(w/2, h/2-30, w/2.2, 0, Math.PI*2); ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.globalAlpha = 1;

  // 3. Парящие точки с параллаксом
  dots.forEach(d=>{
    d.x += d.dx; d.y += d.dy;
    d.x = (d.x+w)%w; d.y = (d.y+h)%h;
    let py = d.y + Math.sin(time/800 + d.phase)*2.5;
    ctx.beginPath();
    ctx.arc(d.x, py, d.s+Math.sin(time/900+d.phase)*1.2, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.shadowColor = "#e694c7";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // 4. Магическая искра при движении/клике
  if(spark && time-sparkTime<1200){
    let r = 34 + 18*Math.sin((time-sparkTime)/110);
    ctx.save();
    ctx.globalAlpha = 0.65-(time-sparkTime)/1300;
    let g2 = ctx.createRadialGradient(spark.x, spark.y, 2, spark.x, spark.y, r);
    g2.addColorStop(0, "#fffbe9");
    g2.addColorStop(0.2, "#f84e6c");
    g2.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fillStyle = g2;
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(draw);
}
draw(performance.now());
