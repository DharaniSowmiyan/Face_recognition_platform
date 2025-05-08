# Face Recognition Platform with Real-Time AI Q&A using RAG
This project is a Face Recognition System with a modern React frontend and Python backend. It allows student registration, face capture, training a recognition model, and marking attendance using real-time webcam-based face recognition. A chatbot powered by openAI GPT and LangChain is integrated to answer queries about student registration and attendance.

# Architecture diagram
![2025-05-08 (3)](https://github.com/user-attachments/assets/d47a0428-2582-4706-929c-9e069285f75e)

# What’s Special in my Face Recognition System?
1.Integrated Chatbot with AI (OpenAI + LangChain):

It includes a chatbot that uses OpenAI and LangChain to answer natural language questions about student registration and attendance. This is a modern, AI-powered feature not found in most basic attendance systems.

2.Automatic Database Management:

The system automatically creates and manages an SQLite database for both registration and scanning, making it easy to deploy and use without manual setup.

3.Password Protection for Training:

Training the face recognizer is protected by a password, adding a layer of security to prevent unauthorized retraining.

4.Real-Time Attendance Logging:

Attendance is marked in real-time using face recognition, and the latest records are displayed instantly in the UI.

5.Easy Data Viewing:

The attendance log is shown in a table with scroll support, making it easy to review recent records.

6.Contact and Help Features:

Built-in options for password change and contacting support directly from the app.

7.Extensible and Modern Tech Stack:

Uses modern libraries like HuggingFace for embeddings, FAISS for vector search, and OpenAI GPT for AI chat, making it future-proof and extensible.

(Output Screenshots)
# Main page
![Screenshot 2025-05-08 084135](https://github.com/user-attachments/assets/2ab4477c-063b-48d5-b71d-69255c5a615f)

# Register Faces
![Screenshot 2025-05-08 084354](https://github.com/user-attachments/assets/721648a8-faff-4df7-a4e0-e22239412df3)

# This is the page to register
![Screenshot 2025-05-08 084709](https://github.com/user-attachments/assets/7c1ef6a8-a5a0-403b-ba62-edadaeced041)

# say we are registering a person,we have to provide their ID and Name..Then we select Take images
![Screenshot 2025-05-08 084819](https://github.com/user-attachments/assets/d3601b46-bed4-4f11-827a-11b81909bf03)

# For security purpose,the registering person should enter a password
![Screenshot 2025-05-08 084904](https://github.com/user-attachments/assets/e5f633ce-86e4-4cd2-9e18-1d04243be34d)

# We can see that the newly registered person's name added to the list
![Screenshot 2025-05-08 085129](https://github.com/user-attachments/assets/3fb8fc7e-9b6f-4d43-98e1-4768b55e21b0)

# If we want to delete it,we can do
![Screenshot 2025-05-08 085210](https://github.com/user-attachments/assets/aca7369a-09c4-435b-93ea-599278d8c742)

# Live Recognition
![Screenshot 2025-05-08 084446](https://github.com/user-attachments/assets/5ef83cb5-5e78-4b7b-a4f0-70452a822220)

# Shows the previous log
![Screenshot 2025-05-08 085236](https://github.com/user-attachments/assets/f1575e5b-b7f8-483e-bf7b-3549c1159d58)

# Live webcam previewed for scanning
![Screenshot 2025-05-08 085817](https://github.com/user-attachments/assets/8dffb681-a64a-465c-9eec-4fc15e54b13b)

# Now we can see that,the recent scanned person's profile has added to the log
![Screenshot 2025-05-08 090100](https://github.com/user-attachments/assets/06bdc8b7-bef0-4741-a9d0-44cdea3d18ab)


# Face Query Chat
![Screenshot 2025-05-08 084631](https://github.com/user-attachments/assets/f0309f4b-170b-415c-a594-3012b4dd62e0)

# This is the interface for quering
![Screenshot 2025-05-08 090159](https://github.com/user-attachments/assets/f09f3178-0727-4ccf-a3bd-42c3f36bcbf4)

# say,if we want the person who scanned recently
![Screenshot 2025-05-08 090223](https://github.com/user-attachments/assets/78947d23-3733-4f9d-b036-bc02ee06d08b)

# say,When a person scanned previously?
![Screenshot 2025-05-08 090421](https://github.com/user-attachments/assets/d3a0ece0-d3ad-497a-bdb3-cd6fc9b63d35)

# say,total number of registers done?
![Screenshot 2025-05-08 090501](https://github.com/user-attachments/assets/0e4d49e8-2b73-40b3-ae01-363a29f44c0d)

# I have added a help menu also for smoother user experience
![Screenshot 2025-05-08 091018](https://github.com/user-attachments/assets/2f9ae0d2-fbd7-419d-93b2-b92b6249099b)

# For changing the password
![Screenshot 2025-05-08 090958](https://github.com/user-attachments/assets/35a4f8d7-b0d3-4958-8d63-50d14549b1a2)

# For furthur contact
![Screenshot 2025-05-08 091043](https://github.com/user-attachments/assets/0de39ed3-4991-426f-8784-3a3a531cfc4f)

# Features
Registration: Register new person with ID and name, and capture their face images. 

Face Training: Train a face recognizer model using the captured images.

Attendance Marking: Mark attendance by scanning faces in real-time.

Attendance Log: View recent attendance records in a table.

Password Protection: Secure training with a password.

Chatbot: Ask questions about registration and attendance using natural language.

Contact & Help: Easy access to support and password change.

# Tools and Technologies Used
(Backend)
Flask – Lightweight web framework for building APIs.

Flask-CORS – Enables cross-origin resource sharing for seamless frontend-backend interaction.

OpenCV (opencv-contrib-python) – For real-time face detection and recognition.

Pillow – For image processing and manipulation.

NumPy & Pandas – For numerical computations and data handling.

Datetime & Times – For managing timestamps and date operations.

(Face Recognition & AI)
tk-tools – Utility package for simplified computer vision tasks.

LangChain Community – Framework for building applications with LLMs using composable modules.

tiktoken – Tokenizer for OpenAI models.

Google Generative AI (Gemini) – Used for LLM-powered chatbot interaction.

Sentence-Transformers – For semantic similarity and vector embeddings in the RAG pipeline.

(Chatbot & RAG System)
LangChain – Orchestrates Retrieval-Augmented Generation workflows.

Google Generative AI – Provides LLM capabilities for answering queries.

Sentence-Transformers – Used in vector similarity search.

(Frontend)
React.js – Interactive user interface for registration, scanning, and chat.
====================================================================================================================================================================================================================
"This project is a part of a hackathon run by https://katomaran.com"
