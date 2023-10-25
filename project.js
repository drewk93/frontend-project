



/* 

Chess.Com API Endpoints: 

1) Looking up Archive of Games: https://api.chess.com/pub/player/{username}/games/archives
2) Looking up games by year and month: https://api.chess.com/pub/player/{username}/games/2009/10/
3) *Looking up games PGN by year and month: https://api.chess.com/pub/player/erik/games/2009/10/pgn''
  // Note that the PGN for 3) is not a JSON

TO DO 

1) Establish Methodology

2) Functionality 
    - List Archive games as a list for each user.
        Requires: input field, submit button, div to contain paragraphs with breaks.


*/




// function extractMoves(pgn) {
//     const lines = pgn.trim().split('\n');
//     const movesLine = lines.filter(line => line.trim() !== '' && !line.startsWith('[')).pop();
//     return movesLine;
// }

// loadState()

// function loadState(){
//     $.get('https://api.chess.com/pub/player/erik/games/archives', function(data){
//     console.log(data)
//     // const pgn = data.games[0].pgn;
//     // const moves = extractMoves(pgn);
//     // console.log(moves); // This will log only the moves.
//     // // chess.js load state and PGN notation conversion to FEN
//     // let gameState = new Chess()
//     // gameState.load_pgn(moves)
//     // let fen = gameState.fen()
//     // let board1 = ChessBoard('board1', fen)
    
// },'json').fail(function(error) {
//     console.error("Request failed:", error);
// });
// }

$(document).ready(function() {
    loadEventListeners()
});

function loadEventListeners(){

const $input = $('input');
const $submit = $('#submit');

    $submit.on('click', function(e){
        const inputVal = $("input[name='search']").val().trim()
        const url = `https://api.chess.com/pub/player/${inputVal}/games/archives`
        $.get(url, function(data){
            console.log(data)
        })
    })
}
