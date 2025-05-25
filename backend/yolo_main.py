from flask import Flask, request, jsonify, Response
import cv2, os, sqlite3, numpy as np
from PIL import Image
import datetime
import time
from flask_cors import CORS
from chatbot import chat
import glob
from ultralytics import YOLO
from langchain_community.embeddings import HuggingFaceEmbeddings

app = Flask(__name__)
CORS(app)

yolo_model = YOLO("yolov8m-face.pt")  # Load YOLOv8 face detection model

# --- Utility Functions ---

def assure_path_exists(path):
    dir = os.path.dirname(path)
    if not os.path.exists(dir):
        os.makedirs(dir)

def init_db():
    conn = sqlite3.connect('FaceRecog.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Students (
            serial_no INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            name TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            name TEXT,
            date TEXT,
            time TEXT
        )
    ''')
    conn.commit()
    conn.close()

# --- API Endpoints ---
@app.route('/api/verify_password', methods=['POST'])
def verify_password():
    data = request.json
    password = data.get('password')
    with open("TrainingImageLabel/psd.txt", "r") as f:
        key = f.read()
    if password == key:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error', 'message': 'Wrong password'}), 401
    
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    Id = data.get('id')
    name = data.get('name')
    try:
        assure_path_exists("TrainingImage/")
        init_db()
        if not (name.isalpha() or ' ' in name):
            return jsonify({'status': 'error', 'message': 'Enter Correct Name'}), 400

        conn = sqlite3.connect('FaceRecog.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Students (student_id, name) VALUES (?, ?)", (Id, name))
        conn.commit()
        serial = cursor.lastrowid
        conn.close()

        cam = cv2.VideoCapture(0)
        sampleNum = 0

        while True:
            ret, img = cam.read()
            if not ret or img is None:
                cam.release()
                cv2.destroyAllWindows()
                return jsonify({'status': 'error', 'message': 'Unable to access the camera.'}), 500

            results = yolo_model(img, verbose=False)
            for result in results:
                for box in result.boxes.xyxy:
                    x1, y1, x2, y2 = map(int, box)
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    sampleNum += 1
                    face_img = gray[y1:y2, x1:x2]
                    if face_img.size == 0:
                        continue
                    cv2.imwrite(f"TrainingImage/{name}.{serial}.{Id}.{sampleNum}.jpg", face_img)
            if cv2.waitKey(100) & 0xFF == ord('q') or sampleNum >= 100:
                break

        cam.release()
        cv2.destroyAllWindows()
        return jsonify({'status': 'success', 'message': f'Images Taken for ID : {Id}'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/recognize', methods=['POST'])
def recognize():
    try:
        assure_path_exists("Attendance/")
        init_db()
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        if not os.path.isfile("TrainingImageLabel/Trainner.yml"):
            return jsonify({'status': 'error', 'message': 'Please train the model first!'}), 400
        recognizer.read("TrainingImageLabel/Trainner.yml")

        cam = cv2.VideoCapture(0)
        conn = sqlite3.connect('FaceRecog.db')
        cursor = conn.cursor()
        attendance_records = []

        while True:
            ret, frame = cam.read()
            if not ret or frame is None:
                cam.release()
                cv2.destroyAllWindows()
                return jsonify({'status': 'error', 'message': 'Unable to access the camera.'}), 500

            results = yolo_model(frame, verbose=False)
            for result in results:
                for box in result.boxes.xyxy:
                    x1, y1, x2, y2 = map(int, box)
                    face_crop = frame[y1:y2, x1:x2]
                    if face_crop.size == 0:
                        continue
                    gray_face = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
                    gray_face = cv2.resize(gray_face, (200, 200))
                    serial, conf = recognizer.predict(gray_face)
                    if conf < 50:
                        cursor.execute("SELECT name, student_id FROM Students WHERE serial_no=?", (serial,))
                        data = cursor.fetchone()
                        if data:
                            name, student_id = data
                            ts = time.time()
                            date_str = datetime.datetime.fromtimestamp(ts).strftime('%d-%m-%Y')
                            time_str = datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S')
                            cursor.execute("SELECT * FROM Attendance WHERE student_id=? AND date=?", (student_id, date_str))
                            if not cursor.fetchone():
                                cursor.execute("INSERT INTO Attendance (student_id, name, date, time) VALUES (?, ?, ?, ?)",
                                               (student_id, name, date_str, time_str))
                                conn.commit()
                                attendance_records.append({'id': student_id, 'name': name, 'date': date_str, 'time': time_str})

            if cv2.waitKey(1) & 0xFF == ord('c'):
                break

        cam.release()
        cv2.destroyAllWindows()
        conn.close()
        return jsonify({'status': 'success', 'attendance': attendance_records})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train():
    try:
        assure_path_exists("TrainingImageLabel/")
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        faces, ID = getImagesAndLabels("TrainingImage")
        if not faces or not ID:
            return jsonify({'status': 'error', 'message': 'No Registrations'}), 400
        recognizer.train(faces, np.array(ID))
        recognizer.save("TrainingImageLabel/Trainner.yml")
        return jsonify({'status': 'success', 'message': 'Profile Saved Successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def getImagesAndLabels(path):
    imagePaths = [os.path.join(path, f) for f in os.listdir(path)]
    faces = []
    Ids = []
    for imagePath in imagePaths:
        pilImage = Image.open(imagePath).convert('L')
        imageNp = np.array(pilImage, 'uint8')
        ID = int(os.path.split(imagePath)[-1].split(".")[1])
        faces.append(imageNp)
        Ids.append(ID)
    return faces, Ids

@app.route('/api/students', methods=['GET'])
def students():
    try:
        conn = sqlite3.connect('FaceRecog.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")
        rows = cursor.fetchall()
        conn.close()
        students = [{'serial_no': r[0], 'student_id': r[1], 'name': r[2]} for r in rows]
        return jsonify({'status': 'success', 'students': students})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/attendance', methods=['GET'])
def attendance():
    try:
        conn = sqlite3.connect('FaceRecog.db')
        cursor = conn.cursor()
        cursor.execute("SELECT student_id, name, date, time FROM Attendance ORDER BY id DESC LIMIT 20")
        rows = cursor.fetchall()
        conn.close()
        attendance = [{'student_id': r[0], 'name': r[1], 'date': r[2], 'time': r[3]} for r in rows]
        return jsonify({'status': 'success', 'attendance': attendance})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/change_password', methods=['POST'])
def change_password():
    data = request.json
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    assure_path_exists("TrainingImageLabel/")
    password_file = "TrainingImageLabel/psd.txt"

    if not os.path.isfile(password_file):
        # If password file doesn't exist, set new password
        if not new_password or not confirm_password or new_password != confirm_password:
            return jsonify({'status': 'error', 'message': 'Password not set! Please try again.'}), 400
        with open(password_file, "w") as f:
            f.write(new_password)
        return jsonify({'status': 'success', 'message': 'New password was registered successfully!'})
    else:
        with open(password_file, "r") as f:
            key = f.read()
        if old_password != key:
            return jsonify({'status': 'error', 'message': 'Please enter correct old password.'}), 400
        if new_password != confirm_password:
            return jsonify({'status': 'error', 'message': 'Confirm new password again!'}), 400
        with open(password_file, "w") as f:
            f.write(new_password)
        return jsonify({'status': 'success', 'message': 'Password changed successfully!'})

@app.route('/api/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def gen_frames():
    cam = cv2.VideoCapture(0)
    while True:
        success, frame = cam.read()
        if not success:
            break
        results = yolo_model(frame, verbose=False)
        for result in results:
            for box in result.boxes.xyxy:
                x1, y1, x2, y2 = map(int, box)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cam.release()

@app.route('/api/scan_feed')
def scan_feed():
    return Response(gen_frames_for_scan(), mimetype='multipart/x-mixed-replace; boundary=frame')

def gen_frames_for_scan():
    global scanning
    scanning = True
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    if not os.path.isfile("TrainingImageLabel/Trainner.yml"):
        raise Exception("Please train the model first!")
    recognizer.read("TrainingImageLabel/Trainner.yml")
    cam = cv2.VideoCapture(0)
    conn = sqlite3.connect('FaceRecog.db')
    cursor = conn.cursor()
    already_marked = set()

    while scanning:
        success, frame = cam.read()
        if not success:
            break
        results = yolo_model(frame, verbose=False)
        for result in results:
            for box in result.boxes.xyxy:
                x1, y1, x2, y2 = map(int, box)
                face_crop = frame[y1:y2, x1:x2]
                if face_crop.size == 0:
                    continue
                gray_face = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
                gray_face = cv2.resize(gray_face, (200, 200))
                serial, conf = recognizer.predict(gray_face)
                if conf < 50:
                    cursor.execute("SELECT name, student_id FROM Students WHERE serial_no=?", (serial,))
                    data = cursor.fetchone()
                    if data:
                        name, student_id = data
                        if student_id not in already_marked:
                            ts = time.time()
                            date_str = datetime.datetime.fromtimestamp(ts).strftime('%d-%m-%Y')
                            time_str = datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S')
                            cursor.execute(
                                "INSERT INTO Attendance (student_id, name, date, time) VALUES (?, ?, ?, ?)",
                                (student_id, name, date_str, time_str))
                            conn.commit()
                            already_marked.add(student_id)
                else:
                    name = "Unknown"
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, name, (x1, y2 + 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cam.release()
    conn.close()

@app.route('/api/start_scan', methods=['POST'])
def start_scan():
    global scanning
    scanning = True
    return jsonify({'status': 'started'})

@app.route('/api/stop_scan', methods=['POST'])
def stop_scan():
    global scanning
    scanning = False
    return jsonify({'status': 'stopped'})


@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({'status': 'error', 'message': 'No query provided'}), 400
    try:
        answer = chat(query)
        return jsonify({'status': 'success', 'answer': answer})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/delete_student', methods=['POST'])
def delete_student():
    data = request.json
    student_id = data.get('student_id')
    if not student_id:
        return jsonify({'status': 'error', 'message': 'No student_id provided'}), 400

    try:
        # Get serial_no for this student
        conn = sqlite3.connect('FaceRecog.db')
        cursor = conn.cursor()
        cursor.execute("SELECT serial_no, name FROM Students WHERE student_id=?", (student_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({'status': 'error', 'message': 'Student not found'}), 404
        serial_no, name = row

        # Delete from Students table
        cursor.execute("DELETE FROM Students WHERE student_id=?", (student_id,))
        # Optionally, delete their attendance records too:
        cursor.execute("DELETE FROM Attendance WHERE student_id=?", (student_id,))
        conn.commit()
        conn.close()

        # Delete their images
        image_pattern = f"TrainingImage/{name}.{serial_no}.{student_id}.*.jpg"
        for img_path in glob.glob(image_pattern):
            os.remove(img_path)

        # Retrain the model (optional but recommended)
        # You can call your train function here or set a flag to retrain on next scan
        # For example, call your train() function if you have it as a Python function

        return jsonify({'status': 'success', 'message': 'Student deleted successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)