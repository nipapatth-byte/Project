let editingId = null // เก็บ id ที่กำลังแก้ไขอยู่

// ─── โหลดข้อมูลทั้งหมดเมื่อหน้าเปิด ───
window.onload = async () => {
    if (!checkLogin()) return  // ถ้าไม่ได้ login ให้หยุดทันที ไม่โหลดต่อ
    await loadEvents()
    await loadParticipants()
}

// ─── เช็คว่า login แล้วหรือยัง ───
function checkLogin() {
    const admin = localStorage.getItem('admin')
    if (!admin) {
        window.location.href = 'login.html'
        return false  // หยุดการทำงานต่อ
    }
    return true
}

// ─── Toast แจ้งเตือน ───
function showToast(message, type = 'error', targetId = 'modal-toast') {
    const toast = document.getElementById(targetId)
    if (!toast) return
    toast.textContent = message
    toast.className = `toast-inline ${type}`
    setTimeout(() => {
        toast.className = 'toast-inline'
        toast.textContent = ''
    }, 3000)
}

// ════════════════════════════════════════
//  ส่วน กิจกรรม
// ════════════════════════════════════════

const loadEvents = async () => {
    try {
        const res = await api.events.getAll()
        const events = res.data.data
        const table = document.getElementById('event-table')

        // ลบ row เก่า (ไม่ลบ header)
        table.querySelectorAll('.row-data').forEach(r => r.remove())

        if (events.length === 0) {
            table.insertAdjacentHTML('beforeend', `
                <div style="text-align:center; padding:20px; color:#aaa;">ยังไม่มีกิจกรรม</div>
            `)
            return
        }

        events.forEach(e => {
            const date = new Date(e.events_date).toLocaleDateString('th-TH', {
                day: 'numeric', month: 'short', year: 'numeric'
            })
            const row = document.createElement('div')
            row.className = 'row-Participants row-data'
            row.style.gridTemplateColumns = '1fr 1fr 1fr 80px 120px'
            row.innerHTML = `
                <div>${e.event_name}</div>
                <div>${e.location}</div>
                <div>${date}</div>
                <div>${e.max_participants}</div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-edit" onclick="openEditModal(${e.events_id}, '${e.event_name}', '${e.location}', '${e.events_date}', ${e.max_participants})">แก้ไข</button>
                    <button class="btn-delete" onclick="deleteEvent(${e.events_id})">ลบ</button>
                </div>
            `
            table.appendChild(row)
        })
    } catch (err) {
        console.error('โหลดกิจกรรมไม่สำเร็จ:', err)
    }
}

// ─── เปิด Modal เพิ่มกิจกรรม ───
function openAddModal() {
    editingId = null
    document.getElementById('modal-title').textContent = 'เพิ่มกิจกรรม'
    document.getElementById('m-name').value = ''
    document.getElementById('m-location').value = ''
    document.getElementById('m-date').value = ''
    document.getElementById('m-max').value = ''
    document.getElementById('modal-overlay').style.display = 'flex'
}

// ─── เปิด Modal แก้ไขกิจกรรม ───
function openEditModal(id, name, location, date, max) {
    editingId = id
    document.getElementById('modal-title').textContent = 'แก้ไขกิจกรรม'
    document.getElementById('m-name').value = name
    document.getElementById('m-location').value = location
    // แปลง date ให้ตรงกับ datetime-local
    const d = new Date(date)
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16)
    document.getElementById('m-date').value = local
    document.getElementById('m-max').value = max
    document.getElementById('modal-overlay').style.display = 'flex'
}

// ─── ปิด Modal ───
function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none'
}

// ─── บันทึก (เพิ่ม / แก้ไข) ───
async function saveEvent() {
    const event_name = document.getElementById('m-name').value.trim()
    const location = document.getElementById('m-location').value.trim()
    const events_date = document.getElementById('m-date').value
    const max_participants = document.getElementById('m-max').value

    if (!event_name || !location || !events_date || !max_participants) {
        showToast('กรุณากรอกข้อมูลให้ครบ', 'error')
        return
    }

    try {
        if (editingId) {
            // แก้ไข
            await api.events.update(editingId, { event_name, location, events_date, max_participants })
            showToast('แก้ไขกิจกรรมสำเร็จ', 'success')
        } else {
            // เพิ่มใหม่
            await api.events.create({ event_name, location, events_date, max_participants })
            showToast('เพิ่มกิจกรรมสำเร็จ', 'success')
        }
        setTimeout(() => closeModal(), 1000)
        await loadEvents()
    } catch (err) {
        showToast(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error')
    }
}

// ─── ลบกิจกรรม ───
async function deleteEvent(id) {
    if (!confirm('ยืนยันลบกิจกรรมนี้?')) return
    try {
        await api.events.remove(id)
        await loadEvents()
    } catch (err) {
        alert(err.response?.data?.message || 'ลบไม่สำเร็จ')
    }
}

// ════════════════════════════════════════
//  ส่วน ผู้สมัคร
// ════════════════════════════════════════

const loadParticipants = async () => {
    try {
        const res = await api.participants.getAll()
        const participants = res.data.data
        const table = document.getElementById('participant-table')

        table.querySelectorAll('.row-data').forEach(r => r.remove())

        if (participants.length === 0) {
            table.insertAdjacentHTML('beforeend', `
                <div style="text-align:center; padding:20px; color:#aaa;">ยังไม่มีผู้สมัคร</div>
            `)
            return
        }

        participants.forEach((p, index) => {
            const row = document.createElement('div')
            row.className = 'row-Participants row-data'
            row.style.gridTemplateColumns = '60px 1fr 1fr 1fr 80px'
            row.innerHTML = `
                <div>${index + 1}</div>
                <div>${p.name}</div>
                <div>${p.email}</div>
                <div>${p.event_name}</div>
                <div>
                    <button class="btn-delete" onclick="deleteParticipant(${p.participant_id})">ลบ</button>
                </div>
            `
            table.appendChild(row)
        })
    } catch (err) {
        console.error('โหลดผู้สมัครไม่สำเร็จ:', err)
    }
}

// ─── ลบผู้สมัคร ───
async function deleteParticipant(id) {
    if (!confirm('ยืนยันลบผู้สมัครนี้?')) return
    try {
        await api.participants.remove(id)
        await loadParticipants()
    } catch (err) {
        alert(err.response?.data?.message || 'ลบไม่สำเร็จ')
    }
}
function logout() {
    localStorage.removeItem('admin')
    window.location.href = 'login.html'
}

function searchParticipantsAdmin() {
    const keyword = document.getElementById('search-participant').value.toLowerCase()
    const rows = document.querySelectorAll('#participant-table .row-data')

    rows.forEach(row => {
        const text = row.textContent.toLowerCase()
        row.style.display = text.includes(keyword) ? 'grid' : 'none'
    })
}