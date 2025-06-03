// Lista de jogos - Mantenha esta estrutura para adicionar novos jogos
const jogos = [
    { nome: "Jogo da Memória", pasta: "jogo-da-memoria" },
    { nome: "Quebra Cabeça", pasta: "quebra-cabeca" },
    { nome: "Damas", pasta: "damas" },
    { nome: "Forca", pasta: "forca" },
    { nome: "Jogo da Velha", pasta: "jogo-da-velha" },
    { nome: "Palavras Cruzadas", pasta: "palavras-cruzadas" },
    { nome: "Caça Palavras", pasta: "caca-palavras" },
    { nome: "Campo Minado", pasta: "campo-minado" },
    { nome: "Batalha Naval", pasta: "batalha-naval" },
    { nome: "Jogo da Cobra", pasta: "snake" },
    { nome: "Pong", pasta: "pong" },
    { nome: "Tetris", pasta: "tetris" },
    { nome: "Flappy Bird", pasta: "flappy-bird" },
    { nome: "Labirinto", pasta: "labirinto" },
    { nome: "Sudoku", pasta: "sudoku" },
    { nome: "Space Invaders", pasta: "space-invaders" },
    { nome: "Simon Says", pasta: "simon-says" },
    { nome: "Pac Man", pasta: "pac-man" },
    { nome: "Combinar 3 Emojis", pasta: "combinar-3-emojis" },
    { nome: "Arkanoid Advanced", pasta: "arkanoid-advanced" },
    { nome: "Acertei a Toupeira", pasta: "acertei-a-toupeira" },
    { nome: "2048", pasta: "2048" },
    // Adicione novos jogos aqui, por exemplo:
    // { nome: "Meu Novo Jogo", pasta: "meu-novo-jogo" },
];

// Elementos do DOM
const sidebar = document.getElementById('sidebar');
const mainContainer = document.getElementById('mainContainer');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const openGameListBtn = document.querySelector('.container .action-button'); // Botão principal na tela de boas-vindas

// Variável para rastrear o jogo atual (pode ser útil no futuro)
let currentGameId = null;

// Função para abrir/fechar a sidebar
function toggleSidebar() {
    sidebar.classList.toggle('open');
    // Adiciona/remove uma classe no body para empurrar o conteúdo principal
    // Apenas em telas maiores, para evitar cobrir o conteúdo em mobile.
    if (window.innerWidth > 768) {
        document.body.classList.toggle('sidebar-open-push');
    }
}

// Fecha a sidebar se clicar fora dela (em telas mobile/tablets onde ela sobrepõe)
document.addEventListener('click', (event) => {
    const hamburger = document.querySelector('.hamburger');
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    }
});


// Funções para controlar modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
    if (sidebar.classList.contains('open')) { // Fecha a sidebar ao abrir um modal
        toggleSidebar();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para mostrar a tela de boas-vindas
function showWelcomeScreen() {
    // Garante que os elementos da tela inicial estejam visíveis
    if (pageTitle) pageTitle.style.display = 'flex'; // 'flex' se tiver ícone
    if (pageSubtitle) pageSubtitle.style.display = 'block';
    if (openGameListBtn) openGameListBtn.style.display = 'inline-flex'; // 'inline-flex' se tiver ícone

    // Centraliza o conteúdo do container principal
    if (mainContainer) mainContainer.style.justifyContent = 'center';

    // Fecha todos os modais abertos
    closeModal('gameListModal');
    closeModal('gameSettingsModal');
    closeModal('genericEndGameModal');

    if (sidebar.classList.contains('open')) { // Fecha a sidebar se estiver aberta
       toggleSidebar();
    }
}

// Função para popular a lista de jogos no modal
function populateGameList() {
    const gameListContainer = document.getElementById('game-list-container');
    if (!gameListContainer) return;

    gameListContainer.innerHTML = ''; // Limpa a lista existente

    jogos.forEach(jogo => {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = jogo.nome;

        // Botão para jogar - redireciona para a pasta do jogo
        const playLink = document.createElement('a');
        playLink.href = `Jogos/${jogo.pasta}/index.html`; // Caminho para o jogo
        playLink.className = 'action-button play-button'; // Estilo de botão
        playLink.innerHTML = `<i class="fas fa-play"></i> Jogar`;
        // playLink.onclick = () => launchGame(jogo.pasta, jogo.nome); // Alternativa se precisar de mais lógica antes de redirecionar

        gameItem.appendChild(nameSpan);
        gameItem.appendChild(playLink);
        gameListContainer.appendChild(gameItem);
    });
}

// Função para "lançar" o jogo (atualmente apenas redireciona)
// Se precisar de mais lógica (como configurações), pode expandir aqui.
function launchGame(gameFolder, gameName) {
    console.log(`Redirecionando para o jogo: ${gameName} na pasta: ${gameFolder}`);
    // Fecha modais antes de redirecionar
    closeModal('gameListModal');
    closeModal('gameSettingsModal');
    
    window.location.href = `Jogos/${gameFolder}/index.html`;
}


// Funções para modais de Configurações e Fim de Jogo (mantidas para uso futuro)
function showGameSettings(gameId, gameName) {
    currentGameId = gameId; // Guarda o ID do jogo atual
    const settingsModalTitle = document.getElementById('settingsModalTitle');
    const settingsModalContent = document.getElementById('settingsModalContent');
    if(settingsModalTitle) settingsModalTitle.textContent = `Opções para ${gameName}`;
    if(settingsModalContent) {
        settingsModalContent.innerHTML = `<p>Configurações para ${gameName} aparecerão aqui.</p>
        <button class="action-button" onclick="launchGameWithSettings('${gameId}', '${gameName}', {mode: 'pvp'})">Duelo (PvP)</button>
        <button class="action-button" onclick="launchGameWithSettings('${gameId}', '${gameName}', {mode: 'pve', difficulty: 'easy'})">Contra IA (Fácil)</button>`;
        // Adicione mais opções conforme necessário
    }
    openModal('gameSettingsModal');
}

function launchGameWithSettings(gameId, gameName, options = {}) {
    console.log(`Iniciando ${gameName} (ID: ${gameId}) com opções:`, options);
    // Aqui você decidiria se redireciona com parâmetros ou carrega o jogo de forma diferente
    // Por enquanto, vamos manter o redirecionamento simples:
    launchGame(jogos.find(j => j.nome === gameName)?.pasta, gameName); // Precisa encontrar a pasta
}


function closeSettingsModal() {
    closeModal('gameSettingsModal');
    // Opcionalmente, reabrir a lista de jogos se veio dela
    // openModal('gameListModal');
}

function showEndGameModal(title, message, showRestartButton = false) {
    const endGameTitle = document.getElementById('endGameModalTitle');
    const endGameMessage = document.getElementById('endGameModalMessage');
    const restartBtn = document.getElementById('restartCurrentGameBtn');

    if(endGameTitle) endGameTitle.textContent = title;
    if(endGameMessage) endGameMessage.textContent = message;

    if (restartBtn) {
        if (showRestartButton && currentGameId) {
            restartBtn.style.display = 'inline-flex';
            // A ação de restartBtn precisaria ser configurada para o jogo específico
            // restartBtn.onclick = () => { /* lógica para reiniciar o currentGameId */ };
        } else {
            restartBtn.style.display = 'none';
        }
    }
    openModal('genericEndGameModal');
}

// Função para atualizar o ano no rodapé da sidebar
function updateCopyrightYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    populateGameList(); // Preenche a lista de jogos no modal
    showWelcomeScreen(); // Mostra a tela inicial ao carregar
    updateCopyrightYear(); // Atualiza o ano do copyright
});

