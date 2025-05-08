# streamlit_app.py
import streamlit as st
from chatbot import chat

st.title("FaceTrack Assistant")
query = st.text_input("Ask a question:")

if st.button("Submit") and query:
    response = chat(query)
    st.write("**Answer:**", response)

