const opening = document.getElementById('opening');
const editor = document.getElementById('editor');
const noEnding = document.getElementById('noEnding');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const choiceZone = document.getElementById('choiceZone');
const microcopy = document.getElementById('microcopy');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const dayInput = document.getElementById('dayInput');
const timeInput = document.getElementById('timeInput');
const placeInput = document.getElementById('placeInput');
const drinkInput = document.getElementById('drinkInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let dodgeCount = 0;
const maxDodges = 4;
const messages = [
  'That button seems shy 👀',
  'Are you sure? 😄',
  'It keeps escaping.',
  'Okay, one last time.'
];

function moveNoButton() {
  if (dodgeCount >= maxDodges) return;
  const zone = choiceZone.getBoundingClientRect();
  const button = noBtn.getBoundingClientRect();
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${Math.random() * Math.max(0, zone.width - button.width)}px`;
  noBtn.style.top = `${Math.random() * Math.max(0, zone.height - button.height)}px`;
  microcopy.textContent = messages[dodgeCount];
  dodgeCount += 1;
  if (dodgeCount >= maxDodges) {
    setTimeout(() => {
      noBtn.style.position = 'static';
      noBtn.style.left = '';
      noBtn.style.top = '';
      microcopy.textContent = 'Okay — it works normally now.';
    }, 450);
  }
}

['mouseenter', 'touchstart', 'focus'].forEach(name => {
  noBtn.addEventListener(name, event => {
    if (dodgeCount < maxDodges) {
      event.preventDefault();
      moveNoButton();
    }
  }, { passive: false });
});

noBtn.addEventListener('click', () => {
  if (dodgeCount < maxDodges) return moveNoButton();
  opening.classList.add('hidden');
  noEnding.classList.remove('hidden');
});

yesBtn.addEventListener('click', () => {
  opening.classList.add('hidden');
  editor.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backBtn.addEventListener('click', () => {
  editor.classList.add('hidden');
  opening.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function fitText(text, maxWidth, initial, minimum = 23) {
  let size = initial;
  while (size > minimum) {
    ctx.font = `${size}px "Patrick Hand", cursive`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function cover(x, y, w, h) {
  ctx.fillStyle = '#f9ecd8';
  ctx.fillRect(x, y, w, h);
}

function dashed(y) {
  ctx.save();
  ctx.strokeStyle = '#ddb98d';
  ctx.globalAlpha = .72;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.moveTo(290, y);
  ctx.lineTo(958, y);
  ctx.stroke();
  ctx.restore();
}

function chosenPlan() {
  if (drinkInput.value === 'No preference') return 'Something to drink and a little walk';
  return `${drinkInput.value} and a little walk`;
}

async function saveCard() {
  await document.fonts.ready;
  const image = await loadImage('assets/invitation.png');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const textX = 285;
  const textWidth = 690;
  cover(textX, 646, textWidth, 98);
  cover(textX, 748, textWidth, 98);
  cover(textX, 850, textWidth, 98);
  cover(textX, 952, textWidth, 100);
  dashed(750); dashed(852); dashed(954);

  const rows = [
    `Day: ${dayInput.value}`,
    `Time: ${timeInput.value || 'open'}`,
    `Place: ${placeInput.value.trim() || 'open'}`,
    `Plan: ${chosenPlan()}`
  ];
  const ys = [704, 806, 908, 1010];
  const sizes = [45, 45, 43, 39];
  const widths = [640, 625, 625, 645];
  ctx.fillStyle = '#2f241e';
  ctx.textBaseline = 'middle';
  rows.forEach((text, i) => {
    const size = fitText(text, widths[i], sizes[i]);
    ctx.font = `${size}px "Patrick Hand", cursive`;
    ctx.fillText(text, 305, ys[i]);
  });

  const link = document.createElement('a');
  link.download = 'our-date-invitation.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

saveBtn.addEventListener('click', () => {
  saveCard().catch(error => {
    console.error(error);
    alert('The card could not be saved. Please refresh and try again.');
  });
});
