window.onload = async () => {
    await loadParticipants();
};

const loadParticipants = async () => {
    try {
        const res = await api.participants.getAll();
        const participants = res.data.data;

        const container = document.querySelector(".container-Participants");

        container.querySelectorAll(".row-data").forEach(r => r.remove());

        if (participants.length === 0) {
            container.insertAdjacentHTML("beforeend", `
                <div style="text-align:center; padding: 20px; color:#aaa;">
                    ยังไม่มีผู้ลงทะเบียน
                </div>
            `);
            return;
        }

        participants.forEach((p, index) => {
            const date = new Date(p.created_at).toLocaleDateString("th-TH", {
                day: "numeric", month: "short", year: "numeric"
            });

            const row = document.createElement("div");
            row.className = "row-Participants row-data";
            row.innerHTML = `
                <div class="card-participant-number">${index + 1}</div>
                <div class="card-participant-name">${p.name}</div>
                <div class="card-participant-email">${p.email}</div>
                <div class="card-participant-event">${p.event_name}</div>
            `;
            container.appendChild(row);
        });

    } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", err);
        alert("ไม่สามารถโหลดรายชื่อผู้เข้าร่วมได้");
    }
};

function searchParticipants() {
    const keyword = document.getElementById('search-input').value.toLowerCase()
    const rows = document.querySelectorAll('.row-data')

    rows.forEach(row => {
        const text = row.textContent.toLowerCase()
        row.style.display = text.includes(keyword) ? 'grid' : 'none'
    })
}