import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json

from google.cloud import firestore
from google.oauth2 import service_account

if "user" not in st.session_state:
    st.warning("Please log in.")
    st.stop()

st.title("Data Visualization")

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

uid = st.session_state["user"]["uid"]
results_ref = db.collection("users").document(uid).collection("quiz_results")
docs = results_ref.stream()
data = [doc.to_dict() for doc in docs]
df = pd.DataFrame(data)

difficulty = st.selectbox("Select difficulty", ["Easy", "Medium", "Hard"])



if not df.empty:
    df = df[df["difficulty"] == difficulty]

    if not df.empty:
        df = df.sort_values("timestamp").reset_index(drop=True)
        df["Attempt"] = df.index + 1

        fig1, ax1 = plt.subplots()
        ax1.plot(df["Attempt"], df["accuracy"], marker="o")
        ax1.set_title(f"Accuracy by Attempt - {difficulty}")
        ax1.set_xlabel("Attempt #")
        ax1.set_ylabel("Accuracy")
        st.pyplot(fig1)

        fig2, ax2 = plt.subplots()
        ax2.plot(df["Attempt"], df["average_time_per_question"], marker="o")
        ax2.set_title(f"Average Speed by Attempt - {difficulty}")
        ax2.set_xlabel("Attempt #")
        ax2.set_ylabel("Average speed per question (Seconds)")
        st.pyplot(fig2)
    
    else:
        st.write("No quiz results found")

else:
    st.write("No quiz results found")

