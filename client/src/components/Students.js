import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Students.css'; 

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    date_of_birth: '',
    email: ''
  });
  const [updateStudent, setUpdateStudent] = useState({
    student_id: '',
    name: '',
    date_of_birth: '',
    email: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Failed to fetch students.');
      setMessageType('error');
    }
  };

  // Add new student
  const addStudent = async () => {
    if (!newStudent.name || !newStudent.date_of_birth || !newStudent.email) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/add-student', newStudent);
      fetchStudents();
      setNewStudent({ name: '', date_of_birth: '', email: '' });
      setMessage('Student added successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error adding student:', error);
      setMessage('Failed to add student.');
      setMessageType('error');
    }
  };

  // Update student
  const updateExistingStudent = async () => {
    if (!updateStudent.name || !updateStudent.date_of_birth || !updateStudent.email) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      await axios.put('http://localhost:5000/update-student', updateStudent);
      fetchStudents();
      setEditMode(false);
      setUpdateStudent({ student_id: '', name: '', date_of_birth: '', email: '' });
      setMessage('Student updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating student:', error);
      setMessage('Failed to update student.');
      setMessageType('error');
    }
  };

  // Delete student
  const deleteStudent = async (student_id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-student/${student_id}`);
      fetchStudents();
      setMessage('Student deleted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessage('Failed to delete student.');
      setMessageType('error');
    }
  };

  // Handle edit click
  const handleEditClick = (student) => {
    setUpdateStudent(student);
    setEditMode(true);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container">
      <h2>Manage Students</h2>

      {/* Display Message */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Add Student */}
      <div className="form-container">
        <h3>Add Student</h3>
        <div className="input-field">
          <input
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
        </div>
        <div className="input-field">
          <input
            type="date"
            placeholder="Date of Birth"
            value={newStudent.date_of_birth}
            onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
          />
        </div>
        <div className="input-field">
          <input
            type="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          />
        </div>
        <button onClick={addStudent}>Add Student</button>
      </div>

      {/* Update Student */}
      {editMode && (
        <div className="form-container">
          <h3>Update Student</h3>
          <div className="input-field">
            <input
              type="text"
              placeholder="Student ID"
              value={updateStudent.student_id}
              onChange={(e) => setUpdateStudent({ ...updateStudent, student_id: e.target.value })}
              disabled
            />
          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="Name"
              value={updateStudent.name}
              onChange={(e) => setUpdateStudent({ ...updateStudent, name: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              type="date"
              placeholder="Date of Birth"
              value={updateStudent.date_of_birth}
              onChange={(e) => setUpdateStudent({ ...updateStudent, date_of_birth: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={updateStudent.email}
              onChange={(e) => setUpdateStudent({ ...updateStudent, email: e.target.value })}
            />
          </div>
          <button onClick={updateExistingStudent} className="update-button">Update Student</button>
        </div>
      )}

      {/* View Students */}
      <div>
        <h3>Students List</h3>
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.name}</td>
                <td>{student.date_of_birth}</td>
                <td>{student.email}</td>
                <td>
                  <button onClick={() => handleEditClick(student)} className="update-button">Update</button>
                  <button onClick={() => deleteStudent(student.student_id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
