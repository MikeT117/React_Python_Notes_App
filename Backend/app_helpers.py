from functools import wraps
from flask import g, request, make_response, json
import pymysql
import os, hashlib, binascii


# Function to query DB
def queryDB(oneRow=False, allRows=False, modify=False, query=None, queryTerms=None):
  conn = pymysql.connect(host='sql.internal.razor116.com', user='michael',passwd='sqlpassword', db='noteapp', cursorclass=pymysql.cursors.DictCursor)  
  if queryTerms == None or query == None:
    return False
  try:
    with conn.cursor() as cursor:
      cursor.execute(query, queryTerms)
      # Debugging #
      print(cursor._last_executed)
      # Debugging #
      if allRows:
        return cursor.fetchall()
      elif oneRow:
        return cursor.fetchone()
      elif modify:
        conn.commit()
        return True
  except pymysql.Error as e:
    print(f"Error {e.args[0]} - {e.args[1]}")
    cursor.close()
    return False
  return False

# Hashes the PW with a randomly generated salt
def hashPw(pw, salt = hashlib.sha512(os.urandom(60)).hexdigest().encode('ascii')):
  pwdhash = hashlib.pbkdf2_hmac('sha512', pw.encode('utf-8'), salt, 100000)
  pwdhash = binascii.hexlify(pwdhash)
  return (salt + pwdhash).decode('ascii')

# Hashes the pw1 using the salt from pw2 and compares thew result to pw2
def verifyPw(pw, pw2):
  if hashPw(pw, pw2[:128].encode('ascii')) == pw2:
    return True
  return False


# Defines allowed filetypes for upload
def allowedFile(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['jpg','jpeg','png','gif']


# Response function to create predefined response with variable data, msg and HTNL response code.
def resp(data = {}, code = 200, msg = ""):
  return make_response((json.dumps(data)), f"{code} {msg}",{
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
  });


# Decorator for routes to check for valid json, return response if invalid JSON
def is_json(f):
  @wraps(f)
  def wrapper(*args, **kwargs):
    if not request.is_json:
      return make_response(json.dumps({}), f"400 Invalid JSON request!")
    return f(*args, **kwargs)
  return wrapper