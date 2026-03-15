const API = 'http://localhost:8000';

const GRADS  = ['grad-orange','grad-blue','grad-purple','grad-teal','grad-green','grad-gold'];
const EMOJIS = ['💻','🧑‍💻','🚀','🌐','🖥️','📊','💻','📱','🧩','📊','🔑','🤖'];
const CATS   = ['PROGRAMMING','WORKSHOP','PROGRAMMING','DESIGN','PROGRAMMING','WORKSHOP',
                'PROGRAMMING','DESIGN','WORKSHOP','PROGRAMMING','WORKSHOP','PROGRAMMING'];

// ── Toast ──────────────────────────────────────────────────
let _tt;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Status helpers ─────────────────────────────────────────
function getStatus(registered, max) {
  if (registered >= max) return 'full';
  if (registered / max >= 0.5) return 'warn';
  return 'ok';
}

// ── Date format ────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
