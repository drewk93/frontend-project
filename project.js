/* 
Chess.Com API Endpoints: 

?) Looking up games by year and month: https://api.chess.com/pub/player/{username}/games/

1) Looking up Archive of Games: https://api.chess.com/pub/player/{username}/games/archives CHECK
2) *Looking up games PGN by year and month: https://api.chess.com/pub/player/erik/games/2009/10/pgn''
  // Note that the PGN for 3) is not a JSON

TO DO 

1) Establish Methodology

2) Functionality 
    - List Archive games as a list for each user.
        Requires: input field, submit button, div to contain paragraphs with breaks.
    - Allow user to drag pieces and cycle through moves of the game.
*/

// SETTING VARIABLES TO PASS FUNCTION OUTPUT TO

var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    onChange: onChange,
    // onDragStart: onDragStart
}

let gameState = new Chess()
const board = ChessBoard('board1', config)
let moveOrder = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']
let moveNotation = []
let moveOrderIndex = 0;

// SETTING BOARD MOVE FUNCTIONALITY

function onChange (oldPos, newPos) {
  // make Chess.js current FEN equal to Chessboard.js FEN
  gameState.fen = Chessboard.objToFen(newPos)
  // push FEN to moveOrder array
  moveOrder.push(gameState.fen)
  moveOrderIndex++
}

function goBack() {
    $notationActual = $('#notationActual')
    moveOrderIndex--
    let prevMove = moveOrder[moveOrderIndex];
    if (prevMove.length === 0){
        return;
    }
    if(moveNotation.length !== 0){
    $notationActual[0].lastElementChild.remove()
    }
   
    config.position = prevMove;
    Chessboard('board1',config)
}

function goForward(){
    $notationActual = $('#notationActual');
    moveOrderIndex++;
    let nextMove = moveOrder[moveOrderIndex];
    if (nextMove === undefined){
        return;
    }
    if(moveNotation[moveOrderIndex] !== moveOrder.length){
        $notationActual.append(`<b>${moveOrderIndex}. ${moveNotation[moveOrderIndex]}</b> `);
    }
    config.position = nextMove;
    Chessboard('board1', config);
}

function newGame(){
    $notationActual = $('#notationActual')
    moveOrder = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']
    moveOrderIndex = moveOrder.length-1
    while (moveNotation.length > 0){
        $notationActual[0].lastElementChild.remove()
        moveNotation.pop()
    }
    config.position = 'start'
    Chessboard('board1', config)
}

function firstMove(){
    while (moveOrderIndex > 0){
        goBack()
    }
}

function lastMove(){
    while (moveOrderIndex < moveOrder.length-1){
        goForward()
    }
}


$(document).ready(function() {
    loadEventListeners()
});

// LOAD EVENT LISTENERS FOR HTML ELEMENTS

function loadEventListeners(){
const $input = $('input');
const $submit = $('#submit');
const $archiveList = $("#archiveList");
const $gameList = $("#gameList");
const $prevBtn = $("#prevBtn");
const $nextBtn = $("#nextBtn");
const $newGame = $("#newGame");
const $firstMove = $("#firstMove");
const $lastMove = $("#lastMove");
const $flipBoard = $("#flipBoard")
    $submit.on('click', getArchive)
    $input.on('keydown', function(e){
        if(e.which === 13){
            e.preventDefault();
            getArchive()
        }
    })
    $archiveList.on('click', '.date-item', function() {
        const dateItem = $(this).text();
        getGameList(dateItem);
    });

    $gameList.on('click','.game-item',loadGame)
    $prevBtn.on('click',goBack)
    $nextBtn.on('click',goForward)
    $newGame.on('click', newGame)
    $firstMove.on('click', firstMove)
    $lastMove.on('click',lastMove)
    // $flipBoard.on('click', flipBoard)
}

// CURRENTLY DEBUGGING AS OF COMMIT 12
// function flipBoard(){
//     if (config.orientation === 'white'){
//         config.orientation = 'black'
//     } 
    
//     if (config.orientation === 'black'){
//         config.orientation = 'white'
//     }
//     Chessboard('board1', config);
// }


// CHESS.COM ARCHIVE IMPORT FUNCTIONALITY


// Function for parsing over entire PGN index and extracting initial move index.
function extractMoves(pgn) {
    const lines = pgn.trim().split('\n');
    const movesLine = lines.filter(line => line.trim() !== '' && !line.startsWith('[')).pop();
    return movesLine;
}



function loadGame(){    
        
        const userName = $("input[name='search']").val().trim();
        const gameItem = $(this).text()
        const regex = /(\d+)\.\s(\d{4}\.\d{2})/;
        const match = gameItem.match(regex);
        moveNotation = [];

        if (match) {
            const index = parseInt(match[1]);
            const extractedDate = match[2].replace(".", "/");
            const url = `https://api.chess.com/pub/player/${userName}/games/${extractedDate}/`;

        $.get(url, function(data) {
            // grab the PGN from the Chess game
            const pgn = data.games[index].pgn
            // extract the move order PGN
            const moves = extractMoves(pgn)
            // initialize gameState and pass 'moves' in.
            gameState.load_pgn(moves)
            // Export final FEN state to chessboard.js
            console.log(gameState.pgn())
            let gameMoves = movesToFenArray(parsePGNIntoMoves(gameState.pgn()))
            gameMoves.forEach(fen => {
                moveOrder.push(fen)
            })
            // Set board position to initial starting position
            config.position = moveOrder[0]
            ChessBoard('board1', config)   
            alert("Game Loaded. Enjoy!")  
        })
        }            
}


function movesToFenArray(moves) {
    var game = new Chess();
    var fens = [];


    for (var move of moves) {
        game.move(move);
        fens.push(game.fen());
    }

    return fens;
}

function parsePGNIntoMoves(pgn) {
    // Splitting the string by spaces and filtering out empty strings
    let tokens = pgn.split(/\s+/).filter(token => token.trim() !== '');

    let moves = [];

    // Looping through each token
    tokens.forEach(token => {
        // Filtering out move numbers (e.g., '1.', '2.', etc.)
        if (!token.includes('.')) {
            moves.push(token);
            moveNotation.push(token)
            
        }
    });

    return moves;
}


function getGameList(date) {
    const userName = $("input[name='search']").val().trim();
    const $archiveName = $('#archiveName');
    const $gameList = $('#gameList');
    // Clear previous
    $archiveName.empty();
    $gameList.empty();
    const url = `https://api.chess.com/pub/player/${userName}/games/${date}/`;
    $.get(url, function(data) {
       data.games.forEach((game, index) => {
            const dateRegex = /\[Date "(\d{4}\.\d{2}\.\d{2})"\]/;
            const match = game.pgn.match(dateRegex);
            let extractedDate;
            if (match) {
                extractedDate = match[1];
                $gameList.append(`<li class='game-item'>${index + 1}. ${extractedDate}</li>`);
            } else {
                $gameList.append(`<p>Date not found in PGN!</p>`);
            }
        });
        console.log(data.games);
    });
}

function getArchive(e){
    const userName = $("input[name='search']").val().trim()
    const $archiveName = $('#archiveName')
    const $archiveList = $("#archiveList")

    //Clearing previous
    $archiveName.empty();
    $archiveList.empty();
    //Check if input is empty
    if (!userName){
        alert("Please enter a username before hitting submit");
        return;
    }
    const url = `https://api.chess.com/pub/player/${userName}/games/archives`
    $.get(url, function(data){
        data.archives.forEach((item) => {
        let parts = item.split("games/")
                if (parts.length > 1){
                    const dates = parts[1];
                    $archiveList.append(`<li class='date-item'>${dates}</li>`)
                }
            }
        )
    }).fail(function(){
    alert("Failed to retrieve data. Please try again.");
    });
}
