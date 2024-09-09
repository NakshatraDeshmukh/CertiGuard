from flask import Flask
from flask_cors import CORS  
import mysql.connector
from flask import request, jsonify


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
    cursor = None  # Set cursor to None if the connection fails



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
    data = request.json
    student_id = data['student_id']
    university_id = data['university_id']
    issue_date = data['issue_date']
    course = data['course']

    cursor.execute("""
        INSERT INTO certificates (student_id, university_id, issue_date, course)
        VALUES (%s, %s, %s, %s)
    """, (student_id, university_id, issue_date, course))
    
    db.commit()
    return jsonify({"message": "Certificate added successfully!"})

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
                'student': {
                    'student_id': row[3],
                    'name': row[4],
                    'date_of_birth': row[5].strftime('%Y-%m-%d') if row[5] else None,
                    'email': row[6]
                },
                'university': {
                    'university_id': row[7],
                    'uniname': row[8],
                    'location': row[9]
                }
            }
            certificates_data.append(certificate_data)

        return jsonify(certificates_data) if certificates_data else jsonify({'message': 'No Data Found'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500








@app.route('/student/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.filter_by(student_id=student_id).first()
    if student:
        return jsonify({
            'success': True,
            'data': {
                'name': student.name,
                'date_of_birth': student.date_of_birth,
                'email': student.email
            }
        }), 200
    return jsonify({'success': False, 'message': 'Student not found'}), 404

@app.route('/university/<int:university_id>', methods=['GET'])
def get_university(university_id):
    university = University.query.filter_by(university_id=university_id).first()
    if university:
        return jsonify({
            'success': True,
            'data': {
                'name': university.uniname,
                'location': university.location
            }
        }), 200
    return jsonify({'success': False, 'message': 'University not found'}), 404







if __name__ == '__main__':
    app.run(debug=True)
