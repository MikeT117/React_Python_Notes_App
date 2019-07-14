import os
from flask import Flask, request, json, jsonify, Response, make_response
from flask_jwt_extended import (JWTManager, jwt_refresh_token_required,jwt_required, create_access_token, get_jwt_identity, create_refresh_token)
from app_helpers import DBQuery, hashPw, verifyPw, resp, allowedFile
from flask_cors import CORS
import hashlib, uuid
import datetime
from werkzeug.utils import secure_filename
import app_config

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
def register():

    # Checks request is valid JSON
    if not request.is_json:
        return resp(code=400, msg="Missing JSON request!")

    username, password, firstname, lastname, email = request.json.get('userName', None), request.json.get('password', None), request.json.get('firstName', None), request.json.get('lastName', None), request.json.get('email', None)

    # Checks for null fields
    if not username or not password or not firstname or not lastname or not email:
        return resp(code=400, msg="Missing details")

    # Checks for empty fields
    if username == "" or password == "" or email == "" or firstname == "" or lastname == "":
        return resp(code=400, msg="Malformed register request!")

    # Checks if a user already exists with the provided username or email
    if DBQuery(select = f"select * from accounts where username='{username}' or email='{email}'", oneRow = True):
        return resp(code=400, msg="Username or email in use!")

    # Generates a unique userID
    userID = uuid.uuid4()

    # Hashes the users password.
    password_hash = hashPw(password)

    # Inserts new users details into the DB.
    if DBQuery(modify = f"""insert into accounts (id,username,firstname,lastname,email,password, datetimeRegistration) VALUES ("{userID}","{username}","{firstname}","{lastname}","{email}", "{password_hash}", CURRENT_TIMESTAMP())""") != True:
        return resp(code=400,msg="Issue during registration! Please try again later.")

    # Returns a success message to the frontend
    return resp(code=200, msg="Registration successful.")

@app.route('/login', methods=['POST'])
def getToken():
    
    # Checks request is valid JSON
    if not request.is_json:
        return resp(code=400, msg="JSON Request Required!")
    
    username_email, password = request.json.get('userEmail'), request.json.get('pw')

    # Checks username/email and password are not null/none
    if not username_email or not password:
        return resp(code=400, msg="Username/Email or Password not provided!")
    
    # Retrieves the user from the DB if the user exists
    userFromDB = DBQuery(select = f"select username, avatar, password from accounts where username='{username_email}' or email='{username_email}'", oneRow = True)
    
    # Checks user is not null/none
    if userFromDB:

        # Checks password is matches the password stored for the user
        if verifyPw(password, userFromDB['password']) == True:

            # Generates a refresh and access token for the user with their username embedded within
            refresh_token = create_refresh_token(identity=userFromDB['username'])
            access_token = create_access_token(identity=userFromDB['username'])

            # Stores the latest access and refresh token generated for the user in the DB with a datetime stamp and a session start timestamp
            data = DBQuery(modify = f"Update accounts set access_token='{access_token}', refresh_token='{refresh_token}', datetimeLastLogin=CURRENT_TIMESTAMP(), sessionStart=CURRENT_TIMESTAMP() where username='{userFromDB['username']}'")
            
            # Confirms the above ran without error
            if data != False:
                
                # Returns an access and refresh token along with the users username and avatar
                return resp(data={"access_token": access_token, "refresh_token": refresh_token, "username": userFromDB['username'], "avatar": f"http://localhost:5000/static/profileImages/{userFromDB['avatar']}"}, code=200, msg="token request successful")
            
            # If there was an issue storing the latest tokens and timestamps the login will fail and return a failur message
            return resp(code=400, msg="Issue logging in, Please try again.")

    # If the username cannot be found or the password is incorrect the login will fail an return a failure message        
    return resp(code=400, msg="Incorrect username and/or password!")

@app.route('/get_todos', methods=['POST'])
@jwt_refresh_token_required
def get_todos():
    current_user = get_jwt_identity()
    data = DBQuery(select = f"select datetimeEntered, datetimeForReminder, datetimeModified, id, remindMe, todoContent, todoTitle from todos where accountID=(select id from accounts where username='{current_user}')", allRows=True)
    if data != False:
        return resp(data=data, code=200, msg="query successful")

@app.route('/updateTodo', methods=['POST'])
@jwt_refresh_token_required
def save_todos():
    curr_user = get_jwt_identity()
    todoID = request.json.get('id')
    todoContent = request.json.get('content')
    todoTitle = request.json.get('title')
    reminderDateTime = request.json.get('datetimeForReminder')
    reminder = request.json.get('reminde')
    if todoID and reminder:
        if DBQuery(modify = f"update todos set datetimeForReminder={reminderDateTime}, datetimeModified=CURRENT_TIMESTAMP(), remindMe={reminder}, todoContent='{todoContent}', todoTitle='{todoTitle}' where id='{todoID}'") != False:
            return resp(code=200, msg="updates saved")
    elif todoID:
        if DBQuery(modify = f"update todos set datetimeModified=CURRENT_TIMESTAMP(), remindMe=0, todoContent='{todoContent}', todoTitle='{todoTitle}' where id='{todoID}'") != False:
            return resp(code=200, msg="updates saved")
    else:
        return resp(code=500, msg="error saving update")

@app.route('/saveTodo', methods=['POST'])
@jwt_refresh_token_required
def save_todo():
    todoContent = request.json.get('content');
    datetimeModified = request.json.get('datetimeModified');
    remindMe = request.json.get('remindMe');
    datetimeForReminder = request.json.get('datetimeForReminder');
    todoTitle = request.json.get('todoTitle');
    accountID = request.json.get('accountID');

    if DBQuery(modify = f"INSERT INTO todos (todoContent, datetimeEntered, datetimeModified, remindMe, datetimeForReminder, todoTitle, accountID) VALUES ('{request.json.get('todoContent')}',CURRENT_timestamp(),CURRENT_timestamp(),{0},CURRENT_timestamp(),'{request.json.get('todoTitle')}','{request.json.get('accountID')}')") == False:
        return resp(code=500, msg="error adding todo")
    return resp(code=200, msg="todo added")

@app.route('/getAccountData', methods=['POST'])
@jwt_required
def getAccountData():
    current_user = get_jwt_identity()
    acc = DBQuery(select = f"select username,avatar, datetimeLastLogin, datetimeRegistration, email, firstname, lastname from accounts where username='{current_user}'", oneRow = True)
    if acc != False:
        return resp(data=acc, code=200)
    return resp(code=400, msg="Error occured, Please try again later!")

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
                return resp(data={"avatar": f"http://localhost:5000/static/profileImages/{data['avatar']}"}, code=200, msg="avatar added/updated")
            else:
                return resp(code=500, msg="error adding/updating avatar")