## Simple Notes App
Simple notes app I created to learn, Add, edit delete notes. Useable offline but does need to periodically sync with the backend - ths however is configurable by the user.

### Backend
Written in Python using the Flask framework, Authentication is done via JWT.

### Frontend
Written in JS using the React, Redux, React-Redux, Redux-Thunk, Styled-Components, Framer-Motion(Like just one thing, not really needed), Reach-Router.

Backend communicates with a SQL instance with the following schema:

DB: noteapp:{
      notes:{
        id
        body
        timeStampEntered
        timeStampModified
        title
        user
      } 
      users:{
        id
        email
        username
        firstname
        lastname
        timeStampRegistration
        timeStampLastLogin
        avatar
        access_token
        refresh_token
        timeStampSessionStart
        password
      }
    }

### Configurables

UPLOAD_FOLDER - Folder where avatar images are stored.
ALLOWED_EXTENSION - Allowed avatar image extensions
secret_key - key used by JWT
