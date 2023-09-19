import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import json

from helpers import login_required, check_email, apology

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Use CS50 library for configuring the database
db = SQL("sqlite:///squash.db")


# Ensure reponses are not cached
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    # Get latest results from the database for the user
    matches = 10
    games = 50
    user_id = session["user_id"]
    # Initialising variables for stats
    gameplay_stats = {}
    total_points_scored = 0
    total_points_conceded = 0
    total_games_won = 0
    matches_played = 0

    try:
        # Get last 10 match info
        match_results = db.execute(
            "SELECT * FROM matches WHERE userId = ? ORDER BY time DESC LIMIT ?", user_id, matches)

        # Get last 50 games
        game_results = db.execute(
            "SELECT * FROM games WHERE userId = ? ORDER BY time DESC LIMIT ?", user_id, games)

        # Implementing stats from matches
        for match in match_results:
            matches_played = matches_played + 1
            total_games_won = total_games_won + match["userGamesWon"]

        games_played = len(game_results)
        # Calculating values for variables above
        for game in game_results:
            total_points_scored = total_points_scored + game["userPoints"]
            total_points_conceded = total_points_conceded + \
                game["opponentPoints"]

        average_points_scored = round(
            float(total_points_scored / games_played), 2)
        average_points_conceded = round(
            float(total_points_conceded / games_played), 2)
    except:
        average_points_scored = 0
        average_points_conceded = 0
        games_played = 0

    # adding info to gameplay stats dict
    gameplay_stats["totalPointsScored"] = total_points_scored
    gameplay_stats["totalPointsConceded"] = total_points_conceded
    gameplay_stats["gamesPlayed"] = games_played
    gameplay_stats["averagePointsScored"] = average_points_scored
    gameplay_stats["averagePointsConceded"] = average_points_conceded
    gameplay_stats["totalGamesWon"] = total_games_won
    gameplay_stats["matchesPlayed"] = matches_played

    return render_template("index.html", match_results=match_results, gameplay_stats=gameplay_stats, games=games_played)


@app.route("/logout")
def logout():

    # Foget any user_id
    session.clear()

    # Redirect to home page
    return redirect("/")


@app.route("/login", methods=["GET", "POST"])
def login():

    # Forget any user_id
    session.clear()

    # User reached route via POST (by submitting form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("Must provide a username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("Must provide a password", 403)

        # Query database for unique username
        users = db.execute(
            "SELECT * FROM usersInfo WHERE username = ?", request.form.get(
                "username")
        )

        # Ensure username exists and password is correct
        if len(users) != 1 or not check_password_hash(
            users[0]["hash"], request.form.get("password")
        ):
            return apology("Invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = users[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET
    else:
        return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    # Register user
    if request.method == "POST":
        # Variables for the function
        username = request.form.get("username")
        password = request.form.get("password")
        confirm = request.form.get("confirm")

        email = request.form.get("email")
        phone_number = request.form.get("phoneNumber")

        # Ensure variables are okay for use
        if not username:
            return apology("Must enter a username", 403)
        elif not password:
            return apology("Must enter a password", 403)
        elif password != confirm:
            return apology("Passwords do not match", 409)

        # Add user to database if the condition below is met
        if password == confirm and username != "":
            try:
                # Attempt to add user. Note usernames are all unique. Number can be blank, not required.
                db.execute(
                    "INSERT INTO usersInfo (username, hash, email, number) VALUES(?, ?, ?, ?)",
                    username,
                    generate_password_hash(password),
                    email,
                    phone_number
                )
            except:
                return apology("Username already taken. Please pick a new one.", 403)

        # Return user to home page
        flash("Successfully registered!")
        return redirect("/")

    # User reached route via GET
    else:
        return render_template("register.html")


@app.route("/newgame", methods=["GET", "POST"])
@login_required
def newgame():
    try:
        # Get current user id and show in form
        user = db.execute("SELECT username FROM usersInfo WHERE id=?",
                          session["user_id"])[0]["username"]
    except:
        return apology("Unable to get username from DB", 403)

    # User submits from via post
    if request.method == "POST":
        # Variables for the function
        opponent = request.form.get("opponent")
        games_to_play = request.form.get("gamesToPlay")
        points_per_game = request.form.get("points")
        win_by = request.form.get("winBy")

        try:
            games_to_play = int(games_to_play)
            points_per_game = int(points_per_game)
            win_by = int(win_by)
        except:
            return apology("Please select game parameters", 403)

        # Logic Checks
        if not opponent:
            return apology("Player must verse someone", 403)

        # Redirect user to new game page with relevant information
        return render_template("play.html", user=user, opponent=opponent, games=games_to_play, points=points_per_game, win_by=win_by)

    # User got here via GET so render new game form
    else:
        return render_template("newgame.html", user=user)


@app.route('/matchFinished/<string:matchData>', methods=['POST'])
def matchFinished(matchData):
    # 1 - Load data
    data = json.loads(matchData)
    user_id = session["user_id"]

    # Extracting data from submitted fields
    user = data["user"]
    opponent = data["opponent"]
    userGamesWon = data["userGamesWon"]
    oppGamesWon = data["oppGamesWon"]

    if userGamesWon > oppGamesWon:
        winner = user
    else:
        winner = opponent

    # Remove irrelevant variables from the data before looping
    data.pop('user')
    data.pop('opponent')
    data.pop('userGamesWon')
    data.pop('oppGamesWon')

    # 2 - Add overall result to the matches table in the database
    db.execute("INSERT INTO matches (userId, userName, opponent, userGamesWon, opponentGamesWon, matchWinner) VALUES (?, ?, ?, ?, ?, ?)",
               user_id, user, opponent, userGamesWon, oppGamesWon, winner)

    # get the latest ID for matches from the match DB.
    matchId = db.execute(
        "SELECT * FROM matches ORDER BY matchId DESC LIMIT 1")[0]["matchId"]

    # 3 - Add the individual game results to the games table in the database
    for game in data:
        # Grab game data and convert to single value for db execution
        userPoints = data[game][0]
        oppPoints = data[game][1]
        userScore = max(userPoints)
        oppScore = max(oppPoints)

        # 4 - Need to determine individual game winner from results
        if len(userPoints) > len(oppPoints):
            gameWinner = user
        else:
            gameWinner = opponent

        db.execute("INSERT INTO games (matchId, userId, userName, opponentName, userPoints, opponentPoints, gameWinner) VALUES (?, ?, ?, ?, ?, ?, ?)",
                   matchId, user_id, user, opponent, userScore, oppScore, gameWinner)

    return redirect("/")


@app.route('/gamesPlayed', methods=["GET"])
@login_required
def gamesPlayed():
    # This function will grab the most recent games from the user and display them to the user
    user_id = session["user_id"]
    GAMES = 100
    MATCHES = 50
    # Get data from Database for user
    try:
        game_data = db.execute(
            "SELECT * FROM games WHERE userId = ? ORDER BY time DESC LIMIT ?", user_id, GAMES)
        match_data = db.execute(
            "SELECT * FROM matches WHERE userId = ? LIMIT ?", user_id, MATCHES)
    except:
        game_data = {}
        match_data = {}

    # Declaring variables for game stats
    games_played = 0
    games_won = 0
    games_lost = 0
    opponents_versed_list = []
    points_conceded = 0
    points_won = 0
    players_versed = 0

    # Manipulate the data to show the user Valuable statistics
    for game in game_data:
        # grabbing opponent name
        opponent = game["opponentName"]
        # adding scores
        points_conceded = points_conceded + game["opponentPoints"]
        points_won = points_won + game["userPoints"]
        games_played += 1
        # add opponent to the opponents list for use later
        if opponent not in opponents_versed_list:
            opponents_versed_list.append(opponent)
            players_versed += 1

        if game["gameWinner"] == opponent:
            games_lost += 1
        else:
            games_won += 1

    try:
        game_win_percentage = round(float(games_won / games_played), 2) * 100
    except:
        game_win_percentage = 0

    # Declaring variables for match stats
    matches_played = 0
    matches_won = 0
    matches_lost = 0
    players_versed_most = {}

    # Loop over match data and update variables
    for match in match_data:
        # Get username for userId
        username = match["userName"]
        opponent = match["opponent"]
        # If the matchwinner matches the username, update the score, otherwise, the match was lost
        if match["matchWinner"] == username:
            matches_won += 1
        else:
            matches_lost += 1

        # add current opponent to dict and update value
        if opponent in players_versed_most.keys():
            players_versed_most[opponent] = players_versed_most[opponent] + 1
        else:
            players_versed_most[opponent] = 1

        matches_played += 1

    try:
        match_win_percentage = round(
            float(matches_won / matches_played), 2) * 100
    except:
        match_win_percentage = 0
    # Find who we have versed the most
    key_list = list(players_versed_most.keys())
    val_list = list(players_versed_most.values())
    position = val_list.index(max(players_versed_most.values()))
    player_versed_most = key_list[position]

    return render_template("gamesplayed.html", games_played=games_played, games_won=games_won, games_lost=games_lost, game_win_percentage=game_win_percentage, points_conceded=points_conceded, points_won=points_won, players_versed=players_versed, player_versed_most=player_versed_most, matches_played=matches_played, matches_won=matches_won, matches_lost=matches_lost, match_win_percentage=match_win_percentage)


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    # Extract user information from database
    user_id = session["user_id"]

    user_info = db.execute(
        "SELECT * FROM usersInfo WHERE id = ?", user_id)[0]

    username = user_info["username"]
    email = user_info["email"]
    phone_number = user_info["number"]

    if not email:
        email = "None Provided"
    if not phone_number:
        phone_number = "None Provided"

    return render_template("profile.html", username=username, email=email, phone_number=phone_number)


@app.route("/updateUserInfo", methods=["POST"])
@login_required
def updateUserInfo():

    if request.method == "POST":

        user_id = session["user_id"]
        # Extract old info from database
        try:
            userInfo = db.execute(
                "SELECT * FROM usersInfo WHERE id = ?", user_id)[0]
            old_username = userInfo["username"]
            old_email = userInfo["email"]
            old_number = userInfo["number"]
        except:
            return apology("Unable to get user info form DB", 403)

        # Variables for function
        new_username = request.form.get("newUsername")
        new_email = request.form.get("newEmail")
        new_number = request.form.get("newNumber")

        if not new_username:
            return apology("Must enter a new username for form to work", 403)
        if new_username == old_username:
            return apology("Username cannot be the same as the previous", 403)
        if new_number == old_number and new_number != "":
            return apology("Number cannot be the same as the previous", 403)
        if new_email == old_email and new_email != "":
            return apology("Email cannot be the same as the previous", 403)

        # Checking email input
        email_validation = check_email(new_email)

        # Attempt to update userinfo
        try:
            # 1 - Update username in usersInfo
            db.execute("UPDATE usersInfo SET username = ? WHERE id = ?",
                       new_username, user_id)

            # 2 - Update username in games
            db.execute("UPDATE games SET userName = ? WHERE userId = ?",
                       new_username, user_id)

            # 3 - Update username in matches
            db.execute(
                "UPDATE matches SET userName = ? WHERE userId = ?", new_username, user_id)

        except:
            # Render error
            return apology("Unable to update user username. Please try again", 400)

        # Update email
        if email_validation == True:
            try:
                db.execute(
                    "UPDATE usersInfo SET email = ? WHERE id = ?", new_email, user_id)
            except:
                return ("Please enter a valid email address.", 400)

        # Update user phone number
        try:
            # Evaluate if the number is not blank and not the same as the previous
            if new_number != "":
                db.execute(
                    "UPDATE usersInfo SET number = ? WHERE id = ?", new_number, user_id)
        except:
            return apology("Unable to update number, server error.", 400)

        # Redirect back to home page if the update worked.
        flash("User information updated successfully.")
        return redirect("/profile")

    else:
        return redirect("/profile")
