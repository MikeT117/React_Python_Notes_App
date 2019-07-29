import os
from flask import Flask, request, json, jsonify, Response, make_response
from flask_jwt_extended import (JWTManager, jwt_refresh_token_required,
                                jwt_required, create_access_token, get_jwt_identity, create_refresh_token)
from app_helpers import queryDB, hashPw, verifyPw, resp, allowedFile, is_json
from flask_cors import CORS
import hashlib
import uuid
import datetime
from werkzeug.utils import secure_filename
from app_config import secret_key
import eventlet

eventlet.monkey_patch()
UPLOAD_FOLDER = "YOUR UPLOAD FOLDER HERE"
ALLOWED_EXTENSION = set(['jpg', 'jpeg', 'png', 'gif'])

app = Flask(__name__, static_folder='static')
app.config['JWT_SECRET_KEY'] = secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 604800
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CORS_HEADERS'] = 'Content-Type'
jwt = JWTManager(app)
CORS(app)


@app.route('/register', methods=['POST'])
# Checks request is valid JSON
@is_json
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    firstname = request.json.get('firstname', None)
    lastname = request.json.get('lastname', None)
    email = request.json.get('email', None)

    # Checks for null fields
    if not username or not password or not firstname or not lastname or not email:
        return resp(code=400, msg="Missing details")

    # Checks for empty fields
    if username == "" or password == "" or email == "" or firstname == "" or lastname == "":
        return resp(code=400, msg="Malformed register request!")

    # Checks if a user already exists with the provided username or email
    if queryDB(query="select * from users where username=%s or email=%s;", oneRow=True, queryTerms=(username, email)):
        return resp(code=400, msg="Username or email in use!")

    # Generates a unique userID
    userID = str(uuid.uuid4())

    # Hashes the users password.
    passwordHash = hashPw(password)

    # Inserts new users details into the DB.
    if queryDB(modify=True, query="insert into users (id,username,firstname,lastname,email,password, timeStampRegistration, syncInterval) VALUES (%s,%s,%s,%s,%s,%s, CURRENT_TIMESTAMP(), %s);", queryTerms=(userID, username, firstname, lastname, email, passwordHash, 5)) != True:
        return resp(code=400, msg="Issue during registration! Please try again later.")

    # Returns a success message to the frontend
    return resp(msg="Registration successful.")


@app.route('/login', methods=['POST'])
# Checks request is valid JSON
@is_json
def getToken():
    username_email = request.json.get('usernameEmail', None)
    password = request.json.get('password', None)

    # Checks username/email and password are not null/none
    if not username_email or not password:
        return resp(code=400, msg="Username/Email or Password not provided!")

    # Retrieves the user from the DB if the user exists
    userFromDB = queryDB(query="select id, username, avatar, syncInterval, password from users where username=%s or email=%s;",
                         oneRow=True, queryTerms=(username_email, username_email))
    # Checks user is not null/none
    if userFromDB:

        # Checks password is matches the password stored for the user
        if verifyPw(password, userFromDB['password']) == True:

            # Generates a refresh and access token for the user with their username embedded within
            refresh_token = create_refresh_token(
                identity=userFromDB['username'])
            access_token = create_access_token(identity=userFromDB['username'])

            # Stores the latest access and refresh token generated for the user in the DB with a datetime stamp and a session start timestamp
            data = queryDB(modify=True, query="Update users set access_token=%s, refresh_token=%s, timeStampLastLogin=CURRENT_TIMESTAMP(), timeStampSessionStart=CURRENT_TIMESTAMP() where username=%s;", queryTerms=(
                access_token, refresh_token, userFromDB['username']))

            # Confirms the above ran without error
            if data != False:

                # Returns an access and refresh token along with the users username and avatar
                return resp(data={"access_token": access_token, "refresh_token": refresh_token, "userId": userFromDB["id"], "username": userFromDB['username'], "syncInterval": userFromDB['syncInterval'], "avatar": f"http://localhost:5000/static/profileImages/{userFromDB['avatar']}"}, msg="token request successful")

            # If there was an issue storing the latest tokens and timestamps the login will fail and return a failur message
            return resp(code=400, msg="Issue logging in, Please try again.")

    # If the username cannot be found or the password is incorrect the login will fail an return a failure message
    return resp(code=400, msg="Incorrect username and/or password!")


@app.route('/retrieveAccountData', methods=['POST'])
# Checks that the request includes a valid access(JWT) token
@jwt_refresh_token_required
def retrieveAccountData():

    # Get identity(username) from the access(JWT) token
    currentUser = get_jwt_identity()

    # Retrieve user info from DB
    accountInfo = queryDB(query="select email, firstname, lastname, timeStampLastLogin, timeStampRegistration from users where username=%s;",
                          oneRow=True, queryTerms=(currentUser))

    # Checks account info is not null/none suggesting a failure to retrieve from the DB
    if accountInfo != False:

        # Returns account info
        return resp(data=accountInfo)

    # If account info retrieval fails for any reason
    return resp(code=400, msg="Error occured, Please try again later!")

 # select * FROM notes WHERE body LIKE '%%' OR title LIKE '%%'


@app.route('/retrieveNotes', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def retrieveNotes():
    # Get identity(username) from the access(JWT) token
    currentUser = get_jwt_identity()

    # Retrieve all notes associated with the user
    data = queryDB(query="select id, title, body, timeStampEntered, timeStampModified, user from notes where user=(select id from users where username=%s);",
                   allRows=True, queryTerms=(currentUser))
    # Checks notes where successfully retrieved
    if data != False:

        # Returns users notes to frontend
        return resp(data=data, msg="query successful")

    # Returns error message if notes where not retrieved
    return resp(code=400, msg="Error retrieving notes, Please try again later.")


@app.route('/saveUpdateNote', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def saveUpdateNote():

    # Gets user's identity (username)
    currentUser = get_jwt_identity()

    # Gets noteID if provided
    newNote = request.json.get('newNote', None)
    # Gets the note data from the request
    noteId = request.json.get('id', None)
    body = request.json.get('body', None)
    title = request.json.get('title', None)
    timeStampEntered = request.json.get('timeStampEntered', None)
    timeStampModified = request.json.get('timeStampModified', None)
    userId = request.json.get('user', None)

    # Checks newNote value to determine if this is an existing note and therefore an update is necessary, otherwise it's a new note.
    if newNote:
        if queryDB(modify=True, query="insert into notes (title, body, timeStampEntered, timeStampModified, user) values (%s, %s, %s, %s, %s);", queryTerms=(title, body, timeStampEntered, timeStampModified, userId)) != False:
            return resp(msg="Note saved.")

    # Updates an existing note with the values provided
    elif queryDB(modify=True, query="update notes set timeStampModified=%s, body=%s, title=%s where id=%s;", queryTerms=(timeStampModified, body, title, noteId)) != False:
        return resp(msg="updates saved")

    # Returns an error if noteID is null/None or an error is encountered during saving/updating
    return resp(code=500, msg="Error saving note! Please try again later")


@app.route('/deleteNote', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def deleteNote():

    # Gets user's identity (username)
    current_user = get_jwt_identity()

    # Gets note id from request
    noteId = request.json.get('id', None)

    # Checks noteId is not null/none then proceeds to delete the requested note
    if noteId:
        if queryDB(modify=True, query="delete from notes where id=%s and user=(select id from users where username=%s);", queryTerms=(noteId, current_user)) != False:

            # Upon successful deletion a response will be resturned to the frontend stating such
            return resp(msg="Note successfully deleted!")

    # If noteId is null/none or the DB query fails an error message will be returned to the frontend
    return resp(code=400, msg="Error while deleting note, Please try again later.")


@app.route('/updateAccount', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def updateAccount():

    # Gets user's identity (username)
    current_user = get_jwt_identity()

    # Gets the updateable account details
    email = request.json.get('email', None)
    username = request.json.get('username', None)
    firstname = request.json.get('firstname', None)
    lastname = request.json.get('lastname', None)
    syncInterval = request.json.get('syncInterval', None)

    # Checks none of the details are neither null/none or an empty string
    if email and username and firstname and lastname and syncInterval != None or "":

        # Updates the users  details
        if queryDB(modify=True, query="update users set email=%s, username=%s, firstname=%s, lastname=%s, syncInterval=%s) where username=%s;", queryTerms=(email, username, firstname, lastname, syncInterval, current_user)) != False:

            # Gets tehe new users details from the DB
            data = queryDB(query="select * from users where username=%s;",
                           oneRow=True, queryTerms=(username, ))

            # Confirms it was successfully retreived
            if data != False:

                # If successful, new account data will be returned to frontend
                return resp(data=data, msg="Account updated!")

        # Returns an error due to an issue writing updated details to the DB
        return resp(code=400, msg="Error while updating account, Please try agin later.")

    # Returns an error due to empty account details
    return resp(code=400, msg="Error, Empty account data.")


@app.route('/updatePassword', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def updatePassword():

    # Gets user's identity (username)
    current_user = get_jwt_identity()

    # Gets password from request
    password = request.json.get('password', None)

    # Checks passwordis not null/none or an empty string
    if password and password != "":

        # Hashes the password
        passwordHash = hashPw(password)

        # Writes the updated password to the DB
        if queryDB(modify=True, query="update users set password=%s where username=%s;", queryTerms=(passwordHash, current_user)) != False:

            # Returns a successful message if the query was successful
            return resp(msg="Password has been successfully updated.")

        # Returns an error due to an issue writing the password to the DB
        return resp(msg="Issue updating password, PLease try again later.")

    # Returns an error due to the password being null/none or an empty string
    return resp(msg="Password cannot be empty, How did you even get here, My frontend validations must be sleeping O_o")


@app.route('/updateAvatar', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
def updateAccountData():

    # Gets user's identity (username)
    current_user = get_jwt_identity()

    # Checks the request contains a file
    if 'file' in request.files:

        # Assigns the file to a variable
        file = request.files['file']

        # Checks file is not null/None and that the file is using an allowed file extension
        if file and allowedFile(file.filename):

            # Checks and returns a secure filename and appends the current user to the name
            # to make it somewhat unique (UUID would be better here)
            filename = secure_filename(file.filename) + f"_{current_user}"

            # Saves the file in the set env variable UPLOAD FOLDER path
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # Save the filename to the DB
            data = queryDB(modify=True, query="update users set avatar=%s where username=%s", queryTerms=(
                filename, current_user))

            # Checks the data was successfully pushed to the DB
            if data != False:

                # Returns the updated filename to the frontend along with the full url to access it
                return resp(data={"avatar": f"http://localhost:5000/static/profileImages/{filename}"}, msg="avatar added/updated")
            else:

                # Returns an error if the query was unsuccessful
                return resp(code=500, msg="error adding/updating avatar")

        # Returns an error if the file extension is not in the list of allowed extensions
        return resp(code=500, msg="File ext not allowed")

    # Returns an error if the request does not contain a file
    return resp(code=500, msg="File not in request")


if __name__ == '__main__':
    app.run(debug=True)
