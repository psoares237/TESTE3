// Estrutura do grid com as palavras
const crosswordData = [
    { word: "CONTADOR", row: 0, col: 2, direction: "across", clue: "Profissional responsável por organizar e analisar as finanças de uma empresa." },
    { word: "CAIXA", row: 0, col: 2, direction: "down", clue: "Local onde são registrados os recebimentos e pagamentos da empresa." },
    { word: "NOTAFISCAL", row: 0, col: 4, direction: "down", clue: "Documento que comprova uma transação comercial." },
    { word: "DEBITO", row: 0, col: 7, direction: "down", clue: "Registro de entrada de recursos na contabilidade." },
    { word: "JUROS", row: 6, col: 0, direction: "across", clue: "Custo do dinheiro emprestado ou ganho em investimentos." },
    { word: "LUCRO", row: 9, col: 4, direction: "across", clue: "Diferença positiva entre receitas e despesas de uma empresa." },
    { word: "TRIBUTO", row: 8, col: 7, direction: "down", clue: "Encargo financeiro que deve ser pago ao governo." }
];

// Dimensões do grid
const numRows = 15;
const numCols = 10;
const crosswordGrid = [];

// Inicializa o grid vazio com objetos
for (let i = 0; i < numRows; i++) {
    crosswordGrid[i] = [];
    for (let j = 0; j < numCols; j++) {
        crosswordGrid[i][j] = {
            letter: '',
            isBlank: true,
            clueIndex: null,
            direction: null // Adicionado para armazenar a direção da palavra
        };
    }
}

// Preenche o grid com as palavras e associa com as perguntas
crosswordData.forEach((entry, index) => {
    let row = entry.row;
    let col = entry.col;

    for (let i = 0; i < entry.word.length; i++) {
        if (entry.direction === "across") {
            crosswordGrid[row][col + i].letter = entry.word[i];
            crosswordGrid[row][col + i].isBlank = false;
            crosswordGrid[row][col + i].direction = "across";
            if (i === 0) { // Número da pista apenas na primeira letra
                crosswordGrid[row][col + i].clueIndex = index + 1;
                if (index === 0) { // Caso especial para 1/2
                    crosswordGrid[row][col + i].specialClue = "1/2";
                }
            }
        } else if (entry.direction === "down") {
            crosswordGrid[row + i][col].letter = entry.word[i];
            crosswordGrid[row + i][col].isBlank = false;
            crosswordGrid[row + i][col].direction = "down";
            if (i === 0) { // Número da pista apenas na primeira letra
                crosswordGrid[row + i][col].clueIndex = index + 1;
                if (index === 1) { // Caso especial para 1/2
                    crosswordGrid[row + i][col].specialClue = "1/2";
                }
            }
        }
    }
});

// Renderiza o grid
const crosswordDiv = document.getElementById('crossword');
const table = document.createElement('table');

for (let i = 0; i < numRows; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < numCols; j++) {
        const td = document.createElement('td');
        td.className = 'cell';
        if (!crosswordGrid[i][j].isBlank) {
            const input = document.createElement('input');
            input.maxLength = 1;
            input.setAttribute('data-row', i);
            input.setAttribute('data-col', j);
            input.setAttribute('data-direction', crosswordGrid[i][j].direction); // Armazenar a direção no input
            input.addEventListener('input', handleInput);
            td.appendChild(input);

            // Adiciona "1/2" se for o caso especial das pistas 1 e 2
            if (crosswordGrid[i][j].specialClue === "1/2") {
                td.classList.add('start');
            } else if (crosswordGrid[i][j].clueIndex) {
                td.classList.add('number');
                td.setAttribute('data-number', crosswordGrid[i][j].clueIndex);
            }
        } else {
            td.classList.add('black');
        }
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
crosswordDiv.appendChild(table);

// Função para lidar com a entrada de letras e verificar automaticamente
function handleInput(event) {
    const input = event.target;
    const row = parseInt(input.getAttribute('data-row'));
    const col = parseInt(input.getAttribute('data-col'));

    // Verificar se a letra está correta
    const expectedLetter = crosswordGrid[row][col].letter.toUpperCase();
    if (input.value.toUpperCase() === expectedLetter) {
        input.style.color = '#023618'; // Cor verde escuro para letras corretas
    } else {
        input.style.color = '#685044'; // Cor marrom para letras incorretas
    }

    // Verificar palavra completa
    checkWord(row, col, crosswordGrid[row][col].direction);
}

// Função para verificar automaticamente cada palavra enquanto é preenchida
function checkWord(row, col, direction) {
    let wordCorrect = true;
    let word = "";
    if (direction === "across") {
        for (let i = col; i < numCols; i++) {
            if (crosswordGrid[row][i].isBlank) break;
            word += crosswordGrid[row][i].letter;
            const input = document.querySelector(`input[data-row="${row}"][data-col="${i}"]`);
            if (input.value.toUpperCase() !== crosswordGrid[row][i].letter.toUpperCase()) {
                wordCorrect = false;
            }
        }
    } else if (direction === "down") {
        for (let j = row; j < numRows; j++) {
            if (crosswordGrid[j][col].isBlank) break;
            word += crosswordGrid[j][col].letter;
            const input = document.querySelector(`input[data-row="${j}"][data-col="${col}"]`);
            if (input.value.toUpperCase() !== crosswordGrid[j][col].letter.toUpperCase()) {
                wordCorrect = false;
            }
        }
    }

    if (wordCorrect) {
        // Todas as letras estão corretas, mudar a cor para verde escuro
        if (direction === "across") {
            for (let i = col; i < col + word.length; i++) {
                const input = document.querySelector(`input[data-row="${row}"][data-col="${i}"]`);
                input.style.backgroundColor = '#b3ffb3';
            }
        } else if (direction === "down") {
            for (let j = row; j < row + word.length; j++) {
                const input = document.querySelector(`input[data-row="${j}"][data-col="${col}"]`);
                input.style.backgroundColor = '#b3ffb3';
            }
        }

        // Exibir "Parabéns!" se a palavra estiver correta
        document.getElementById('celebration').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('celebration').style.display = 'none';
        }, 1500); // Mostra o texto por 1,5 segundos
    } else {
        // Se houver letras incorretas, mudar a cor para marrom claro
        if (direction === "across") {
            for (let i = col; i < col + word.length; i++) {
                const input = document.querySelector(`input[data-row="${row}"][data-col="${i}"]`);
                input.style.backgroundColor = '#ffcccb';
            }
        } else if (direction === "down") {
            for (let j = row; j < row + word.length; j++) {
                const input = document.querySelector(`input[data-row="${j}"][data-col="${col}"]`);
                input.style.backgroundColor = '#ffcccb';
            }
        }
    }
}
