let eventsData = [];

async function loadEvents() {
  try {
    const res  = await fetch(`${API}/api/events`);
    const json = await res.json();
    eventsData = json.data || [];

    const sel = document.getElementById('f-event');
    sel.innerHTML = '<option value="" disabled selected>— เลือกกิจกรรม —</option>';
    eventsData.forEach(ev => {
      const reg    = ev.registered_count || 0;
      const isFull = reg >= ev.max_participants;
      const opt    = document.createElement('option');
      opt.value       = ev.events_id;
      opt.textContent = `${ev.event_name}${isFull ? ' (เต็ม)' : ''}`;
      if (isFull) opt.disabled = true;
      sel.appendChild(opt);
    });

    // auto-select ถ้ามา events_id จาก URL
    const params = new URLSearchParams(location.search);
    const preId  = params.get('events_id');
    if (preId) { sel.value = preId; updatePreview(); }

  } catch {
    document.getElementById('f-event').innerHTML =
      '<option disabled selected>❌ โหลดไม่ได้ — Backend ไม่ได้รัน</option>';
  }
}

function updatePreview() {
  const evId = document.getElementById('f-event').value;
  const box  = document.getElementById('reg-preview');
  const btn  = document.getElementById('reg-btn');
  if (!evId) { box.className = 'alert-box'; return; }

  const ev   = eventsData.find(e => String(e.events_id) === String(evId));
  if (!ev) return;

  const reg  = ev.registered_count || 0;
  const left = ev.max_participants - reg;

  if (reg >= ev.max_participants) {
    box.className   = 'alert-box alert-error show';
    box.textContent = `⚠️ กิจกรรมนี้เต็มแล้ว (${ev.max_participants}/${ev.max_participants})`;
    btn.disabled = true; btn.style.opacity = '0.5';
  } else {
    const s = getStatus(reg, ev.max_participants);
    box.className = `alert-box ${s === 'warn' ? 'alert-warn' : 'alert-success'} show`;
    box.innerHTML = `ℹ️ ${ev.event_name} — ที่นั่งคงเหลือ <strong>${left} ที่</strong> (${reg}/${ev.max_participants})`;
    btn.disabled = false; btn.style.opacity = '1';
  }
}

function showMsg(cls, txt) {
  const box = document.getElementById('reg-msg');
  box.className   = `alert-box ${cls} show`;
  box.textContent = txt;
  setTimeout(() => box.className = 'alert-box', 4000);
}

async function submitRegister() {
  const name      = document.getElementById('f-name').value.trim();
  const email     = document.getElementById('f-email').value.trim();
  const events_id = document.getElementById('f-event').value;

  // client-side validate
  if (!name)     { showMsg('alert-error', '⚠️ กรุณากรอกชื่อ-นามสกุล'); return; }
  if (!email)    { showMsg('alert-error', '⚠️ กรุณากรอกอีเมล'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMsg('alert-error', '⚠️ รูปแบบอีเมลไม่ถูกต้อง'); return;
  }
  if (!events_id) { showMsg('alert-error', '⚠️ กรุณาเลือกกิจกรรม'); return; }

  const btn = document.getElementById('reg-btn');
  btn.disabled = true; btn.textContent = 'กำลังส่ง...';

  try {
    const res  = await fetch(`${API}/api/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, events_id: Number(events_id) }),
    });
    const json = await res.json();

    if (json.success) {
      showMsg('alert-success', `✅ ${json.message}`);
      showToast(`✅ ${json.message}`);
      document.getElementById('f-name').value  = '';
      document.getElementById('f-email').value = '';
      document.getElementById('f-event').value = '';
      document.getElementById('reg-preview').className = 'alert-box';
      await loadEvents();
    } else {
      const msg = json.errors ? json.errors.join(' / ') : json.message;
      showMsg('alert-error', `⚠️ ${msg}`);
    }
  } catch {
    showMsg('alert-error', '❌ เชื่อมต่อ Server ไม่ได้');
  } finally {
    btn.disabled = false; btn.textContent = '✓ Submit';
  }
}

loadEvents();
