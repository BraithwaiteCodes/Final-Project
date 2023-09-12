// According to ChatGPT need to wrap the DOM in an event listener
document.addEventListener("DOMContentLoaded", function () {
  // Selecting required elements for implementing the game functionality
  const userEl = document.querySelector(".player--0");
  const opponentEl = document.querySelector(".player--1");
  const undoBtn = document.getElementById("undoBtn");
  const gameWonModal = document.getElementById("gameWonModal");
  const overlay = document.querySelector(".overlay");
  const backBtn = document.getElementById("goBack");
  const nextGameBtn = document.getElementById("nextGame");
  const endMatchBtn = document.getElementById("endMatchBtn");

  ///////////////////////////////////////////////////////////////////////////////////////

  // Modal functionality
  const openGameModal = function () {
    gameWonModal.classList.remove("hidden-modal");
    overlay.classList.remove("hidden-modal");
  };

  const closeGameModal = function () {
    gameWonModal.classList.add("hidden-modal");
    overlay.classList.add("hidden-modal");
  };

  // Listeners for closing the modal window
  backBtn.addEventListener("click", function () {
    removeLastScore();
    closeGameModal();
  });

  overlay.addEventListener("click", function () {
    removeLastScore();
    closeGameModal();
  });

  ///////////////////////////////////////////////////////////////////////////////////////

  // Gameplay Variables from form that was submitted
  const games = document.getElementById("gamesToPlay").textContent.split(": ");
  const points = document.getElementById("points").textContent.split(": ");
  const winBy = document.getElementById("win_by").textContent.split(": ");
  const gamesPlayed = document
    .getElementById("gamesPlayed")
    .textContent.split(": ");

  // Storing variables into a dictionary for logic later
  const gameInfo = {};
  gameInfo[`${games[0]}`] = parseInt(games[1]);
  gameInfo[`${points[0]}`] = parseInt(points[1]);
  gameInfo[`${winBy[0]}`] = parseInt(winBy[1]);
  gameInfo[`${gamesPlayed[0]}`] = parseInt(gamesPlayed[1]);

  // Defining Variables for event listeners
  let curPlayerScore, curPlayerScoreUsable, lastPlayerToScore;

  // Player 0 is the first nested array and player-1 is the second
  const gameScores = [[], []];

  const incrementScoreForPlayer = function (player) {
    curPlayerScore = document.getElementById(`score--${player}`);
    curPlayerScoreUsable = parseInt(curPlayerScore.textContent);
    curPlayerScoreUsable += 1;
    // Update the contents of the button
    curPlayerScore.textContent = curPlayerScoreUsable;

    // Store the score in the players Scores array
    gameScores[player].push(curPlayerScoreUsable);
    lastPlayerToScore = player;
  };

  const resetScores = function () {
    const resetUserScoreLocation = document.getElementById("score--0");
    const resetOpponentScoreLocation = document.getElementById("score--1");

    resetUserScoreLocation.textContent = 0;
    resetOpponentScoreLocation.textContent = 0;
  };

  // Removes the last score from the scores array when complete.
  const removeLastScore = function () {
    if (
      lastPlayerToScore !== undefined &&
      gameScores[lastPlayerToScore].length > 0
    ) {
      // Remove the last entry for that player
      gameScores[lastPlayerToScore].pop();

      // Update the score for the player
      const decrementedScore = document.getElementById(
        `score--${lastPlayerToScore}`
      );
      decrementedScore.textContent =
        gameScores[lastPlayerToScore][
          gameScores[lastPlayerToScore].length - 1
        ] || 0;
    }
  };

  // Checks the scores array to see if meets the criteria for one game
  const checkIfGameWon = function (player) {
    const pointsToWin = gameInfo["Points per Game"];
    const winBy = gameInfo["Win By"];
    const playerScore = parseInt(
      document.getElementById(`score--${player}`).textContent
    );
    const opponent = player ? 0 : 1;
    const opponentScore = parseInt(
      document.getElementById(`score--${opponent}`).textContent
    );

    if (playerScore === pointsToWin && playerScore - opponentScore >= winBy) {
      openGameModal();
    }
  };

  // LISTENERS
  // UNDO button functionality
  undoBtn.addEventListener("click", function () {
    removeLastScore();
    console.log(gameScores);
  });

  // Scoreboard event listener for defined user
  userEl.addEventListener("click", function () {
    incrementScoreForPlayer(0);
    checkIfGameWon(0);
  });

  // Scoreboard event listener for defined user
  opponentEl.addEventListener("click", function () {
    incrementScoreForPlayer(1);
    checkIfGameWon(1);
  });

  // Next Game event listener
  nextGameBtn.addEventListener("click", function () {
    const totalGames = gameInfo["Total Games"];

    // if 3 total games, this will be 2. If 5 total games, this will be 3.
    const best_of = Math.ceil(totalGames / 2);

    // Get current games played and increment.
    curGamesPlayed = gameInfo["Games Played"];
    curGamesPlayed += 1;
    gameInfo["Games Played"] = curGamesPlayed;
    closeGameModal();
    gamesHTMLLocation = document.getElementById("gamesPlayed");

    gamesHTMLLocation.textContent = `Games Played: ${curGamesPlayed}`;
    resetScores();
  });
});