import os
from flask import Flask, request, json, jsonify, Response, make_response
from flask_jwt_extended import (JWTManager, jwt_refresh_token_required,jwt_required, create_access_token, get_jwt_identity, create_refresh_token)
from app_helpers import queryDB, hashPw, verifyPw, resp, allowedFile, is_json
from flask_cors import CORS
import hashlib, uuid
import datetime
from werkzeug.utils import secure_filename
from app_config import secret_key

UPLOAD_FOLDER = 'F:\Projects\Projects\CS50\cs50_project_2019\Backend\static\profileImages'
ALLOWED_EXTENSION = set(['jpg','jpeg','png','gif'])

app = Flask(__name__, static_folder='static')
app.config['JWT_SECRET_KEY'] = secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CORS_HEADERS'] = 'Content-Type'
jwt = JWTManager(app)
CORS(app)


@app.route('/register', methods=['POST'])

# Checks request is valid JSON
@is_json
def register():
    username, password, firstname, lastname, email = request.json.get('userName', None), request.json.get('password', None), request.json.get('firstName', None), request.json.get('lastName', None), request.json.get('email', None)

    # Checks for null fields
    if not username or not password or not firstname or not lastname or not email:
        return resp(code=400, msg="Missing details")

    # Checks for empty fields
    if username == "" or password == "" or email == "" or firstname == "" or lastname == "":
        return resp(code=400, msg="Malformed register request!")

    # Checks if a user already exists with the provided username or email
    if queryDB(query="select * from accounts where username=%s or email=%s", oneRow = True, queryTerms=(username, username)):
        return resp(code=400, msg="Username or email in use!")

    # Generates a unique userID
    userID = uuid.uuid4()

    # Hashes the users password.
    passwordHash = hashPw(password)

    # Inserts new users details into the DB.
    if queryDB(modify=True, query="insert into users (id,username,firstname,lastname,email,password, timeStampRegistration) VALUES (%s,%s,%s,%s,%s,%s, CURRENT_TIMESTAMP())", queryTerms=(userID, username, firstname, lastname, email, passwordHash)) != True:
        return resp(code=400,msg="Issue during registration! Please try again later.")

    # Returns a success message to the frontend
    return resp(msg="Registration successful.")


@app.route('/login', methods=['POST'])

# Checks request is valid JSON
@is_json
def getToken():
    username_email, password = request.json.get('usernameEmail'), request.json.get('password')

    # Checks username/email and password are not null/none
    if not username_email or not password:
        return resp(code=400, msg="Username/Email or Password not provided!")
    
    # Retrieves the user from the DB if the user exists
    userFromDB = queryDB(query="select username, avatar, password from users where username=%s or email=%s", oneRow=True, queryTerms=(username_email, username_email))
    # Checks user is not null/none
    if userFromDB:

        # Checks password is matches the password stored for the user
        if verifyPw(password, userFromDB['password']) == True:

            # Generates a refresh and access token for the user with their username embedded within
            refresh_token = create_refresh_token(identity=userFromDB['username'])
            access_token = create_access_token(identity=userFromDB['username'])

            # Stores the latest access and refresh token generated for the user in the DB with a datetime stamp and a session start timestamp
            data = queryDB(modify=True, query="Update users set access_token=%s, refresh_token=%s, timeStampLastLogin=CURRENT_TIMESTAMP(), timeStampSessionStart=CURRENT_TIMESTAMP() where username=%s", queryTerms=(access_token, refresh_token, userFromDB['username']))
            
            # Confirms the above ran without error
            if data != False:
                
                # Returns an access and refresh token along with the users username and avatar
                return resp(data={"access_token": access_token, "refresh_token": refresh_token, "username": userFromDB['username'], "avatar": f"http://localhost:5000/static/profileImages/{userFromDB['avatar']}"}, msg="token request successful")
            
            # If there was an issue storing the latest tokens and timestamps the login will fail and return a failur message
            return resp(code=400, msg="Issue logging in, Please try again.")

    # If the username cannot be found or the password is incorrect the login will fail an return a failure message        
    return resp(code=400, msg="Incorrect username and/or password!")


@app.route('/retrieveAccountData', methods=['POST'])
# Checks that the request includes a valid access(JWT) token
@jwt_required
def retrieveAccountData():

    # Get identity(username) from the access(JWT) token
    currentUser = get_jwt_identity()
    
    # Retrieve user info from DB
    accountInfo = queryDB(query="select username,avatar, timeStampLastLogin, timeStampRegistration, email, firstname, lastname from users where username=%s", oneRow = True, queryTerms=(currentUser, ))
    
    # Checks account info is not null/none suggesting a failure to retrieve from the DB
    if accountInfo != False:

        # Returns account info
        return resp(data=accountInfo)

    # If account info retrieval fails for any reason 
    return resp(code=400, msg="Error occured, Please try again later!")


@app.route('/retrieveAllNotes', methods=['POST'])
# Confirms request contains valid refresh token(This token has a lower ttl than a standard access token)
@jwt_refresh_token_required
def retrieveAllNotes():

    # Get identity(username) from the access(JWT) token
    currentUser = get_jwt_identity()

    # Retrieve all notes associated with the user
    data = queryDB(query="select id, title, body, timeStampEntered, timeStampModified from notes where user=(select id from users where username=%s)", allRows=True, queryTerms=(currentUser, ))

    # Checks notes where successfully retrieved
    if data != False:

        # Returns users notes to frontend
        return resp(data=data, msg="query successful")

    # Returns error message if notes where not retrieved
    return resp(code=400, msg="Error retrieving notes, Please try again later.")


@app.route('/addNote', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def addNote():

    # Gets user's identity (username)
    currentUser = get_jwt_identity()
    title = request.json.get('title')
    body = request.json.get('body')

    # Checks title is not null/none or an empty string
    if title == None or title == "":
        return resp(code=400, msg="No title, Please add a title to your note.")
    
    # Adds not to DB, If for any reason the note is not saved an error message will be returned
    if queryDB(modify=True, query="insert into notes (title, body, timeStampEntered, timeStampModified) values (%s, %s, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())", queryTerms=(title, body)) == False:
        return resp(code=400, msg="Error saving note, Please try again later.")
    
    # Return success if not saved
    return resp(msg="Note saved.")
    
    
@app.route('/updateNote', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def save_todos():
    currentUser = get_jwt_identity()
    noteId = request.json.get('id')
    body = request.json.get('content')
    title = request.json.get('title')

    # Checks noteId is not null/none, Updates the entry in the DB
    if noteId and queryDB(modify=True, query="update notes set timeStampModified=CURRENT_TIMESTAMP(), body=%s, title=%s where id=%s", queryTerms=(body, title, noteId)) != False:
        return resp(msg="updates saved")
    
    # Returns an error if noteID is null/None or an error is encountered during the DB query
    return resp(code=500, msg="error saving update")


@app.route('/deleteNote', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def deleteNote():
    currentUser = get_jwt_identity()
    noteId = request.json.get('id')

    # Checks noteId is not null/none then proceeds to delete the requested note
    if noteId and queryDB(modify=True, query="delete from notes where id=%s and user=(select id from users where username=%s)", queryTerms=(noteId, currentUser)) != False:

        # Upon successful deletion a response will be resturned to the frontend stating such
        return resp(msg="Note successfully deleted!")

    # If noteId is null/none or the DB query fails an error message will be returned to the frontend
    return resp(code=400, msg="Error while deleting note, Please try again later.")


@app.route('/filter', methods=['POST'])
# Checks for a valid refresh token
@jwt_refresh_token_required
# Checks request is valid JSON
@is_json
def filter():
    currentUser = get_jwt_identity()
    searchterm = request.json.get('filterTerm')

    # Checks the search term is not null/none or an empty string
    if searchterm != None or searchterm != "":

        # Executes tghe filtering query with the provided search term
        data = queryDB(query="select * from notes where user=(select id from users where username=%s) and body like %s;", allRows=True, queryTerms=(currentUser, '%' + searchterm + '%'))

        # Checks if the has not returned any data
        # TODO account for a search term not returning results but not failing either
        if data != False or data != None:
            return resp(data=data, msg="success")
    return resp(code=400, msg="Error while attempting to filter notes.")

    
##@app.route('/updateAccountData', methods=['POST'])
@app.route('/updateAvatar', methods=['POST'])
@jwt_required
def updateAccountData():
    curr_user = get_jwt_identity()
    if 'file' in request.files:
        file = request.files['file']
        if file and allowedFile(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            data = DBQuery(modify = f"update accounts set avatar='{filename}' where username='{curr_user}'", select= f"select avatar from accounts where username='{curr_user}'", oneRow=True)
            if data != False:
                return resp(data={"avatar": f"http://localhost:5000/static/profileImages/{data['avatar']}"}, msg="avatar added/updated")
            else:
                return resp(code=500, msg="error adding/updating avatar")