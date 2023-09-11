// According to ChatGPT need to wrap the DOM in an event listener
document.addEventListener("DOMContentLoaded", function () {
  // Selecting required elements for implementing the game functionality
  const userEl = document.querySelector(".player--0");
  const opponentEl = document.querySelector(".player--1");
  const userScore = document.getElementById("score--0");
  const opponentScore = document.getElementById("score--1");
  const undoBtn = document.getElementById("undoBtn");
  const endMatchBtn = document.getElementById("endMatchBtn");

  // Defining Variables for functionality
  let curUserScore,
    curOppScore,
    playing,
    currentPlayer,
    curPlayerScore,
    score,
    curPlayerScoreUsable,
    lastPlayerToScore;

  // Player 0 is the first nested array and player-1 is the second
  const gameScores = [[], []];

  const incrementScoreForPlayer = function (player) {
    curPlayerScore = document.getElementById(`score--${player}`);
    let curPlayerScoreUsable = parseInt(curPlayerScore.textContent);
    curPlayerScoreUsable += 1;
    // Update the contents of the button
    curPlayerScore.textContent = curPlayerScoreUsable;

    // Store the score in the players Scores array
    gameScores[player].push(curPlayerScoreUsable);
    lastPlayerToScore = player;
  };

  // Switch from current player to opponent
  const switchPlayer = function () {
    // Swap current players as we start by default with user.
    currentPlayer = currentPlayer === 0 ? 1 : 0;

    // Toggle  active class between another
    userEl.classList.toggle("player--active");
    opponentEl.classList.toggle("player--active");
  };

  // Game functionality using event listener
  userScore.addEventListener("click", function () {
    incrementScoreForPlayer(0);
  });

  // Game functionality using event listener
  opponentScore.addEventListener("click", function () {
    incrementScoreForPlayer(1);
  });
});
