// Connect 4 Game Logic
let board = Array.from({length: 6}, () => Array(7).fill(null));
let currentPlayer = 'red';
let gameActive = true;
let vsBot = false;

function initGame() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.col = col;
      cell.addEventListener('click', () => dropDisc(col));
      grid.appendChild(cell);
    }
  }
  updateDisplay();
}

function dropDisc(col) {
  if (!gameActive) return;
  
  // Find the lowest empty row in this column
  for (let row = 5; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      updateDisplay();
      
      if (checkWin(row, col)) {
        document.getElementById('status').textContent = `${currentPlayer.toUpperCase()} WINS!`;
        gameActive = false;
        return;
      }
      
      if (isBoardFull()) {
        document.getElementById('status').textContent = "It's a tie!";
        gameActive = false;
        return;
      }
      
      // Switch players
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      document.getElementById('status').textContent = `${currentPlayer.toUpperCase()}'s Turn`;
      
      // Bot turn
      if (vsBot && currentPlayer === 'yellow' && gameActive) {
        setTimeout(botMove, 500);
      }
      
      return;
    }
  }
}

function botMove() {
  // Simple bot: random valid column
  const validCols = [];
  for (let col = 0; col < 7; col++) {
    if (!board[0][col]) validCols.push(col);
  }
  
  if (validCols.length > 0) {
    const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
    dropDisc(randomCol);
  }
}

function checkWin(row, col) {
  const player = board[row][col];
  
  // Check all directions: horizontal, vertical, diagonals
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1]   // diagonal /
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1; // count current piece
    
    // Check positive direction
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    
    // Check negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    
    if (count >= 4) return true;
  }
  
  return false;
}

function isBoardFull() {
  return board[0].every(cell => cell !== null);
}

function updateDisplay() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const value = board[row][col];
    
    cell.className = 'cell';
    if (value) {
      cell.classList.add(value);
    }
  });
}

function resetGame() {
  board = Array.from({length: 6}, () => Array(7).fill(null));
  currentPlayer = 'red';
  gameActive = true;
  vsBot = false;
  updateDisplay();
  document.getElementById('status').textContent = "Red's Turn";
}

function playVsBot() {
  resetGame();
  vsBot = true;
  document.getElementById('status').textContent = "Red's Turn (vs Bot)";
}

// Initialize the game
initGame();