const opening = document.getElementById('opening');
const editor = document.getElementById('editor');
const noEnding = document.getElementById('noEnding');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const choiceZone = document.getElementById('choiceZone');
const microcopy = document.getElementById('microcopy');
const backBtn = document.getElementById('backBtn');

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
