const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const choiceZone = document.getElementById('choiceZone');
const microcopy = document.getElementById('microcopy');
const hero = document.getElementById('hero');
const details = document.getElementById('details');
const finalCard = document.getElementById('finalCard');
const noEnding = document.getElementById('noEnding');
const summaryText = document.getElementById('summaryText');
const timeInput = document.getElementById('timeInput');
const placeInput = document.getElementById('placeInput');
const createBtn = document.getElementById('createBtn');
const downloadBtn = document.getElementById('downloadBtn');
const editBtn = document.getElementById('editBtn');
const status = document.getElementById('status');
const canvas = document.getElementById('invitationCanvas');
const ctx = canvas.getContext('2d');

let dodgeCount = 0;
const maxDodges = 4;
const dodgeMessages = [
  'That button seems a little shy 👀',
  'Are you completely sure? 😄',
  'It keeps escaping. Very suspicious.',
  'Okay, okay — one more try.'
];

const state = {
  day: '',
  drink: '',
  time: '',
  place: ''
};

function moveNoButton() {
  if (dodgeCount >= maxDodges) return;

  const zone = choiceZone.getBoundingClientRect();
  const button = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, zone.width - button.width);
  const maxY = Math.max(0, zone.height - button.height);

  noBtn.style.position = 'absolute';
  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top = `${Math.random() * maxY}px`;
  microcopy.textContent = dodgeMessages[dodgeCount];
  dodgeCount += 1;

  if (dodgeCount >= maxDodges) {
    setTimeout(() => {
      noBtn.style.position = 'static';
      noBtn.style.left = '';
      noBtn.style.top = '';
      microcopy.textContent = 'Okay, the button works normally now. Promise.';
    }, 550);
  }
}

['mouseenter', 'touchstart', 'focus'].forEach(eventName => {
  noBtn.addEventListener(eventName, event => {
    if (dodgeCount < maxDodges) {
      event.preventDefault();
      moveNoButton();
    }
  }, { passive: false });
});

noBtn.addEventListener('click', () => {
  if (dodgeCount < maxDodges) {
    moveNoButton();
    return;
  }
  hero.classList.add('hidden');
  noEnding.classList.remove('hidden');
  noEnding.scrollIntoView({ behavior: 'smooth' });
});

yesBtn.addEventListener('click', () => {
  hero.classList.add('hidden');
  details.classList.remove('hidden');
  details.scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('.pill').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;
    document.querySelectorAll(`[data-group="${group}"]`).forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    state[group] = button.dataset.value;
    updateSummary();
  });
});

timeInput.addEventListener('input', () => {
  state.time = timeInput.value;
  updateSummary();
});

placeInput.addEventListener('input', () => {
  state.place = placeInput.value.trim();
  updateSummary();
});

function displayTime(value) {
  return value || 'open';
}

function planText() {
  return state.drink ? `${state.drink} and a little walk` : 'Something to drink and a little walk';
}

function updateSummary() {
  if (!state.day) {
    summaryText.textContent = 'Choose a day to begin.';
    return;
  }

  const parts = [state.day];
  if (state.time) parts.push(`at ${state.time}`);
  if (state.place) parts.push(`at ${state.place}`);
  summaryText.textContent = `${parts.join(' ')} — ${planText()}.`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function fitText(text, maxWidth, startSize, minSize = 24) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${size}px "Patrick Hand", cursive`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function paintReplacement(x, y, width, height) {
  ctx.save();
  ctx.fillStyle = '#f8ecd8';
  ctx.globalAlpha = 0.98;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 12);
  ctx.fill();
  ctx.restore();
}

async function renderInvitation() {
  const image = await loadImage('assets/invitation.png');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const rows = [
    { label: `Day: ${state.day}`, x: 305, y: 685, w: 640, h: 58, size: 45 },
    { label: `Time: ${displayTime(state.time)}`, x: 305, y: 785, w: 620, h: 58, size: 45 },
    { label: `Place: ${state.place || 'open'}`, x: 305, y: 884, w: 620, h: 58, size: 43 },
    { label: `Plan: ${planText()}`, x: 305, y: 985, w: 650, h: 65, size: 39 }
  ];

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#2f241e';

  rows.forEach(row => {
    paintReplacement(row.x - 8, row.y - row.h / 2, row.w + 16, row.h);
    const size = fitText(row.label, row.w, row.size, 25);
    ctx.font = `${size}px "Patrick Hand", cursive`;
    ctx.fillText(row.label, row.x, row.y);
  });
}

createBtn.addEventListener('click', async () => {
  if (!state.day) {
    status.textContent = 'Please choose Tuesday or Wednesday first.';
    return;
  }

  status.textContent = 'Creating the final invitation…';
  try {
    await document.fonts.ready;
    await renderInvitation();
    status.textContent = '';
    details.classList.add('hidden');
    finalCard.classList.remove('hidden');
    finalCard.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    status.textContent = 'I could not create the image. Please refresh and try again.';
  }
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'our-date-invitation.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

editBtn.addEventListener('click', () => {
  finalCard.classList.add('hidden');
  details.classList.remove('hidden');
  details.scrollIntoView({ behavior: 'smooth' });
});
