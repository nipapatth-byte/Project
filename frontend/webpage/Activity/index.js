
let events = []

window.onload = async () => {
  await loadEvents()
}

const loadEvents = async () => {

  try {

    const response = await api.events.getAll()

    events = response.data.data

    let html = ''

    for (const e of events) {

      html += `
    <div class="container style=">
        <div class="header">${e.event_name}</div>
        <div class="date">
            <p>📅 ${new Date(e.events_date).toLocaleString('th-TH', {
        day: 'numeric', month: 'long', year: 'numeric',

      })}</p>
            <p>📍 ${e.location}</p>
        </div>

        <div class="progress-wrap">
            <div class="progress-label">
                <span>ที่ว่าง ${e.max_participants - e.registered_count} ที่</span>
                <span>${e.max_participants} ที่</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(e.registered_count / e.max_participants) * 100}%"></div>
            </div>
        </div>

        <button class="button-register" onclick="goRegister(${e.events_id})">
            Register
        </button>
    </div>
      `
    }

    document.getElementById('event-list').innerHTML = html

  } catch (error) {
    console.log(error)
  }

}

const goRegister = (id) => {

  window.location.href =
    `../Register/index.html?eventId=${id}`

}

function searchEvents() {
    const keyword = document.getElementById('search-input').value.toLowerCase()
    const cards = document.querySelectorAll('.container')

    cards.forEach(card => {
        const text = card.textContent.toLowerCase()
        card.style.display = text.includes(keyword) ? 'block' : 'none'
    })
}
