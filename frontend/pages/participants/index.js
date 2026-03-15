function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadParticipants() {
  const tbody   = document.getElementById('pTable');
  const empty   = document.getElementById('emptyState');
  const loading = document.getElementById('loadingState');

  try {
    const res  = await fetch(`${API}/api/participants`);
    const json = await res.json();
    loading.style.display = 'none';

    if (!json.data.length) { empty.style.display = 'block'; return; }

    tbody.innerHTML = json.data.map((p, i) => `
      <tr>
        <td class="td-num">${i + 1}</td>
        <td class="td-name">${esc(p.name)}</td>
        <td class="td-email">${esc(p.email)}</td>
        <td>
          <span class="event-tag tag-${(p.events_id % 5) + 1}">
            ${esc(p.event_name)}
          </span>
        </td>
        <td>
          <button onclick="confirmDelete(${p.participant_id}, '${esc(p.name)}')"
            style="font-size:12px;padding:4px 12px;border-radius:7px;
                   border:1px solid rgba(200,34,0,0.25);
                   background:var(--red-bg);color:var(--red);
                   cursor:pointer;font-family:inherit;font-weight:600">
            ลบ
          </button>
        </td>
      </tr>`).join('');

  } catch {
    loading.innerHTML = '<span style="color:var(--red)">❌ โหลดไม่ได้</span>';
  }
}

function confirmDelete(id, name) {
  document.getElementById('modalText').textContent = `ต้องการลบ "${name}" ออกจากระบบ?`;
  document.getElementById('modalConfirm').onclick  = () => doDelete(id);
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

async function doDelete(id) {
  closeModal();
  try {
    const res  = await fetch(`${API}/api/participants/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('🗑 ลบข้อมูลเรียบร้อย');
      document.getElementById('pTable').innerHTML           = '';
      document.getElementById('loadingState').style.display = 'block';
      document.getElementById('loadingState').textContent   = 'กำลังโหลด...';
      document.getElementById('emptyState').style.display   = 'none';
      loadParticipants();
    }
  } catch {
    showToast('❌ เชื่อมต่อ Server ไม่ได้');
  }
}

loadParticipants();
