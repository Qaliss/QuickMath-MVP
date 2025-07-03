
import streamlit as st
import time
import random

import json
from google.cloud import firestore
from google.oauth2 import service_account
import datetime

if "user" not in st.session_state:
    st.warning("Please log in.")
    st.stop()

def get_db():
    service_account_info = {
        "type": st.secrets["service_account_json"]["type"],
        "project_id": st.secrets["service_account_json"]["project_id"],
        "private_key_id": st.secrets["service_account_json"]["private_key_id"],
        "private_key": st.secrets["service_account_json"]["private_key"].replace("\\n", "\n"),
        "client_email": st.secrets["service_account_json"]["client_email"],
        "client_id": st.secrets["service_account_json"]["client_id"],
        "auth_uri": st.secrets["service_account_json"]["auth_uri"],
        "token_uri": st.secrets["service_account_json"]["token_uri"],
        "auth_provider_x509_cert_url": st.secrets["service_account_json"]["auth_provider_x509_cert_url"],
        "client_x509_cert_url": st.secrets["service_account_json"]["client_x509_cert_url"],
        "universe_domain": st.secrets["service_account_json"]["universe_domain"]
    }


    credentials = service_account.Credentials.from_service_account_info(service_account_info)
    return firestore.Client(credentials=credentials, project=credentials.project_id)

db = get_db()

def save_result(score, total, avg_time, difficulty):
    uid = st.session_state["user"]["uid"]
    user_ref = db.collection("users").document(uid)
    quiz_ref = user_ref.collection("quiz_results").document()
    quiz_ref.set({
        "timestamp": datetime.datetime.now(),
        "score": score,
        "difficulty": difficulty,
        "total": total,
        'accuracy': round(score / total * 100, 2) if total > 0 else 0,
        "average_time_per_question": avg_time,
    })


st.title('QuickMath')

if 'game_started' not in st.session_state:
    st.session_state.game_started = False

difficulty = st.selectbox("Select a difficulty", ["Easy", "Medium", "Hard"])

if not st.session_state.game_started:
    if st.button("Start Game"):
        st.session_state.game_started = True
        st.session_state.difficulty = difficulty
        st.session_state.score = 0
        st.session_state.total = 0
        st.session_state.q = ""
        st.session_state.a = 0
        st.session_state.feedback = ""
        st.session_state.start_time = time.time()
        st.session_state.question_start_time = time.time()
        st.session_state.time_per_question = []

# Game logic
if st.session_state.game_started:

    # Timer logic
    QUIZ_DURATION = 60
    time_elapsed = time.time() - st.session_state.start_time
    time_remaining = int(QUIZ_DURATION - time_elapsed)


    # Creating the questions
    def generateQuestion(mode = "Easy"):
        operator = random.choice(['+', '-', '*'])
        
        if mode == "Easy":
            if operator == '*':
                num1 = random.randint(1, 12)
                num2 = random.randint(1, 12)
            else:
                num1 = random.randint(1, 100)
                num2 = random.randint(1, 100)
        
        elif mode == "Medium":
            if operator == '*':
                num1 = random.randint(1, 12)
                num2 = random.randint(1, 100)
            else:
                num1 = random.randint(1, 1000)
                num2 = random.randint(1, 1000)
        
        elif mode == "Hard":
            if operator == '*':
                num1 = random.randint(1, 100)
                num2 = random.randint(1, 100)
            else:
                num1 = random.randint(1, 10000)
                num2 = random.randint(1, 10000)

        q = f"{num1} {operator} {num2}"
        a = int(eval(q))
        
        st.session_state.q = q
        st.session_state.a = a
        st.session_state.question_start_time = time.time()


    # Only make a new question when needed
    if st.session_state.q == "":
        generateQuestion(mode=st.session_state.difficulty)


    # Clearing logic
    if "user_answer" not in st.session_state:
        st.session_state.user_answer = ""


    # Function to handle submissions
    def submit():
        user_input = st.session_state.widget
        if user_input:
            st.session_state.total += 1
            try:
                if int(user_input.strip()) == st.session_state.a:
                    st.session_state.feedback = "correct"
                    st.session_state.score += 1
                    st.session_state.q = ""
                    st.session_state.a = 0
                    st.session_state.widget = ""  # Clear the input
                    st.session_state.time_per_question.append(time.time() - st.session_state.question_start_time)

                else:
                    st.session_state.feedback = "incorrect"
                    st.session_state.widget = ""  # Clear the input
            except ValueError:
                st.session_state.feedback = "invalid"
                st.session_state.widget = ""  # Clear the input
                st.session_state.total -= 1

    # Game Loop
    if time_remaining > 0:

        st.write("Question: ", st.session_state.q)

        user_input = st.text_input("Answer: ", key="widget", on_change=submit)
        
        st.write(f"Time remaining: {time_remaining} seconds")

        if st.session_state.feedback =="correct":
            st.success("Correct")
            st.session_state.feedback = ""
        elif st.session_state.feedback == "incorrect":
            st.error("Incorrect. Try again.")
            st.session_state.feedback = ""
        elif st.session_state.feedback == "invalid":
            st.warning("Please enter a valid integer.")
            st.session_state.feedback = ""

        if st.session_state.total >= 1:
            st.write(f"Score: {st.session_state.score} / {st.session_state.total}")
            st.write(f"Accuracy: {round(st.session_state.score / st.session_state.total, 2) * 100} %")

        st.empty()

        time.sleep(0.5)
        st.rerun()

    # After game over

    else:
        
        # Final stats
        st.write("Time's Up!")
        st.write(f"Final Score: {st.session_state.score} / {st.session_state.total}")
        st.write(f"Accuracy: {round(st.session_state.score / st.session_state.total, 2) * 100} %")

        avg = round(sum(st.session_state.time_per_question) / len(st.session_state.time_per_question), 2)
        st.write(f"Average time per question: {avg} seconds")

        # Save result to database
        save_result(st.session_state.score, st.session_state.total, avg, st.session_state.difficulty)

        # Restart
        if st.button("Restart Game"):
            st.session_state.game_started = False
            st.rerun()

