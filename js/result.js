const gameData =
    JSON.parse(localStorage.getItem("cardGame"));

if (!gameData) {

    window.location.href = "index.html";

}


const winnerElement =
    document.getElementById("winner");

const finalScores =
    document.getElementById("finalScores");


const sortedPlayers =
    [...gameData.totals].sort(function (a, b) {

        return a.total - b.total;

    });


const winner = sortedPlayers[0];


winnerElement.textContent =
    "🥇 Winner: " + winner.name;


sortedPlayers.forEach(function (player, index) {

    const div = document.createElement("div");

    div.className = "leaderboard-item";

    div.innerHTML = `
        <strong>
            ${index + 1}. ${player.name}
        </strong>

        <span>
            ${player.total} points
        </span>
    `;

    finalScores.appendChild(div);

});


function newGame() {

    localStorage.removeItem("cardGame");

    window.location.href = "setup.html";

}
