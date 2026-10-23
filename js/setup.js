const playerCount =
    document.getElementById("playerCount");

const playersContainer =
    document.getElementById("playersContainer");

const startGameBtn =
    document.getElementById("startGameBtn");


// ========================================
// CREATE PLAYER INPUTS
// ========================================

function createPlayerInputs() {

    playersContainer.innerHTML = "";


    let count =
        Number(playerCount.value);


    // Minimum 2 players
    if (count < 2) {

        count = 2;

        playerCount.value = 2;
    }


    // Maximum 50 players
    if (count > 50) {

        count = 50;

        playerCount.value = 50;
    }


    for (
        let i = 1;
        i <= count;
        i++
    ) {

        const div =
            document.createElement("div");


        div.className =
            "form-group";


        div.innerHTML = `

            <label>
                Player ${i}
            </label>

            <input
                type="text"
                class="playerName"
                placeholder="Enter player ${i} name"
            >

        `;


        playersContainer.appendChild(div);
    }
}


// ========================================
// WHEN PLAYER COUNT CHANGES
// ========================================

playerCount.addEventListener(
    "input",
    createPlayerInputs
);


// ========================================
// INITIAL LOAD
// ========================================

createPlayerInputs();


// ========================================
// START GAME
// ========================================

startGameBtn.addEventListener(
    "click",
    function () {

        const gameName =
            document
                .getElementById("gameName")
                .value
                .trim();


        const maxPoints =
            Number(
                document
                    .getElementById("maxPoints")
                    .value
            );


        const playerInputs =
            document.querySelectorAll(
                ".playerName"
            );


        const players = [];


        // Check game name
        if (
            gameName === ""
        ) {

            alert(
                "Please enter a game name."
            );

            return;
        }


        // Check maximum points
        if (
            maxPoints <= 0 ||
            isNaN(maxPoints)
        ) {

            alert(
                "Please enter a valid maximum points."
            );

            return;
        }


        // Get player names
        for (
            let input of playerInputs
        ) {

            const name =
                input.value.trim();


            if (
                name === ""
            ) {

                alert(
                    "Please enter all player names."
                );

                return;
            }


            players.push(name);
        }


        // Check duplicate names
        const uniqueNames =
            new Set(
                players.map(
                    function (name) {
                        return name.toLowerCase();
                    }
                )
            );


        if (
            uniqueNames.size !==
            players.length
        ) {

            alert(
                "Player names must be different."
            );

            return;
        }


        // ========================================
        // CREATE GAME DATA
        // ========================================

        const gameData = {

            gameName: gameName,

            maxPoints: maxPoints,

            players: players,

            rounds: [],

            totals:
                players.map(
                    function (name) {

                        return {

                            name: name,

                            total: 0,

                            locked: false

                        };

                    }
                )

        };


        // Save game
        localStorage.setItem(
            "cardGame",
            JSON.stringify(gameData)
        );


        // Open game
        window.location.href =
            "game.html";

    }
);


// ========================================
// BACK TO HOME
// ========================================

function goHome() {

    window.location.href =
        "index.html";
}
