const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const choiceZone = document.getElementById('choiceZone');
const microcopy = document.getElementById('microcopy');
const details = document.getElementById('details');
const noEnding = document.getElementById('noEnding');
const summaryText = document.getElementById('summaryText');
const copyBtn = document.getElementById('copyBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const status = document.getElementById('status');

let dodgeCount = 0;
const maxDodges = 4;
const dodgeMessages = [
  'That button seems a little shy 👀',
  'Are you completely sure? 😄',
  'It keeps escaping. Very suspicious.',
  'Okay, okay — one more try.'
];

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
  noBtn.addEventListener(eventName, (event) => {
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
  document.getElementById('hero').classList.add('hidden');
  noEnding.classList.remove('hidden');
  noEnding.scrollIntoView({ behavior: 'smooth' });
});

yesBtn.addEventListener('click', () => {
  document.getElementById('hero').classList.add('hidden');
  details.classList.remove('hidden');
  details.scrollIntoView({ behavior: 'smooth' });
});

const state = { day: '', time: '' };

document.querySelectorAll('.pill').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.dataset.group;
    document.querySelectorAll(`[data-group="${group}"]`).forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    state[group] = button.dataset.value;
    updateSummary();
  });
});

function buildMessage() {
  if (!state.day || !state.time) return '';
  return `${state.day} at ${state.time} works for me 😊`;
}

function updateSummary() {
  if (!state.day || !state.time) {
    summaryText.textContent = 'Choose a day and time above.';
    whatsappBtn.classList.add('disabled');
    whatsappBtn.setAttribute('aria-disabled', 'true');
    return;
  }

  const message = buildMessage();
  summaryText.textContent = `${state.day} at ${state.time} — Something to drink and a little walk.`;
  whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
  whatsappBtn.classList.remove('disabled');
  whatsappBtn.setAttribute('aria-disabled', 'false');
}

copyBtn.addEventListener('click', async () => {
  const message = buildMessage();
  if (!message) {
    status.textContent = 'Pick a day and time first.';
    return;
  }

  try {
    await navigator.clipboard.writeText(message);
    status.textContent = 'Copied. You can paste it into the chat.';
  } catch {
    status.textContent = message;
  }
});
