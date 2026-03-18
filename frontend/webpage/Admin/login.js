// login.js — Admin Login

function showToast(message, type = 'error') {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.textContent = message
    toast.className = `toast-inline ${type}`
    setTimeout(() => {
        toast.className = 'toast-inline'
        toast.textContent = ''
    }, 3000)
}


async function submitData() {
    const username = document.querySelector('.input-textlogin[placeholder="Username"]').value.trim()
    const password = document.querySelector('.input-textlogin[placeholder="Password"]').value.trim()

    try {
        const res = await api.admin.login({ username, password })
        
        localStorage.setItem('admin', JSON.stringify(res.data))
        
        showToast('เข้าสู่ระบบสำเร็จ', 'success')
        setTimeout(() => {
            window.location.href = 'index.html'
        }, 800)
    } catch (err) {
        showToast(err.response?.data?.message || 'Username หรือ Password ไม่ถูกต้อง', 'error')
    }
}
