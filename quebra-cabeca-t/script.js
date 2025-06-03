let board = [];
let pieceBank = [];
let moves = 0;
let currentImage = 'puzzle_image1.png';
let currentDifficulty = 4; // Padrão: 4x4
let selectedPiece = null;
const grid = document.getElementById('grid');
const pieceBankElement = document.getElementById('piece-bank');
const movesDisplay = document.getElementById('moves');

// Pré-carregar imagens
const preloadImages = () => {
    const images = [
        'images/background.png',
        'images/puzzle_image1.png',
        'images/puzzle_image2.png',
        'images/puzzle_image3.png'
    ];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Inicializar modal de início
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    document.getElementById('startModal').style.display = 'flex';
    document.querySelectorAll('.image-option').forEach(option => {
        const imageSrc = option.dataset.image;
        option.style.backgroundImage = `url(images/${imageSrc})`;
    });
});

// Sidebar e eventos
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    hamburger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#sidebar') && !event.target.closest('.hamburger') && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    sidebar.classList.remove('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function selectImage(imageSrc) {
    currentImage = imageSrc;
    document.querySelectorAll('.image-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-image="${imageSrc}"]`).classList.add('active');
}

function selectDifficulty(size) {
    currentDifficulty = size;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`diff-${size}`).classList.add('active');
}

function startGame() {
    closeModal('startModal');
    closeModal('winModal');
    grid.innerHTML = '';
    pieceBankElement.innerHTML = '';
    moves = 0;
    selectedPiece = null;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    
    const tileSize = window.innerWidth <= 600 ? 240 / currentDifficulty : 320 / currentDifficulty;
    const gridSize = tileSize * currentDifficulty;
    
    grid.style.width = `${gridSize}px`;
    grid.style.height = `${gridSize}px`;
    grid.style.gridTemplateColumns = `repeat(${currentDifficulty}, 1fr)`;
    
    initializeBoard();
    initializePieceBank();
    renderBoard();
    renderPieceBank();
}

function initializeBoard() {
    board = Array(currentDifficulty * currentDifficulty).fill(null); // Grid vazio
    console.log('Tabuleiro inicializado:', board); // Debug
}

function initializePieceBank() {
    pieceBank = [];
    const totalTiles = currentDifficulty * currentDifficulty;
    for (let i = 1; i <= totalTiles; i++) {
        pieceBank.push(i);
    }
    // Embaralhar peças
    for (let i = pieceBank.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceBank[i], pieceBank[j]] = [pieceBank[j], pieceBank[i]];
    }
    console.log('Banca de peças inicializada:', pieceBank); // Debug
}

function renderBoard() {
    grid.innerHTML = ''; // Limpar o grid
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;

    board.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        
        if (number === null) {
            tile.classList.add('empty');
            tile.addEventListener('click', () => placePiece(index));
            tile.addEventListener('touchstart', (e) => {
                e.preventDefault();
                placePiece(index);
            });
        } else {
            const originalRow = Math.floor((number - 1) / size);
            const originalCol = (number - 1) % size;
            tile.style.backgroundImage = `url(images/${currentImage})`;
            tile.style.backgroundPosition = `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;
            tile.style.backgroundSize = `${size * 100}%`;
            tile.style.zIndex = 100 - number;
        }
        
        tile.dataset.index = index;
        tile.dataset.number = number || 0;
        grid.appendChild(tile);
    });
    console.log('Tabuleiro renderizado:', board); // Debug
}

function renderPieceBank() {
    pieceBankElement.innerHTML = ''; // Limpar a banca
    const size = currentDifficulty;
    const tileSize = window.innerWidth <= 600 ? 240 / size : 320 / size;

    pieceBank.forEach(number => {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'bank-tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        
        const originalRow = Math.floor((number - 1) / size);
        const originalCol = (number - 1) % size;
        tile.style.backgroundImage = `url(images/${currentImage})`;
        tile.style.backgroundPosition = `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;
        tile.style.backgroundSize = `${size * 100}%`;
        tile.style.zIndex = 100 - number;
        
        tile.dataset.number = number;
        tile.addEventListener('click', () => selectPiece(number));
        tile.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectPiece(number);
        });
        
        pieceBankElement.appendChild(tile);
    });
    console.log('Banca renderizada:', pieceBank); // Debug
}

function selectPiece(number) {
    selectedPiece = number;
    document.querySelectorAll('.bank-tile').forEach(tile => {
        tile.style.border = tile.dataset.number == number ? '2px solid #4db6ac' : 'none';
    });
    console.log('Peça selecionada:', number); // Debug
}

function placePiece(index) {
    if (selectedPiece === null || board[index] !== null) return;
    
    board[index] = selectedPiece;
    pieceBank = pieceBank.filter(num => num !== selectedPiece);
    moves++;
    movesDisplay.textContent = `Jogadas: ${moves}`;
    console.log('Peça posicionada:', selectedPiece, 'no índice', index); // Debug
    console.log('Estado atual - Board:', board, 'PieceBank:', pieceBank); // Debug mais detalhado
    
    selectedPiece = null;
    document.querySelectorAll('.bank-tile').forEach(tile => tile.style.border = 'none');
    
    renderBoard();
    renderPieceBank();
    checkWin();
}

function checkWin() {
    const size = currentDifficulty;
    const totalTiles = size * size;
    const winningBoard = [];
    for (let i = 1; i <= totalTiles; i++) {
        winningBoard.push(i);
    }
    
    // Verifica se o grid tá completamente preenchido e na ordem correta
    const isComplete = board.every(val => val !== null);
    const isCorrect = board.every((val, idx) => val === winningBoard[idx]);
    
    if (isComplete && isCorrect) {
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('winModal').style.display = 'flex';
        console.log('Vitória detectada:', board); // Debug
    } else {
        console.log('Ainda não venceu - Completo:', isComplete, 'Correto:', isCorrect); // Debug
    }
}