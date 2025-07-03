import streamlit as st
import firebase_admin

import pyrebase


firebaseConfig = {
    "apiKey": st.secrets["firebase"]["apiKey"],
    "authDomain": st.secrets["firebase"]["authDomain"],
    "projectId": st.secrets["firebase"]["projectId"],
    "storageBucket": st.secrets["firebase"]["storageBucket"],
    "messagingSenderId": st.secrets["firebase"]["messagingSenderId"],
    "appId": st.secrets["firebase"]["appId"],
    "measurementId": st.secrets["firebase"]["measurementId"],
    "databaseURL": st.secrets["firebase"]["databaseURL"]
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

def app():

    st.title("Welcome to QuickMath!")

    choice = st.selectbox('Log in / Sign up', ['Log in', 'Sign Up'])

    def clear_inputs():
        st.session_state.email_input = ""
        st.session_state.password_input = ""
        st.session_state.username_input = ""

    def login():
        try:
            user = auth.sign_in_with_email_and_password(st.session_state.email_input, st.session_state.password_input)
            st.session_state["user"] = {
                "email": st.session_state.email_input,
                "idToken": user["idToken"],  # You can use this for secure calls
                "uid": user["localId"]        # Equivalent to Firebase UID
            }
            st.success("Login Successful")
            clear_inputs()
        except:
            st.warning("Login failed. Check email or password.")
            clear_inputs()

    def signup():
        try:
            user = auth.create_user_with_email_and_password(
                st.session_state.email_input,
                st.session_state.password_input
            )
            st.success("Account created successfully! Please log in.")
            st.balloons()
            clear_inputs()
        except Exception as e:
            st.error("Sign-up failed. Try a different email or stronger password.")
            st.text(str(e))
            clear_inputs()

    if choice == 'Log in':
        email = st.text_input('Email Address:', key="email_input")
        password = st.text_input('Password:', type='password', key="password_input")
        st.button('Log in', on_click=login)
    else:
        email = st.text_input('Email Address:', key="email_input")
        password = st.text_input('Password:', type='password', key="password_input")
        username = st.text_input('Nickname: ', key="username_input")
        st.button('Create my account', on_click=signup)

    if "user" in st.session_state:
        st.success("Welcome!")
app()