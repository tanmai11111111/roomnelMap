/* 
 * Firebase Realtime Database integration for managing years per subject
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

// GameManager object for managing years
const GameManager = {
    games: [],

    loadGames() {
        const subject = getQueryParam('subject') || 'unknown';
        const yearsRef = ref(db, `years/${subject}`);
        onValue(yearsRef, (snapshot) => {
            const data = snapshot.val();
            this.games = data ? Object.values(data) : [];
            renderGames(); // Update UI whenever data changes
        }, (error) => {
            console.error('Error loading years:', error);
            alert('Không thể tải dữ liệu năm học.');
        });
    },

    async addGame(game) {
        try {
            const subject = getQueryParam('subject') || 'unknown';
            const snapshot = await get(ref(db, `years/${subject}`));
            const years = snapshot.val();
            if (years && Object.values(years).some(g => g.name.toLowerCase() === game.name.toLowerCase())) {
                alert('Năm học đã tồn tại.');
                return;
            }
            await set(ref(db, `years/${subject}/${game.name}`), game);
            alert('Đã thêm.');
        } catch (error) {
            console.error('Error adding year:', error);
            alert('Thêm năm học không thành công.');
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
            const subject = getQueryParam('subject') || 'unknown';
            await remove(ref(db, `years/${subject}/${name}`));
            alert(`Đã xóa: ${name} thành công.`);
            return true;
        } catch (error) {
            console.error('Error deleting year:', error);
            alert(`Xóa ${name} không thành công.`);
            return false;
        }
    },

    async updateGame(oldName, newGame) {
        try {
            const subject = getQueryParam('subject') || 'unknown';
            if (oldName !== newGame.name) {
                await remove(ref(db, `years/${subject}/${oldName}`));
            }
            await set(ref(db, `years/${subject}/${newGame.name}`), newGame);
            alert(`Đã cập nhật ${oldName} thành công.`);
            return true;
        } catch (error) {
            console.error('Error updating year:', error);
            alert(`Không tìm thấy ${oldName}.`);
            return false;
        }
    }
};

// Initialize
GameManager.loadGames();

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Render years list
function renderGames(games = GameManager.showGames()) {
    const subject = getQueryParam('subject') || 'qua các năm';
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    if (games.length === 0) {
        grid.innerHTML = '<p>Chưa nhập.</p>';
        return;
    }
    games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>Ghi chú: ${game.type}</p>
                <div class="game-actions">
                    <a class="show-btn" href="${game.image}">Truy cập</a>
                    <button class="edit-btn" onclick="editGame(${index})">Sửa</button>
                    <button class="delete-btn" onclick="deleteGame('${game.name}')">Xóa</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    document.querySelector('header h1').textContent = `Quản lý Danh sách ${subject}`;
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

// Save year
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

// Edit year
function editGame(index) {
    window.editIndex = index;
    const game = GameManager.games[index];
    document.getElementById('gameName').value = game.name;
    document.getElementById('gameSize').value = game.size || '';
    document.getElementById('gameType').value = game.type;
    document.getElementById('gameImage').value = game.image || '';
    openModal();
}

// Delete year
function deleteGame(name) {
    if (confirm(`Bạn có chắc muốn xóa năm học ${name}?`)) {
        GameManager.deleteGame(name);
    }
}
