// Data bawaan awal berbasis data phpMyAdmin asli yang Anda kirim
const defaultPlayers = [
    { pID: 10, Char_Name: "Ronnie_Varquez", Char_UCP: "Ronnie", Char_Level: 7, Char_Money: 500, Char_BankMoney: 278901, Char_Admin: 0, Char_VIP: 0, Char_Jailed: 0, isOnline: true },
    { pID: 20, Char_Name: "Michael_Caldwell", Char_UCP: "Soleh", Char_Level: 4, Char_Money: 19994974, Char_BankMoney: 14295, Char_Admin: 9, Char_VIP: 11, Char_Jailed: 0, isOnline: false },
    { pID: 21, Char_Name: "Roy_Leesen", Char_UCP: "RylsZ", Char_Level: 4, Char_Money: 9538, Char_BankMoney: 17424, Char_Admin: 9, Char_VIP: 10, Char_Jailed: 0, isOnline: true },
    { pID: 22, Char_Name: "Stevano_Claudius", Char_UCP: "ndraa", Char_Level: 4, Char_Money: 119503, Char_BankMoney: 0, Char_Admin: 0, Char_VIP: 14, Char_Jailed: 0, isOnline: false },
    { pID: 23, Char_Name: "Agetha_Aleyna", Char_UCP: "BgWoWo", Char_Level: 6, Char_Money: 125950, Char_BankMoney: 0, Char_Admin: 0, Char_VIP: 0, Char_Jailed: 0, isOnline: false },
    { pID: 24, Char_Name: "Shion_Davinzi", Char_UCP: "Keyxinn", Char_Level: 3, Char_Money: 10024, Char_BankMoney: 0, Char_Admin: 0, Char_VIP: 0, Char_Jailed: 0, isOnline: true },
    { pID: 25, Char_Name: "Jay_Jaewoon", Char_UCP: "Jaewoon", Char_Level: 2, Char_Money: 7510, Char_BankMoney: 0, Char_Admin: 0, Char_VIP: 0, Char_Jailed: 0, isOnline: false },
    { pID: 28, Char_Name: "William_Theodore", Char_UCP: "Dikzzbv", Char_Level: 4, Char_Money: 1324, Char_BankMoney: 0, Char_Admin: 8, Char_VIP: 0, Char_Jailed: 0, isOnline: true }
];

function getPlayers() {
    const data = localStorage.getItem('aethen_players');
    return data ? JSON.parse(data) : defaultPlayers;
}

function savePlayers(players) {
    localStorage.setItem('aethen_players', JSON.stringify(players));
}

function getLogs() {
    const data = localStorage.getItem('aethen_logs');
    return data ? JSON.parse(data) : [
        { time: "2026-10-22 01:00", admin: "admin", action: "System Init", detail: "Database dikonfigurasi ke GitHub Pages" }
    ];
}

function addLog(action, detail) {
    const logs = getLogs();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    logs.unshift({ time: now, admin: "admin", action, detail });
    localStorage.setItem('aethen_logs', JSON.stringify(logs));
}

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Auth Handlers
function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;
    if (u === 'admin' && p === 'soleh123') {
        localStorage.setItem('isLoggedIn', 'true');
        showToast('Login Berhasil! Mengalihkan...', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
    } else {
        showToast('Username atau password salah!', 'error');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Guard Route
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const loggedIn = localStorage.getItem('isLoggedIn');

    if (!loggedIn && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }
    if (loggedIn && isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    updateOnlineBadge();

    if (document.getElementById('playerTableBody')) renderPlayers();
    if (document.getElementById('onlineTableBody')) renderOnlinePlayers();
    if (document.getElementById('logsTableBody')) renderLogs();
    if (document.getElementById('pName')) loadPlayerDetail();
});

function updateOnlineBadge() {
    const players = getPlayers();
    const onlineCount = players.filter(p => p.isOnline).length;
    const badge = document.getElementById('onlineCountBadge');
    if (badge) badge.textContent = onlineCount;
}

// Render Main Player List
function renderPlayers() {
    const players = getPlayers();
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const filter = document.getElementById('filterSelect')?.value || 'all';
    const tbody = document.getElementById('playerTableBody');

    let totalCash = 0, totalBank = 0, totalAdmin = 0, onlineCount = 0;

    const filtered = players.filter(p => {
        totalCash += p.Char_Money || 0;
        totalBank += p.Char_BankMoney || 0;
        if (p.Char_Admin > 0) totalAdmin++;
        if (p.isOnline) onlineCount++;

        const matchesSearch = p.Char_Name.toLowerCase().includes(search) || p.Char_UCP.toLowerCase().includes(search) || String(p.pID).includes(search);
        
        if (!matchesSearch) return false;
        if (filter === 'online') return p.isOnline;
        if (filter === 'admin') return p.Char_Admin > 0;
        if (filter === 'vip') return p.Char_VIP > 0;
        if (filter === 'jailed') return p.Char_Jailed > 0;
        if (filter === 'rich') return ((p.Char_Money || 0) + (p.Char_BankMoney || 0)) >= 1000000;

        return true;
    });

    document.getElementById('statTotal').textContent = players.length;
    document.getElementById('statOnline').textContent = onlineCount;
    document.getElementById('statAdmin').textContent = totalAdmin;
    document.getElementById('statCash').textContent = '$' + totalCash.toLocaleString();
    document.getElementById('statBank').textContent = '$' + totalBank.toLocaleString();

    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td class="muted">${p.pID}</td>
            <td><a href="player.html?id=${p.pID}" style="color:#60a5fa; font-weight:600; text-decoration:none;">${p.Char_Name}</a></td>
            <td class="muted">${p.Char_UCP}</td>
            <td class="r">${p.Char_Level}</td>
            <td class="r gold-t">$${(p.Char_Money||0).toLocaleString()}</td>
            <td class="r gold-t">$${(p.Char_BankMoney||0).toLocaleString()}</td>
            <td>
                ${p.isOnline ? '<span class="badge green">● Online</span>' : '<span class="badge">Offline</span>'}
                ${p.Char_Admin > 0 ? `<span class="badge pink">Admin ${p.Char_Admin}</span>` : ''}
                ${p.Char_Jailed > 0 ? `<span class="badge red">Penjara</span>` : ''}
            </td>
            <td>
                <a class="btn sm ghost" href="player.html?id=${p.pID}">Edit</a>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="8" class="muted" style="text-align:center;">Tidak ada karakter ditemukan.</td></tr>';
}

// Render Online Players
function renderOnlinePlayers() {
    const players = getPlayers().filter(p => p.isOnline);
    const tbody = document.getElementById('onlineTableBody');

    tbody.innerHTML = players.map(p => `
        <tr>
            <td class="muted">${p.pID}</td>
            <td><strong style="color:#f8fafc;">${p.Char_Name}</strong></td>
            <td class="muted">${p.Char_UCP}</td>
            <td class="muted">103.125.16.${p.pID}</td>
            <td class="r">${p.Char_Level}</td>
            <td>${p.Char_Admin > 0 ? `<span class="badge pink">Staff Admin Lvl ${p.Char_Admin}</span>` : '<span class="badge">Warga Biasa</span>'}</td>
            <td><a class="btn sm" href="player.html?id=${p.pID}">Kelola Saldo</a></td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="muted" style="text-align:center;">Saat ini tidak ada pemain yang sedang online.</td></tr>';
}

// Render Logs
function renderLogs() {
    const logs = getLogs();
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = logs.map(l => `
        <tr>
            <td class="muted">${l.time}</td>
            <td><span class="badge pink">${l.admin}</span></td>
            <td><span class="badge gold">${l.action}</span></td>
            <td>${l.detail}</td>
        </tr>
    `).join('');
}

// Modal Handlers
function openAddPlayerModal() { document.getElementById('addModal').classList.add('active'); }
function closeAddPlayerModal() { document.getElementById('addModal').classList.remove('active'); }

function handleAddPlayer(e) {
    e.preventDefault();
    const players = getPlayers();
    const name = document.getElementById('addName').value;
    const ucp = document.getElementById('addUcp').value;
    const level = parseInt(document.getElementById('addLevel').value);
    const money = parseInt(document.getElementById('addMoney').value);

    const newPlayer = {
        pID: players.length ? Math.max(...players.map(p => p.pID)) + 1 : 10,
        Char_Name: name,
        Char_UCP: ucp,
        Char_Level: level,
        Char_Money: money,
        Char_BankMoney: 0,
        Char_Admin: 0,
        Char_VIP: 0,
        Char_Jailed: 0,
        isOnline: true
    };

    players.push(newPlayer);
    savePlayers(players);
    addLog('Tambah Pemain', `Membuat karakter baru: ${name} (UCP: ${ucp})`);
    closeAddPlayerModal();
    showToast('Karakter baru berhasil ditambahkan!');
    renderPlayers();
}

// Load & Edit Player Detail
function loadPlayerDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const p = getPlayers().find(x => x.pID === id);

    if (!p) {
        document.getElementById('pName').textContent = "Pemain Tidak Ditemukan";
        return;
    }

    document.getElementById('pName').textContent = p.Char_Name;
    document.getElementById('pMeta').textContent = `ID ${p.pID} · UCP ${p.Char_UCP} · Level ${p.Char_Level}`;

    document.getElementById('pBadges').innerHTML = `
        ${p.isOnline ? '<span class="badge green">Online</span>' : '<span class="badge">Offline</span>'}
        ${p.Char_Admin > 0 ? `<span class="badge pink">Admin Lvl ${p.Char_Admin}</span>` : ''}
        ${p.Char_Jailed > 0 ? `<span class="badge red">Dipenjara</span>` : ''}
    `;

    document.getElementById('editName').value = p.Char_Name;
    document.getElementById('editUcp').value = p.Char_UCP;
    document.getElementById('editLevel').value = p.Char_Level;
    document.getElementById('editAdmin').value = p.Char_Admin;
    document.getElementById('editJailed').value = p.Char_Jailed;
    document.getElementById('editVip').value = p.Char_VIP || 0;
}

function handleMoneyUpdate(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const players = getPlayers();
    const idx = players.findIndex(x => x.pID === id);

    if (idx === -1) return;

    const col = document.getElementById('moneyCol').value;
    const mode = document.getElementById('moneyMode').value;
    const amt = parseInt(document.getElementById('moneyAmount').value);

    let oldVal = players[idx][col] || 0;
    let newVal = oldVal;

    if (mode === 'add') newVal += amt;
    else if (mode === 'sub') newVal -= amt;
    else if (mode === 'set') newVal = amt;

    players[idx][col] = Math.max(0, newVal);
    savePlayers(players);
    addLog('Update Uang', `${players[idx].Char_Name} (${col}): $${oldVal} → $${newVal}`);
    showToast('Saldo berhasil diperbarui!');
    loadPlayerDetail();
}

function handleEditPlayer(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const players = getPlayers();
    const idx = players.findIndex(x => x.pID === id);

    if (idx === -1) return;

    players[idx].Char_Name = document.getElementById('editName').value;
    players[idx].Char_UCP = document.getElementById('editUcp').value;
    players[idx].Char_Level = parseInt(document.getElementById('editLevel').value);
    players[idx].Char_Admin = parseInt(document.getElementById('editAdmin').value);
    players[idx].Char_Jailed = parseInt(document.getElementById('editJailed').value);
    players[idx].Char_VIP = parseInt(document.getElementById('editVip').value);

    savePlayers(players);
    addLog('Edit Karakter', `Mengubah data profil karakter ${players[idx].Char_Name}`);
    showToast('Data database berhasil disimpan!');
    loadPlayerDetail();
}