// index.js — Register


function showToast(message, type = "error") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast-inline ${type}`;
    setTimeout(() => {
        toast.className = "toast-inline";
        toast.textContent = "";
    }, 3000);
}

function validate(name, email, events_id) {
    if (!name.trim() && !email.trim() && !events_id) {
        showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
        return false;
    }
    if (!name.trim()) {
        showToast("กรุณากรอกชื่อ-นามสกุล!", "error");
        return false;
    }
    if (!email.trim()) {
        showToast("กรุณากรอกอีเมล!", "error");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("รูปแบบอีเมลไม่ถูกต้อง", "error");
        return false;
    }
    if (!events_id) {
        showToast("กรุณาเลือกกิจกรรม", "error");
        return false;
    }
    return true;
}

async function loadEvents() {
    try {
        const res = await api.events.getAll();
        const select = document.getElementById("event-select");

        // ดึง eventId จาก URL ถ้ามี (มาจากหน้า Activity)
        const params = new URLSearchParams(window.location.search);
        const preselectedId = params.get("eventId");

        res.data.data.forEach(event => {
            const available = event.max_participants - event.registered_count;

            const option = document.createElement("option");
            option.value = event.events_id;
            option.textContent = `${event.event_name} (ที่ว่าง ${available} ที่)`;

            if (available <= 0) {
                option.disabled = true;
                option.textContent = `${event.event_name} (เต็มแล้ว)`;
            }

            select.appendChild(option);
        });

        // เลือก event อัตโนมัติถ้ามาจากหน้า Activity
        if (preselectedId) {
            select.value = preselectedId;
        }
    } catch (err) {
        showToast("ไม่สามารถโหลดรายการกิจกรรมได้", "error");
    }
}

async function submitData() {
    const name      = document.getElementById("name").value;
    const email     = document.getElementById("email").value;
    const events_id = document.getElementById("event-select").value;

    if (!validate(name, email, events_id)) return;

    try {
        const res = await api.register.create({ name, email, events_id });

        showToast(res.data.message, "success");

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("event-select").value = "";

        setTimeout(() => {
            window.location.href = '../Activity/index.html';
        }, 1500);
    } catch (err) {
        if (err.response) {
            showToast(err.response.data.message || "เกิดข้อผิดพลาด", "error");
        } else {
            showToast("ไม่สามารถเชื่อมต่อ server ได้", "error");
        }
    }
}

document.addEventListener("DOMContentLoaded", loadEvents);
