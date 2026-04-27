function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;
    
    const setCell = (row, column, player) => {
        if (board[row][column].getValue() !== '') return;
        board[row][column].setValue(player);
    };

    const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
    };

    return {
        getBoard,
        setCell,
        printBoard
    };
}

function cell() {
    let value = '';

    const getValue = () => value;
    
    const setValue = (player) => {
        value = player;
    };

    return {
        getValue,
        setValue
    };
}

/* 
The game controller is responsible for managing the game state, including the players, the game board, and the game logic. 
It handles player turns, checks for wins or draws, and updates the game state accordingly. 
The screen controller will interact with the game controller to update the user interface based on the current game state.
additional function for customizing player names and symbols could be added if needed be.
*/
function gameController(
    playerOneName = 'Player 1',
    playerTwoName = 'Player 2',
    playerOneSymbol = 'X',
    playerTwoSymbol = 'O'
) {
    const board = gameBoard();
    const players = [
        { name: playerOneName, symbol: playerOneSymbol },
        { name: playerTwoName, symbol: playerTwoSymbol }
    ];
    let activePlayer = players[0];
    let gameOver = false;

    const getCurrentPlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkWinner = () => {
        const b = board.getBoard().map(row => row.map(cell => cell.getValue()));
        const lines = [
            // Rows
            [b[0][0], b[0][1], b[0][2]],
            [b[1][0], b[1][1], b[1][2]],
            [b[2][0], b[2][1], b[2][2]],
            // Columns
            [b[0][0], b[1][0], b[2][0]],
            [b[0][1], b[1][1], b[2][1]],
            [b[0][2], b[1][2], b[2][2]],
            // Diagonals
            [b[0][0], b[1][1], b[2][2]],
            [b[0][2], b[1][1], b[2][0]],
        ];
        for (const line of lines) {
            if (line[0] && line.every(cell => cell === line[0])) return line[0];
        }
        return null;
    };

    const checkDraw = () => {
        return board.getBoard().every(row => row.every(cell => cell.getValue() !== ''));
    };

    const makeMove = (row, column) => {
        if (gameOver) return { status: 'over' };

        const cell = board.getBoard()[row][column];
        if (cell.getValue() !== '') {
            return { status: 'taken' };
        }

        board.setCell(row, column, getCurrentPlayer().symbol);

        // Check for winner or draw after the move
        const winner = checkWinner();
        if (winner) {
            console.log(`${getCurrentPlayer().name} wins!`);
            gameOver = true;
            return { status: 'win', player: getCurrentPlayer() };
        }

        if (checkDraw()) {
            console.log("It's a draw!");
            gameOver = true;
            return { status: 'draw' };
        }

        switchPlayer();
        return { status: 'continue' };
    };

    console.log(`${getCurrentPlayer().name}'s turn.`);

    return { getBoard: board.getBoard, makeMove, getCurrentPlayer };
}


function ScreenController() {
  let game = gameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resetButton = document.querySelector(".reset");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getCurrentPlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        const result = game.makeMove(selectedRow, selectedColumn);

        if (result.status === 'win') {
            updateScreen();
            playerTurnDiv.textContent = `${result.player.name} wins!`;
            boardDiv.removeEventListener("click", clickHandlerBoard); // stop further clicks
        } else if (result.status === 'draw') {
            updateScreen();
            playerTurnDiv.textContent = "It's a draw!";
            boardDiv.removeEventListener("click", clickHandlerBoard);
        } else if (result.status === 'taken') {
            playerTurnDiv.textContent = 'Cell already taken! Choose another.';
        } else {
            updateScreen(); // normal continue
        }
    }
  boardDiv.addEventListener("click", clickHandlerBoard);

  resetButton.addEventListener("click", () => {
        game = gameController();         // create a fresh game
        boardDiv.addEventListener("click", clickHandlerBoard); // re-enable clicks
        updateScreen();                  // re-render the empty board
    });

  // Initial render
  updateScreen();

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();