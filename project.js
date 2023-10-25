function extractMoves(pgn) {
    const lines = pgn.trim().split('\n');
    const movesLine = lines.filter(line => line.trim() !== '' && !line.startsWith('[')).pop();
    return movesLine;
}

loadState()

function loadState(){
    $.get('https://api.chess.com/pub/player/erik/games/2009/10/', function(data){
    const pgn = data.games[0].pgn;
    const moves = extractMoves(pgn);
    console.log(moves); // This will log only the moves.
    // chess.js load state and PGN notation conversion to FEN
    let gameState = new Chess()
    gameState.load_pgn(moves)
    let fen = gameState.fen()
    let board1 = ChessBoard('board1', fen)

    
}, 'json').fail(function(error) {
    console.error("Request failed:", error);
});
}



// $.get('https://api.chess.com/pub/player/erik/games/2009/10/', function(data){
//     const pgn = data.games[0].pgn;
//     const moves = extractMoves(pgn);
//     console.log(moves); // This will log only the moves.
//     // chess.js load state and PGN notation conversion to FEN
//     let gameState = new Chess()
//     gameState.load_pgn(moves)
//     let fen = gameState.fen()
//     let board1 = chessBoard('board1', fen)

    
// }, 'json').fail(function(error) {
//     console.error("Request failed:", error);
// });


// let config = {
//     position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'
// }

// var chess = new Chess(); // Create a new instance of the chess.js game object
// chess.load_pgn('1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. Nf3 Bg4 7. Bc4 b5 8. Bb3 a5 9. a3 Nbd7 10. Ng5 O-O 11. h3 Bh5 12. g4 1-0');

// var fen = chess.fen(); // Get the FEN string of the current position


// var board1 = Chessboard('board1', fen)



// $.get('https://api.chess.com/pub/titled/GM', function(data){
//     for (let i = 0; i < data.players.length; i++){
//         if (data.players[i].includes('hikaru')){
//             console.log(data.players[i]);
//         }
//     }
// }, 'json').fail(function(error) {
//     console.error("Request failed:", error);
// });

// https://api.chess.com/pub/titled/GM