



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

// Imported functionality
var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    onChange: onChange
    // onDragStart: onDragStart
}

let gameState = new Chess()
const board = ChessBoard('board1', config)
let moveOrder = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']
let moveOrderIndex = 0;


// function onDragStart (source, piece, position, orientation) {
//     gameState.fen()
//     console.log(config.position)
//     updateBoard()
// }

function onChange (oldPos, newPos) {
  // make Chess.js current FEN equal to Chessboard.js FEN
  gameState.fen = Chessboard.objToFen(newPos)
  // push FEN to moveOrder array
  moveOrder.push(gameState.fen)
  moveOrderIndex++
}


$(document).ready(function() {
    loadEventListeners()
});

function loadEventListeners(){
const $input = $('input');
const $submit = $('#submit');
const $archiveList = $("#archiveList");
const $gameList = $("#gameList");
const $prevBtn = $("#prevBtn");
const $nextBtn = $("#nextBtn");
const $newGame = $("#newGame");
    $submit.on('click', getArchive)
   
    $archiveList.on('click', '.date-item', function() {
        const dateItem = $(this).text();
        getGameList(dateItem);
    });

    $gameList.on('click','.game-item',loadGame)
    $prevBtn.on('click',goBack)
    $nextBtn.on('click',goForward)
    $newGame.on('click', newGame)


}

function goBack() {
    moveOrderIndex--
    let prevMove = moveOrder[moveOrderIndex];
    if (prevMove.length === 0){
        return;
    }
    console.log(prevMove)
    config.position = (prevMove)
    Chessboard('board1',config)
}

function goForward(){
    moveOrderIndex++
    let nextMove = moveOrder[moveOrderIndex];
    if (nextMove === undefined){
        return;
    }
    config.position = (nextMove)
    Chessboard('board1',config)
}

function newGame(){
    moveOrder = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']
    moveOrderIndex = moveOrder.length-1
    config.position = 'start'
    Chessboard('board1', config)
}


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
        let extractedDate;
        let index;

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
            console.log(gameState.fen())
            gameState.load_pgn(moves)
            // Export final FEN state to chessboard.js
            let gameMoves = movesToFenArray(parsePGNIntoMoves(gameState.pgn()))
            gameMoves.forEach(fen => {
                moveOrder.push(fen)
            })

            config.position = moveOrder[0]
            ChessBoard('board1', config)
            // Pass
            
              
           
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


console.log(moveOrder)

function parsePGNIntoMoves(pgn) {
    // Splitting the string by spaces and filtering out empty strings
    let tokens = pgn.split(/\s+/).filter(token => token.trim() !== '');

    let moves = [];

    // Looping through each token
    tokens.forEach(token => {
        // Filtering out move numbers (e.g., '1.', '2.', etc.)
        if (!token.includes('.')) {
            moves.push(token);
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
        $archiveName.append(`<h3>User: ${userName} games of ${date}</h3>`);
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
    e.preventDefault();
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
        $archiveName.append(`<h3>User: ${userName}<h3>`)
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
