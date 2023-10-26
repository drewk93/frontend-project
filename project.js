



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
    position: 'start',
    onChange: onChange
    // onDragStart: onDragStart
}

let gameState = new Chess()
const board = ChessBoard('board1', config)
let loadedPGN = {}


// function onDragStart (source, piece, position, orientation) {
//     gameState.fen()
//     console.log(config.position)
//     updateBoard()
// }

function onChange (oldPos, newPos) {
  console.log('Position changed:')
  console.log('Old position: ' + Chessboard.objToFen(oldPos))
  console.log('New position: ' + Chessboard.objToFen(newPos))
  gameState.fen = Chessboard.objToFen(newPos) 
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
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

    $submit.on('click', getArchive)
   
    $archiveList.on('click', '.date-item', function() {
        const dateItem = $(this).text();
        getGameList(dateItem);
    });

    $gameList.on('click','.game-item',loadGame)
    $prevBtn.on('click',goBack)

}

function goBack() {
    gameState.undo();
    updateBoard()
}

function updateBoard() {
    board.position(gameState.fen());
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
            gameState.load_pgn(moves)
            // Export final FEN state to chessboard.js
            let fen = gameState.fen()
            config.position = fen
            ChessBoard('board1', config)
            // Pass
            console.log(gameState.pgn())
        })
        }            
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
