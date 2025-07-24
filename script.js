/* 
 * Firebase Realtime Database integration for managing subjects
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, set, get, remove, onValue } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBtgW-JvPtPjsSuzHpi_V0JCs_mFU1c59A",
  authDomain: "filedulieu-a1bc9.firebaseapp.com",
  projectId: "filedulieu-a1bc9",
  storageBucket: "filedulieu-a1bc9.firebasestorage.app",
  messagingSenderId: "83127152882",
  appId: "1:83127152882:web:20885065b5ab5eae2ce06b",
  measurementId: "G-KJZF1KPVSC"
    databaseURL: "https://filedulieu-a1bc9-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// GameManager object for managing subjects
const GameManager = {
    games: [],

    loadGames() {
        const gamesRef = ref(db, 'games');
        onValue(gamesRef, (snapshot) => {
            const data = snapshot.val();
            this.games = data ? Object.values(data) : [];
            renderGames(); // Update UI whenever data changes
        }, (error) => {
            console.error('Error loading games:', error);
            alert('Không thể tải dữ liệu môn học.');
        });
    },

    async addGame(game) {
        try {
            const snapshot = await get(ref(db, 'games'));
            const games = snapshot.val();
            if (games && Object.values(games).some(g => g.name.toLowerCase() === game.name.toLowerCase())) {
                alert('Môn học đã tồn tại.');
                return;
            }
            await set(ref(db, `games/${game.name}`), game);
            alert('Đã thêm.');
        } catch (error) {
            console.error('Error adding game:', error);
            alert('Thêm môn học không thành công.');
        }
    },

    showGames() {
        return this.games.length ? this.games : [];
    },

    searchGames(key) {
        return this.games.filter(g => g.name.toLowerCase().includes(key.toLowerCase()));
    },

    async deleteGame(name) {
        try {
            await remove(ref(db, `games/${name}`));
            alert(`Đã xóa môn học: ${name} thành công.`);
            return true;
        } catch (error) {
            console.error('Error deleting game:', error);
            alert(`Xóa ${name} không thành công.`);
            return false;
        }
    },

    async updateGame(oldName, newGame) {
        try {
            if (oldName !== newGame.name) {
                await remove(ref(db, `games/${oldName}`));
            }
            await set(ref(db, `games/${newGame.name}`), newGame);
            alert(`Đã cập nhật ${oldName} thành công.`);
            return true;
        } catch (error) {
            console.error('Error updating game:', error);
            alert(`Không tìm thấy ${oldName}.`);
            return false;
        }
    }
};

// Initialize
GameManager.loadGames();

// Render games list
function renderGames(games = GameManager.showGames()) {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    if (games.length === 0) {
        grid.innerHTML = '<p>Chưa nhập.</p>';
        return;
    }
    const pageMapping = {
        'Toán': 'web2.html?subject=Toán',
        'Văn': 'web2.html?subject=Văn',
        'Lý': 'web2.html?subject=Lý',
        'Hóa': 'web2.html?subject=Hóa',
        'Sinh': 'web2.html?subject=Sinh'
    };
    games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <a href="#">
                <img src="${game.image || 'https://via.placeholder.com/300x150?text=' + game.name}" alt="${game.name}">
            </a>
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>Dung lượng: ${game.size}</p>
                <p>Lớp: ${game.type}</p>
                <div class="game-actions">
                    <button class="show-btn" onclick="window.location.href='${pageMapping[game.name] || 'web2.html?subject=' + game.name}'">Truy cập</button>
                    <button class="edit-btn" onclick="editGame(${index})">Sửa</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Search function
function searchGames() {
    const key = document.getElementById('searchInput').value.trim();
    if (key) {
        renderGames(GameManager.searchGames(key));
    } else {
        renderGames();
    }
}

// Open modal
function openModal() {
    document.getElementById('gameModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
    document.getElementById('gameName').value = '';
    document.getElementById('gameSize').value = '';
    document.getElementById('gameType').value = '';
    document.getElementById('gameImage').value = '';
    window.editIndex = -1;
}

// Save game
function saveGame() {
    const name = document.getElementById('gameName').value.trim();
    const size = document.getElementById('gameSize').value.trim();
    const type = document.getElementById('gameType').value.trim();
    const image = document.getElementById('gameImage').value.trim();
    if (name && size && type) {
        const game = { name, size, type, image };
        if (window.editIndex >= 0) {
            GameManager.updateGame(GameManager.games[window.editIndex].name, game);
        } else {
            GameManager.addGame(game);
        }
        closeModal();
    } else {
        alert('Vui lòng nhập đầy đủ thông tin!');
    }
}

// Edit game
function editGame(index) {
    window.editIndex = index;
    const game = GameManager.games[index];
    document.getElementById('gameName').value = game.name;
    document.getElementById('gameSize').value = game.size;
    document.getElementById('gameType').value = game.type;
    document.getElementById('gameImage').value = game.image || '';
    openModal();
}

// Delete game
function deleteGame(name) {
    if (confirm(`Bạn có chắc muốn xóa ${name}?`)) {
        GameManager.deleteGame(name);
    }
}
