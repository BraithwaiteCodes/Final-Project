import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

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
    # Show the homepage
    return render_template("index.html")


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
        elif check_email(email):
            return apology("Email is not valid. Please enter a valid email", 403)

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
def newgame():

    # Get current user id and show in form
    # TODO
    return render_template("newgame.html")
