async function loadEvents() {
  try {
    const res    = await fetch(`${API}/api/events`);
    const json   = await res.json();
    const events = json.data || [];
    const list   = document.getElementById('eventsList');

    if (!events.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><div>ยังไม่มีกิจกรรม</div></div>';
      return;
    }

    const totalReg = events.reduce((a, e) => a + (e.registered_count || 0), 0);
    const totalMax = events.reduce((a, e) => a + e.max_participants, 0);
    document.getElementById('stat-total').textContent = events.length;
    document.getElementById('stat-reg').textContent   = totalReg;
    document.getElementById('stat-left').textContent  = totalMax - totalReg;

    list.className = 'events-grid';
    list.innerHTML = events.map((ev, i) => {
      const reg    = ev.registered_count || 0;
      const s      = getStatus(reg, ev.max_participants);
      const left   = ev.max_participants - reg;
      const isFull = s === 'full';
      const numCls = s === 'ok' ? 'slots-ok' : s === 'warn' ? 'slots-warn' : 'slots-full';
      const barCls = s === 'ok' ? 'bar-ok'   : s === 'warn' ? 'bar-warn'   : 'bar-full';

      return `
      <div class="event-card"
           onclick="location.href='../register/index.html?events_id=${ev.events_id}'"
           style="animation-delay:${i * 0.07}s">
        <div class="ec-thumb ${GRADS[i % GRADS.length]}">
          <div class="ec-thumb-emoji">${EMOJIS[i % EMOJIS.length]}</div>
          <span class="ec-category">${CATS[i % CATS.length]}</span>
          <div class="ec-status-bar ${barCls}"></div>
        </div>
        <div class="ec-body">
          <div class="ec-date"><span class="ec-date-dot"></span>${formatDate(ev.events_date)}</div>
          <div class="ec-title">${ev.event_name}</div>
          <div class="ec-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${ev.location}
          </div>
        </div>
        <div class="ec-footer">
          <div class="ec-slots">
            <span class="ec-slots-num ${numCls}">${isFull ? ev.max_participants : left}</span>
            <span class="ec-slots-label">&nbsp;${isFull ? '— เต็มแล้ว' : 'ที่ว่าง'}</span>
          </div>
          ${isFull
            ? `<button class="btn-register-card btn-full-card" onclick="event.stopPropagation()">เต็มแล้ว</button>`
            : `<button class="btn-register-card"
                 onclick="event.stopPropagation();location.href='../register/index.html?events_id=${ev.events_id}'">
                 สมัคร
               </button>`
          }
        </div>
      </div>`;
    }).join('');

  } catch {
    document.getElementById('eventsList').innerHTML =
      '<div class="loading" style="color:var(--red)">❌ โหลดไม่ได้ — ตรวจสอบว่า Backend รันอยู่</div>';
  }
}

loadEvents();
