function extractMoves(pgn) {
    const lines = pgn.trim().split('\n');
    const movesLine = lines.filter(line => line.trim() !== '' && !line.startsWith('[')).pop();
    return movesLine;
}

$.get('https://api.chess.com/pub/player/erik/games/2009/10/', function(data){
    const pgn = data.games[0].pgn;
    const moves = extractMoves(pgn);
    console.log(moves); // This will log only the moves.
}, 'json').fail(function(error) {
    console.error("Request failed:", error);
});






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