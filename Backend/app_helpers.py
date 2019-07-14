from functools import wraps
from flask import g, request, make_response, json
import pymysql
import os, hashlib, binascii

def DBQuery(modify = None, select = None, allRows = False, oneRow = False):
  conn = pymysql.connect(host='sql.internal.razor116.com', user='michael',passwd='sqlpassword', db='noteapp', cursorclass=pymysql.cursors.DictCursor)
  try:
    with conn.cursor() as cursor:
      if modify:
        cursor.execute(modify)
        conn.commit()
      if select:
        cursor.execute(select)
        if allRows:
          return cursor.fetchall()
        if oneRow:
          return cursor.fetchone()
      else:
        return True
  except pymysql.Error as e:
    print(f"Error {e.args[0]} - {e.args[1]}")
    cursor.close()
    return False

def hashPw(pw, salt = hashlib.sha512(os.urandom(60)).hexdigest().encode('ascii')):
  pwdhash = hashlib.pbkdf2_hmac('sha512', pw.encode('utf-8'), salt, 100000)
  pwdhash = binascii.hexlify(pwdhash)
  return (salt + pwdhash).decode('ascii')

def verifyPw(pw, pw2):
  if hashPw(pw, pw2[:128].encode('ascii')) == pw2:
    return True
  return False

def allowedFile(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['jpg','jpeg','png','gif']

def resp(data = {}, code = 200, msg = ""):
  return make_response((json.dumps(data)), f"{code} {msg}",{
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
  });
