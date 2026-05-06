const generateCardValues = (pairCount) => {
    const values = Array.from({ length: pairCount }, (_, i) => i + 1);
    return [...values, ...values];
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

let state = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    timerId: null,
    timeRemaining: 0,
    isPlaying: false,
    mode: 1,
    totalRounds: 1,
    currentRound: 1,
    players: [],
    currentPlayerIndex: 0,
    roundStats: []
};

const board = document.getElementById('board');
const timerEl = document.getElementById('timer');
const playerStatsEl = document.getElementById('player-stats');
const roundInfoEl = document.getElementById('round-info');
const resultsModal = document.getElementById('results-modal');
const resultsBody = document.getElementById('results-body');

const updatePlayerStatsUI = () => {
    playerStatsEl.innerHTML = state.players.map((p, i) => 
        `<span class="${i === state.currentPlayerIndex ? 'active-player' : ''}">
            ${p.name}: ${p.score} пар (Ходи: ${p.moves})
        </span>`
    ).join('');
};

const renderBoard = (cardsArray, columns) => {
    board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;
    board.innerHTML = cardsArray.map((val, index) => `
        <div class="card" data-index="${index}" data-value="${val}">
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${val}</div>
            </div>
        </div>
    `).join('');
};

const recordRoundStats = () => {
    const timeSpent = parseInt(document.getElementById('difficulty').value) * 60 - state.timeRemaining;
    state.roundStats.push({
        round: state.currentRound,
        players: JSON.parse(JSON.stringify(state.players)),
        timeSpent: formatTime(timeSpent)
    });
};

const showResults = () => {
    let html = `<table><tr><th>Раунд</th><th>Час</th>`;
    state.players.forEach(p => html += `<th>${p.name} (Пари / Ходи)</th>`);
    html += `</tr>`;
    
    state.roundStats.forEach(stat => {
        html += `<tr><td>${stat.round}</td><td>${stat.timeSpent}</td>`;
        stat.players.forEach(p => {
            html += `<td>${p.score} / ${p.moves}</td>`;
        });
        html += `</tr>`;
    });
    html += `</table>`;

    if (state.mode === 2) {
        const totalP1 = state.roundStats.reduce((sum, r) => sum + r.players[0].score, 0);
        const totalP2 = state.roundStats.reduce((sum, r) => sum + r.players[1].score, 0);
        let winner = 'Нічия';
        if (totalP1 > totalP2) winner = state.players[0].name;
        else if (totalP2 > totalP1) winner = state.players[1].name;
        html += `<h3>Переможець: ${winner}</h3>`;
    }

    resultsBody.innerHTML = html;
    resultsModal.classList.remove('hidden');
};

const endRound = () => {
    clearInterval(state.timerId);
    state.isPlaying = false;
    recordRoundStats();

    if (state.currentRound < state.totalRounds) {
        state.currentRound++;
        setTimeout(startRound, 1500);
    } else {
        showResults();
    }
};

const switchTurn = () => {
    if (state.mode === 2) {
        state.currentPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
        updatePlayerStatsUI();
    }
};

const checkMatch = () => {
    const [card1, card2] = state.flippedCards;
    const match = card1.dataset.value === card2.dataset.value;
    const currentPlayer = state.players[state.currentPlayerIndex];
    
    currentPlayer.moves++;

    if (match) {
        currentPlayer.score++;
        state.matchedPairs++;
        state.flippedCards = [];
        updatePlayerStatsUI();
        
        if (state.matchedPairs === state.cards.length / 2) {
            endRound();
        }
    } else {
        state.isPlaying = false;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            state.flippedCards = [];
            switchTurn();
            state.isPlaying = true;
        }, 1000);
        updatePlayerStatsUI();
    }
};

board.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl || !state.isPlaying || cardEl.classList.contains('flipped')) return;
    
    cardEl.classList.add('flipped');
    state.flippedCards.push(cardEl);
    
    if (state.flippedCards.length === 2) {
        checkMatch();
    }
});

const startTimer = () => {
    clearInterval(state.timerId);
    timerEl.textContent = formatTime(state.timeRemaining);
    state.timerId = setInterval(() => {
        state.timeRemaining--;
        timerEl.textContent = formatTime(state.timeRemaining);
        if (state.timeRemaining <= 0) {
            endRound();
        }
    }, 1000);
};

const startRound = () => {
    const size = parseInt(document.getElementById('grid-size').value);
    const difficultyMinutes = parseInt(document.getElementById('difficulty').value);
    
    state.matchedPairs = 0;
    state.flippedCards = [];
    state.timeRemaining = difficultyMinutes * 60;
    state.isPlaying = true;
    state.cards = shuffleArray(generateCardValues(size / 2));
    state.players.forEach(p => { p.score = 0; p.moves = 0; });
    
    roundInfoEl.textContent = `Раунд: ${state.currentRound} / ${state.totalRounds}`;
    updatePlayerStatsUI();
    renderBoard(state.cards, size === 16 ? 4 : (size === 20 ? 5 : 6));
    startTimer();
};

const startGame = () => {
    state.mode = parseInt(document.getElementById('game-mode').value);
    state.totalRounds = parseInt(document.getElementById('rounds').value) || 1;
    state.currentRound = 1;
    state.roundStats = [];
    state.currentPlayerIndex = 0;

    const p1Name = document.getElementById('p1-name').value || 'Гравець 1';
    const p2Name = document.getElementById('p2-name').value || 'Гравець 2';

    state.players = [{ name: p1Name, score: 0, moves: 0 }];
    if (state.mode === 2) {
        state.players.push({ name: p2Name, score: 0, moves: 0 });
    }

    resultsModal.classList.add('hidden');
    startRound();
};

document.getElementById('btn-start').addEventListener('click', startGame);

document.getElementById('btn-reset-settings').addEventListener('click', () => {
    document.getElementById('grid-size').value = "16";
    document.getElementById('difficulty').value = "3";
    document.getElementById('game-mode').value = "1";
    document.getElementById('rounds').value = "1";
    document.getElementById('p2-name').style.display = 'none';
});

document.getElementById('game-mode').addEventListener('change', (e) => {
    document.getElementById('p2-name').style.display = e.target.value === "2" ? 'inline-block' : 'none';
});

document.getElementById('btn-close-modal').addEventListener('click', () => {
    resultsModal.classList.add('hidden');
});