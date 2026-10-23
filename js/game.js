// ========================================
// GET GAME DATA
// ========================================

let gameData = JSON.parse(
    localStorage.getItem("cardGame")
);

if (!gameData) {
    window.location.href = "index.html";
}


// ========================================
// HTML ELEMENTS
// ========================================

const gameTitle =
    document.getElementById("gameTitle");

const maxPointsElement =
    document.getElementById("maxPoints");

const roundNumber =
    document.getElementById("roundNumber");

const scoreInputs =
    document.getElementById("scoreInputs");

const leaderboard =
    document.getElementById("leaderboard");

const roundHistory =
    document.getElementById("roundHistory");

const addRoundBtn =
    document.getElementById("addRoundBtn");

const addPlayerBtn =
    document.getElementById("addPlayerBtn");

const newPlayerName =
    document.getElementById("newPlayerName");

const newPlayerScore =
    document.getElementById("newPlayerScore");


// ========================================
// GAME INFORMATION
// ========================================

gameTitle.textContent =
    gameData.gameName;

maxPointsElement.textContent =
    gameData.maxPoints;

roundNumber.textContent =
    gameData.rounds.length + 1;


// ========================================
// SAVE GAME
// ========================================

function saveGame() {

    localStorage.setItem(
        "cardGame",
        JSON.stringify(gameData)
    );
}


// ========================================
// CREATE SCORE INPUTS
// ========================================

function createScoreInputs() {

    scoreInputs.innerHTML = "";


    gameData.players.forEach(
        function (player, index) {

            const playerData =
                gameData.totals[index];


            const div =
                document.createElement("div");

            div.className =
                "score-player";


            if (playerData.locked) {

                div.innerHTML = `

                    <div class="player-info">

                        <strong>
                            ${player}
                        </strong>

                        <span class="locked">
                            🔒 Maximum Reached
                        </span>

                    </div>

                    <input
                        type="number"
                        disabled
                        class="scoreInput locked-input"
                        placeholder="Locked"
                    >

                `;

            } else {

                const remaining =
                    gameData.maxPoints -
                    playerData.total;


                div.innerHTML = `

                    <div class="player-info">

                        <strong>
                            ${player}
                        </strong>

                        <span>
                            ${playerData.total}
                            /
                            ${gameData.maxPoints}
                        </span>

                    </div>

                    <input
                        type="number"
                        class="scoreInput"
                        data-index="${index}"
                        placeholder="Score"
                        min="0"
                    >

                    <small>
                        Remaining:
                        ${remaining}
                    </small>

                `;

            }


            scoreInputs.appendChild(div);

        }
    );
}


// ========================================
// LEADERBOARD
// ========================================

function updateLeaderboard() {

    leaderboard.innerHTML = "";


    const sortedPlayers =
        [...gameData.totals].sort(
            function (a, b) {

                return a.total - b.total;

            }
        );


    sortedPlayers.forEach(
        function (player, index) {

            const div =
                document.createElement("div");

            div.className =
                "leaderboard-item";


            const status =
                player.locked
                    ? " 🔒"
                    : "";


            div.innerHTML = `

                <div>

                    <strong>
                        ${index + 1}.
                        ${player.name}
                        ${status}
                    </strong>

                </div>

                <span>
                    ${player.total}
                    /
                    ${gameData.maxPoints}
                </span>

            `;


            leaderboard.appendChild(div);

        }
    );
}


// ========================================
// ROUND HISTORY
// ========================================

function updateRoundHistory() {

    roundHistory.innerHTML = "";


    if (gameData.rounds.length === 0) {

        roundHistory.innerHTML =
            "<p>No rounds played yet.</p>";

        return;
    }


    for (
        let roundIndex =
            gameData.rounds.length - 1;

        roundIndex >= 0;

        roundIndex--
    ) {

        const round =
            gameData.rounds[roundIndex];


        const roundBox =
            document.createElement("div");

        roundBox.className =
            "round-box";


        const canEdit =
            roundIndex >=
            gameData.rounds.length - 2;


        let html = `

            <div class="round-title">

                <h3>
                    Round ${roundIndex + 1}
                </h3>

                ${
                    canEdit
                    ?
                    `<button
                        class="edit-btn"
                        onclick="editRound(${roundIndex})"
                    >
                        ✏️ Edit
                    </button>`
                    :
                    `<span class="locked-history">
                        🔒 Locked
                    </span>`
                }

            </div>

        `;


        gameData.players.forEach(
            function (player, playerIndex) {

                const score =
                    round[playerIndex];


                html += `

                    <div class="round-player">

                        <span>
                            ${player}
                        </span>

                        <strong>
                            ${
                                score === null ||
                                score === undefined
                                ? "—"
                                : score
                            }
                        </strong>

                    </div>

                `;

            }
        );


        roundBox.innerHTML =
            html;

        roundHistory.appendChild(
            roundBox
        );
    }
}


// ========================================
// ADD ROUND
// ========================================

addRoundBtn.addEventListener(
    "click",
    function () {

        const inputs =
            document.querySelectorAll(
                ".scoreInput"
            );


        const roundScores =
            gameData.players.map(
                function () {
                    return null;
                }
            );


        for (
            let input of inputs
        ) {

            if (input.disabled) {
                continue;
            }


            const index =
                Number(
                    input.dataset.index
                );


            const value =
                input.value;


            if (value === "") {

                alert(
                    "Please enter scores for all active players."
                );

                return;
            }


            const score =
                Number(value);


            if (score < 0) {

                alert(
                    "Score cannot be negative."
                );

                return;
            }


            const currentTotal =
                gameData.totals[index].total;


            const newTotal =
                currentTotal + score;


            if (
                newTotal >
                gameData.maxPoints
            ) {

                const remaining =
                    gameData.maxPoints -
                    currentTotal;


                alert(
                    gameData.players[index] +
                    " can receive only " +
                    remaining +
                    " more points."
                );

                return;
            }


            roundScores[index] =
                score;
        }


        // Add scores
        gameData.players.forEach(
            function (player, index) {

                const score =
                    roundScores[index];


                if (score !== null) {

                    gameData.totals[index].total +=
                        score;


                    if (
                        gameData.totals[index].total >=
                        gameData.maxPoints
                    ) {

                        gameData.totals[index].locked =
                            true;

                    }

                }

            }
        );


        // Save round
        gameData.rounds.push(
            roundScores
        );


        saveGame();


        roundNumber.textContent =
            gameData.rounds.length + 1;


        createScoreInputs();

        updateLeaderboard();

        updateRoundHistory();


        alert(
            "Round " +
            gameData.rounds.length +
            " added successfully!"
        );

    }
);


// ========================================
// ADD PLAYER DURING GAME
// ========================================

addPlayerBtn.addEventListener(
    "click",
    function () {

        const name =
            newPlayerName.value.trim();


        const initialScore =
            Number(
                newPlayerScore.value
            );


        // Check name
        if (name === "") {

            alert(
                "Please enter player name."
            );

            return;
        }


        // Check duplicate
        const exists =
            gameData.players.some(
                function (player) {

                    return (
                        player.toLowerCase() ===
                        name.toLowerCase()
                    );

                }
            );


        if (exists) {

            alert(
                "This player already exists."
            );

            return;
        }


        // Check score
        if (
            isNaN(initialScore) ||
            initialScore < 0
        ) {

            alert(
                "Please enter a valid initial score."
            );

            return;
        }


        // Maximum check
        if (
            initialScore >
            gameData.maxPoints
        ) {

            alert(
                "Initial score cannot exceed maximum points."
            );

            return;
        }


        // ========================================
        // ADD NEW PLAYER
        // ========================================

        gameData.players.push(name);


        gameData.totals.push({

            name: name,

            total: initialScore,

            locked:
                initialScore >=
                gameData.maxPoints

        });


        /*
         * IMPORTANT:
         *
         * The new player did NOT play
         * previous rounds.
         *
         * Therefore:
         *
         * Previous rounds = null
         *
         * They start from the NEXT round.
         */


        for (
            let i = 0;
            i < gameData.rounds.length;
            i++
        ) {

            gameData.rounds[i].push(null);

        }


        // Save
        saveGame();


        // Clear fields
        newPlayerName.value = "";

        newPlayerScore.value = "";


        // Update page immediately
        createScoreInputs();

        updateLeaderboard();

        updateRoundHistory();


        alert(
            name +
            " added successfully!"
        );

    }
);


// ========================================
// EDIT LAST 2 ROUNDS
// ========================================

function editRound(roundIndex) {

    const totalRounds =
        gameData.rounds.length;


    if (
        roundIndex <
        totalRounds - 2
    ) {

        alert(
            "Only the last 2 rounds can be edited."
        );

        return;
    }


    const round =
        gameData.rounds[roundIndex];


    const historyBoxes =
        roundHistory.children;


    const boxIndex =
        totalRounds - 1 - roundIndex;


    const roundBox =
        historyBoxes[boxIndex];


    let html = `

        <div class="round-title">

            <h3>
                Edit Round ${roundIndex + 1}
            </h3>

        </div>

    `;


    gameData.players.forEach(
        function (player, playerIndex) {

            let oldScore =
                round[playerIndex];


            if (
                oldScore === null ||
                oldScore === undefined
            ) {

                oldScore = 0;

            }


            html += `

                <div class="edit-player">

                    <label>
                        ${player}
                    </label>

                    <input
                        type="number"
                        class="edit-score-input"
                        data-player-index="${playerIndex}"
                        value="${oldScore}"
                        min="0"
                    >

                </div>

            `;

        }
    );


    html += `

        <div class="edit-actions">

            <button
                onclick="saveEditedRound(${roundIndex})"
            >
                💾 Save Changes
            </button>

            <button
                class="cancel-btn"
                onclick="updateRoundHistory()"
            >
                Cancel
            </button>

        </div>

    `;


    roundBox.innerHTML =
        html;
}


// ========================================
// SAVE EDITED ROUND
// ========================================

function saveEditedRound(roundIndex) {

    const inputs =
        document.querySelectorAll(
            ".edit-score-input"
        );


    const newScores =
        gameData.players.map(
            function () {
                return null;
            }
        );


    for (
        let input of inputs
    ) {

        const index =
            Number(
                input.dataset.playerIndex
            );


        const value =
            Number(input.value);


        if (
            isNaN(value) ||
            value < 0
        ) {

            alert(
                "Score cannot be negative."
            );

            return;
        }


        newScores[index] =
            value;

    }


    // Calculate totals without
    // the old round
    const calculatedTotals =
        gameData.players.map(
            function (player, index) {

                let total = 0;


                gameData.rounds.forEach(
                    function (
                        existingRound,
                        existingIndex
                    ) {

                        if (
                            existingIndex !==
                            roundIndex
                        ) {

                            const score =
                                existingRound[index];


                            if (
                                score !== null &&
                                score !== undefined
                            ) {

                                total +=
                                    Number(score);

                            }

                        }

                    }
                );


                return total;

            }
        );


    // Check maximum
    for (
        let i = 0;
        i < gameData.players.length;
        i++
    ) {

        const newTotal =
            calculatedTotals[i] +
            (
                newScores[i] === null
                ? 0
                : newScores[i]
            );


        if (
            newTotal >
            gameData.maxPoints
        ) {

            alert(
                gameData.players[i] +
                " would exceed the maximum points."
            );

            return;
        }

    }


    // Replace round
    gameData.rounds[roundIndex] =
        newScores;


    // Recalculate totals
    gameData.totals =
        gameData.players.map(
            function (player, index) {

                let total = 0;


                gameData.rounds.forEach(
                    function (round) {

                        const score =
                            round[index];


                        if (
                            score !== null &&
                            score !== undefined
                        ) {

                            total +=
                                Number(score);

                        }

                    }
                );


                return {

                    name: player,

                    total: total,

                    locked:
                        total >=
                        gameData.maxPoints

                };

            }
        );


    saveGame();


    createScoreInputs();

    updateLeaderboard();

    updateRoundHistory();


    alert(
        "Round " +
        (roundIndex + 1) +
        " updated successfully!"
    );
}


// ========================================
// END GAME
// ========================================

function endGame() {

    saveGame();

    window.location.href =
        "result.html";
}


// ========================================
// INITIAL LOAD
// ========================================

createScoreInputs();

updateLeaderboard();

updateRoundHistory();
