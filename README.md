# Squash Tracker App

### Video Demo

### Description

This is a squash app tracker that I made for tracking my recent games and stats for squash competitions.

This is the final project as part of the CS50x Course. It involves Python, Javascript, HTML, and CSS.

### Why this app?

I play squash competitively and never had any good way of tracking the stats. The current scoring apps do not actually provide much valuable information to the user in terms of their performance over the long run.

That lead me to wanting to create an app that can provide the user more valuable insights into how they have been performing over the long run, but also a scoring app for use instead of the ones we currently use.

### How to use the app

#### Step 1 - Register

First, you want to create an account.

Click on the Register Button in the top right hand corner, under the login form, or via the path "/register" in the search bar.

![Register Button on the login form.](/static/images/ReadmeImages/Login.png)

On arrival to the **register** page, you will be prompted for the following:

- Username
- Password
- Confirmation of that password
- Email Address (not required)
- Phone Number (not required)

![Screenshot of the Regsiter Form.](/static/images/ReadmeImages/Register.png)

Once you have registered and filled out the form correctly, you will be prompted to log in with the username and password you just created.

**Make sure you write down the username and password** as it is case sensitive. There is also currently no way for you to reset or recover this.

#### Step 2 - Log In

Once logged in, you can then see overall stats for the game (initially will be empty).

![Initial index page view after logging in for the first time](/static/images/ReadmeImages/Index_HomePage.png)

You will want to click on the new game button and fill out the form parameters on who you are versing and the match params.

Submitting this form will render the game template.

![New Game form that needs to be filled out for game to work](/static/images/ReadmeImages/NewGameForm.png)

This is where the Javascript takes over to implement the main game functionality.

### Step 3

Play a game of squash!!

![Squash Game overview](/static/images/ReadmeImages/SquashGame.png)

What you want to do is when a player scores, click anywhere in the scoreboard for that player.

For example, if David in the above image scores, click on the zero below David's name to increment the point for him by 1.

This is the JS function that increments the score for the player you clicked on.

```javascript
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
```

If you accidentally add the score to the wrong player, simply click the undo button in the middle of the page.

This will undo the most recently scored point (i.e. the wrong person you clicked). Refer to the removeLastScore function in script.js.

Keep scoring until one player wins the game. This will then prompt the scorer who won that game.

If this is wrong (i.e. you clicked the wrong person, then click outside of the modal window or the undo buttton.)

![Game Won modal window that appears after the game has been won](/static/images/ReadmeImages/GameWonModal.png)

If you did select the right player, click next game. This will reset the scores and update the games won for David (See below).

![Game won score incremented for player](/static/images/ReadmeImages/GameWon.png)

Keep playing the game until one user wins. In this case, I made David lose to show you how the index/homepage is updated.

Once all games have been played (i.e. one player has won the best of the total game amount, for 5 games its 3 and 3 games its 2), the match complete window pops up.

**This only pops up after the next game window has been clicked**. The reason for this is the modal window logic.

![Example of match won modal popping up](/static/images/ReadmeImages/MatchWon.png)

### Step 4 - Return Home

Clicking on the return home button does exactly that. In this case, **DO NOT CLICK** outside of the modal window.

This causes problems that I still need to fix. Just click the return home button to then see your data in the homepage.

![Homepage updated with latest game results](/static/images/ReadmeImages/homepageUpdated.png)

On the left in "Recent Matches" you will see the most recent 10 matches played by you, the user logged in.

You can see who you versed, the amount of games won or lost, and the overall winner of that match.

On the right, you will see all the game stats for at most the last 50 games you have played.

**NOTE** you will only see **YOUR** stats.

This is because you log in and everything is based around your user_id in the app.

All the data is based on that.
