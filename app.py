from flask import Flask
from flask_cors import CORS  
import mysql.connector
from flask import request, jsonify
import hashlib


app = Flask(__name__)
CORS(app)  

cursor = None
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1121",
        database="certigaurd"
    )
 
    cursor = db.cursor()
    print("Connected to the database successfully!")
except mysql.connector.Error as err:
    print(f"Database connection failed with error: {err}")
    cursor = None  # Setting cursor to None if the connection fails



@app.route('/')
def home():
    return "Welcome to CertiGuard!"

@app.route('/test-db')
def test_db():
    if cursor is not None:
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        return str(tables)
    else:
        return "Database connection failed!"

@app.route('/add-student', methods=['POST'])
def add_student():
    data = request.json
    name = data['name']
    date_of_birth = data['date_of_birth']
    email = data['email']

    cursor.execute("""
        INSERT INTO students (name, date_of_birth, email)
        VALUES (%s, %s, %s)
    """, (name, date_of_birth, email))
    
    db.commit()
    return jsonify({"message": "Student added successfully!"})

@app.route('/update-student', methods=['PUT'])
def update_student():
    data = request.json
    student_id = data['student_id']
    name = data.get('name')
    date_of_birth = data.get('date_of_birth')
    email = data.get('email')

    cursor.execute("""
        UPDATE students
        SET name = COALESCE(%s, name),
            date_of_birth = COALESCE(%s, date_of_birth),
            email = COALESCE(%s, email)
        WHERE student_id = %s
    """, (name, date_of_birth, email, student_id))
    
    db.commit()
    return jsonify({"message": "Student updated successfully!"})

@app.route('/delete-student/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    cursor.execute("DELETE FROM students WHERE student_id = %s", (student_id,))
    db.commit()
    return jsonify({"message": "Student deleted successfully!"})

@app.route('/students', methods=['GET'])
def get_students():
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    students_data = [{'student_id': row[0], 'name': row[1], 'date_of_birth': row[2].strftime('%Y-%m-%d'), 'email': row[3]} for row in students]
    return jsonify(students_data)

 
@app.route('/add-university', methods=['POST'])
def add_university():
    data = request.json
    uniname = data['uniname']
    location = data['location']

    cursor.execute("""
        INSERT INTO universities (uniname, location)
        VALUES (%s, %s)
    """, (uniname, location))
    
    db.commit()
    return jsonify({"message": "University added successfully!"})

@app.route('/update-university', methods=['PUT'])
def update_university():
    data = request.json
    university_id = data['university_id']
    uniname = data.get('uniname')
    location = data.get('location')

    cursor.execute("""
        UPDATE universities
        SET uniname = COALESCE(%s, uniname),
            location = COALESCE(%s, location)
        WHERE university_id = %s
    """, (uniname, location, university_id))
    
    db.commit()
    return jsonify({"message": "University updated successfully!"})

@app.route('/delete-university/<int:university_id>', methods=['DELETE'])
def delete_university(university_id):
    cursor.execute("DELETE FROM universities WHERE university_id = %s", (university_id,))
    db.commit()
    return jsonify({"message": "University deleted successfully!"})

@app.route('/universities', methods=['GET'])
def get_universities():
    cursor.execute("SELECT * FROM universities")
    universities = cursor.fetchall()
    universities_data = [{'university_id': row[0], 'uniname': row[1], 'location': row[2]} for row in universities]
    return jsonify(universities_data)





@app.route('/add-certificate', methods=['POST'])
def add_certificate():
    try:
        data = request.json
        student_id = data.get('student_id')
        university_id = data.get('university_id')
        issue_date = data.get('issue_date')
        course = data.get('course')

        # Generating certificate hash
        certificate_string = f"{student_id}{university_id}{issue_date}{course}"
        certificate_hash = hashlib.sha256(certificate_string.encode()).hexdigest()

        cursor.execute("""
            INSERT INTO certificates (student_id, university_id, issue_date, course, certificate_hash)
            VALUES (%s, %s, %s, %s, %s)
        """, (student_id, university_id, issue_date, course, certificate_hash))
        
        db.commit()
        return jsonify({"message": "Certificate added successfully!", "certificate_hash": certificate_hash})
    except Exception as e:
        return jsonify({"error": str(e)}), 500






@app.route('/update-certificate', methods=['PUT'])
def update_certificate():
    data = request.json
    certificate_id = data['certificate_id']
    student_id = data.get('student_id')
    university_id = data.get('university_id')
    issue_date = data.get('issue_date')
    course = data.get('course')

    cursor.execute("""
        UPDATE certificates
        SET student_id = COALESCE(%s, student_id),
            university_id = COALESCE(%s, university_id),
            issue_date = COALESCE(%s, issue_date),
            course = COALESCE(%s, course)
        WHERE certificate_id = %s
    """, (student_id, university_id, issue_date, course, certificate_id))
    
    db.commit()
    return jsonify({"message": "Certificate updated successfully!"})

@app.route('/delete-certificate/<int:certificate_id>', methods=['DELETE'])
def delete_certificate(certificate_id):
    cursor.execute("DELETE FROM certificates WHERE certificate_id = %s", (certificate_id,))
    db.commit()
    return jsonify({"message": "Certificate deleted successfully!"})



@app.route('/certificates', methods=['GET'])
def get_certificates():
    try:
        cursor.execute("""
            SELECT certificates.certificate_id, certificates.course, certificates.issue_date,
                   certificates.certificate_hash,  -- Include certificate_hash
                   students.student_id, students.name, students.date_of_birth, students.email,
                   universities.university_id, universities.uniname, universities.location
            FROM certificates
            JOIN students ON certificates.student_id = students.student_id
            JOIN universities ON certificates.university_id = universities.university_id
        """)

        certificates = cursor.fetchall()
        
        certificates_data = []
        for row in certificates:
            certificate_data = {
                'certificate_id': row[0],
                'course': row[1],
                'issue_date': row[2].strftime('%Y-%m-%d') if row[2] else None,
                'certificate_hash': row[3],  
                'student': {
                    'student_id': row[4],
                    'name': row[5],
                    'date_of_birth': row[6].strftime('%Y-%m-%d') if row[6] else None,
                    'email': row[7]
                },
                'university': {
                    'university_id': row[8],
                    'uniname': row[9],
                    'location': row[10]
                }
            }
            certificates_data.append(certificate_data)

        return jsonify(certificates_data) if certificates_data else jsonify({'message': 'No Data Found'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify-certificate', methods=['POST'])
def verify_certificate():
    data = request.json
    certificate_id = data.get('certificate_id')
    student_id = data.get('student_id')
    university_id = data.get('university_id')

    if not certificate_id or not student_id or not university_id:
        return jsonify({'error': 'Please provide Certificate ID, Student ID, and University ID.'}), 400

    try:
        cursor.execute("""
            SELECT certificate_hash FROM certificates
            WHERE certificate_id = %s
            AND student_id = %s
            AND university_id = %s
        """, (certificate_id, student_id, university_id))
        result = cursor.fetchone()

        if result:
            # Additional checks 
            return jsonify({'valid': True, 'message': 'Certificate is valid.'})
        else:
            return jsonify({'valid': False, 'message': 'Certificate not found or details do not match.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500





@app.route('/student/<int:student_id>', methods=['GET'])
def get_student(student_id):
    try:
        cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()
        if student:
            student_data = {
                'student_id': student[0],
                'name': student[1],
                'date_of_birth': student[2].strftime('%Y-%m-%d') if student[2] else None,
                'email': student[3]
            }
            return jsonify({
                'success': True,
                'data': student_data
            }), 200
        return jsonify({'success': False, 'message': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/university/<int:university_id>', methods=['GET'])
def get_university(university_id):
    try:
        cursor.execute("SELECT * FROM universities WHERE university_id = %s", (university_id,))
        university = cursor.fetchone()
        if university:
            university_data = {
                'university_id': university[0],
                'uniname': university[1],
                'location': university[2]
            }
            return jsonify({
                'success': True,
                'data': university_data
            }), 200
        return jsonify({'success': False, 'message': 'University not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)