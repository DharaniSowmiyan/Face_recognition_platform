# chatbot.py

import sqlite3
import google.generativeai as genai
from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings  


# 1. Configure Gemini
genai.configure(api_key="AIzaSyBpufiSjOShS5gFj9RsbdgbJQwG_ux1TQg")
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# 2. Load data from SQLite
def load_student_data():
    conn = sqlite3.connect("FaceRecog.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Students")
    rows = cursor.fetchall()
    conn.close()

    documents = []
    for row in rows:
        try:
            content = f"Serial No: {row[0]}, ID: {row[1]}, Name: {row[2]}, Date: {row[3]}, Time: {row[4]}"
        except IndexError:
            content = ", ".join([str(i) for i in row])
        documents.append(Document(page_content=content))
    return documents

# 3. Embedding model using HuggingFace
def build_vector_store(documents):
    embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.from_documents(documents, embedder)
    db.save_local("faiss_index")
    return db

def load_vector_store():
    embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local("faiss_index", embedder,allow_dangerous_deserialization=True)

# 4. Load data and vector store
documents = load_student_data()
build_vector_store(documents)
db = load_vector_store()
'''
import os
import shutil

# Remove old FAISS index (folder)
shutil.rmtree("faiss_index", ignore_errors=True)

# Then call your functions again
documents = load_student_data()
build_vector_store(documents)
db = load_vector_store()

'''
# 5. Chat function
import sqlite3
import re
from datetime import date
from langchain.schema import Document

def extract_name_from_query(query):
    # Simple name extraction using capitalized words
    words = re.findall(r'\b[A-Z][a-z]+\b', query)
    ignore_words = {"What", "When", "Where", "Did", "Was", "Is", "Who", "At", "Time"}
    names = [word for word in words if word not in ignore_words]
    return names[0] if names else None

def chat(query, top_k=3):
    conn = sqlite3.connect("FaceRecog.db")
    cursor = conn.cursor()

    query_lower = query.lower()
    student_name = extract_name_from_query(query)
    today = date.today().strftime("%d-%m-%Y")


    context_lines = []

    if any(word in query_lower for word in ["register", "enroll", "add", "join", "student", "id"]):
        if student_name:
            cursor.execute("SELECT * FROM Students WHERE LOWER(name) = ?", (student_name.lower(),))
        else:
            cursor.execute("SELECT * FROM Students")
        rows = cursor.fetchall()
        for row in rows:
            context_lines.append(f"Serial No: {row[0]}, ID: {row[1]}, Name: {row[2]}, Date: {row[3]}, Time: {row[4]}")

    elif any(word in query_lower for word in ["scan", "attendance", "present", "absent", "time", "marked"]):
        if "today" in query_lower:
            if student_name:
                cursor.execute("""
                    SELECT a.id, s.student_id, s.name, a.date, a.time
                    FROM Attendance a
                    JOIN Students s ON a.student_id = s.student_id
                    WHERE a.date = ? AND LOWER(s.name) = ?
                """, (today, student_name.lower()))
            else:
                cursor.execute("""
                    SELECT a.id, s.student_id, s.name, a.date, a.time
                    FROM Attendance a
                    JOIN Students s ON a.student_id = s.student_id
                    WHERE a.date = ?
                """, (today,))
        elif student_name:
            cursor.execute("""
                SELECT a.id, s.student_id, s.name, a.date, a.time
                FROM Attendance a
                JOIN Students s ON a.student_id = s.student_id
                WHERE LOWER(s.name) = ?
            """, (student_name.lower(),))
        else:
            cursor.execute("""
                SELECT a.id, s.student_id, s.name, a.date, a.time
                FROM Attendance a
                JOIN Students s ON a.student_id = s.student_id
            """)
        rows = cursor.fetchall()
        for row in rows:
            context_lines.append(f"Serial No: {row[0]}, ID: {row[1]}, Name: {row[2]}, Date: {row[3]}, Time: {row[4]}")

    else:
        # fallback to vector search
        docs = db.similarity_search(query, k=top_k)
        context_lines = [doc.page_content for doc in docs]

    conn.close()

    context = "\n".join(context_lines) if context_lines else "No records found."

    prompt = f"""
    You are an AI assistant that answers questions about student registration and attendance records.

    ### User Query:
    "{query}"

    ### Extracted Records:
    {context}

    ### Instructions:
    1. Answer the user's question **only** using the extracted records provided above.
    2. **Do not invent** any names, dates, or times.
    3. If the answer is not found in the extracted records, respond with: "No exact match found in current records."
    4. Present the answer clearly and simply.
    5. Avoid technical terms or database field names unless needed.
    """

    response = gemini_model.generate_content(prompt)
    return response.text if response else "Could not generate a response."



