/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */



        // Đối tượng quản lý trò chơi (tương đương addGame.java)
        const GameManager = {
            games: [],

            loadGames() {
                this.games = JSON.parse(localStorage.getItem('data_vanhoc')) || [];
            },

            saveGames() {
                localStorage.setItem('data_vanhoc', JSON.stringify(this.games));
            },

            addGame(game) {
                if (this.games.some(g => g.name.toLowerCase() === game.name.toLowerCase())) {
                    alert('Năm đã tồn tại.');
                    return;
                }
                this.games.push(game);
                this.saveGames();
                alert('Đã thêm.');
            },

            showGames() {
                return this.games.length ? this.games : [];
            },

            searchGames(key) {
                return this.games.filter(g => g.name.toLowerCase().includes(key.toLowerCase()));
            },

            deleteGame(name) {
                const index = this.games.findIndex(g => g.name.toLowerCase() === name.toLowerCase());
                if (index !== -1) {
                    this.games.splice(index, 1);
                    this.saveGames();
                    alert(`Đã xóa: ${name} thành công.`);
                    return true;
                }
                alert(`Xóa ${name} không thành công.`);
                return false;
            },

            updateGame(oldName, newGame) {
                const index = this.games.findIndex(g => g.name.toLowerCase() === oldName.toLowerCase());
                if (index !== -1) {
                    this.games[index] = newGame;
                    this.saveGames();
                    alert(`Đã cập nhật ${oldName} thành công.`);
                    return true;
                }
                alert(`Không tìm thấy ${oldName}.`);
                return false;
            }
        };

        // Khởi tạo
        GameManager.loadGames();
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
}
        // Hàm hiển thị danh sách trò chơi
        function renderGames(games = GameManager.showGames()) {
            const subject = getQueryParam('subject');
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
                            <a class="show-btn" href="${game.image}">Truy cập111</a>
                        
                            <button class="edit-btn" onclick="editGame(${index})">Sửa</button>
                            <button class="delete-btn" onclick="deleteGame('${game.name}')">Xóa</button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
            document.querySelector('header h1').textContent = `Quản lý Danh sách ${subject || 'qua các năm'}`;
        }
GameManager.loadGames();
        // Hàm tìm kiếm
        function searchGames() {
            const key = document.getElementById('searchInput').value.trim();
            if (key) {
                renderGames(GameManager.searchGames(key));
            } else {
                renderGames();
            }
        }

        // Hàm mở modal
        function openModal() {
            document.getElementById('gameModal').style.display = 'flex';
        }

        // Hàm đóng modal
        function closeModal() {
            document.getElementById('gameModal').style.display = 'none';
            document.getElementById('gameName').value = '';
            document.getElementById('gameSize').value = '';
            document.getElementById('gameType').value = '';
            document.getElementById('gameImage').value = '';
            window.editIndex = -1;
        }

        // Hàm lưu trò chơi
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
                renderGames();
                closeModal();
            } else {
                alert('Vui lòng nhập đầy đủ thông tin!');
            }
        }

        // Hàm chỉnh sửa trò chơi
        function editGame(index) {
            window.editIndex = index;
            const game = GameManager.games[index];
            document.getElementById('gameName').value = game.name;
            document.getElementById('gameSize').value = game.size ||'';
            document.getElementById('gameType').value = game.type;
            document.getElementById('gameImage').value = game.image || '';
            openModal();
        }

        // Hàm xóa trò chơi
        function deleteGame(name) {
            if (confirm(`Bạn có chắc muốn xóa trò chơi ${name}?`)) {
                GameManager.deleteGame(name);
                renderGames();
            }
        }

        // Khởi tạo với dữ liệu mẫu
       
        renderGames();
   

