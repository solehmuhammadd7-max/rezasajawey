function handleLogin(event) {
    event.preventDefault();
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if (u === 'admin' && p === 'soleh123') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Username atau password salah! Gunakan admin / soleh123');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const isLoginPge = window.location.pathname.includes('login.html');
    const loggedIn = localStorage.getItem('isLoggedIn');

    if (!loggedIn && !isLoginPge) {
        window.location.href = 'login.html';
    } else if (loggedIn && isLoginPge) {
        window.location.href = 'index.html';
    }
});

function updateMoney(event) {
    event.preventDefault();
    alert('Simulasi: Saldo berhasil diperbarui!');
}