from flask import flash, redirect, render_template, session
from functools import wraps
from email_validator import validate_email, EmailNotValidError


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def check_email(email):
    try:
        # Validate and get info
        v = validate_email(email, check_deliverability=False)
        # Replace with normalised form
        email = v.normalized
        # return False for the if statement in app.py
        return False
    except EmailNotValidError:
        return True


def apology(message, code=400):
    """Render message as an apology to user."""
    return render_template("apology.html", error=code, errormsg=message), code
