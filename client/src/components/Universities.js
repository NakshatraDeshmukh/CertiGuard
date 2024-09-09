import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Universities.css'; 

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [newUniversity, setNewUniversity] = useState({ uniname: '', location: '' });
  const [updateUniversity, setUpdateUniversity] = useState({ university_id: '', uniname: '', location: '' });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  // Add new university
  const addUniversity = async () => {
    if (!newUniversity.uniname || !newUniversity.location) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/add-university', newUniversity);
      fetchUniversities();
      setNewUniversity({ uniname: '', location: '' });
      setMessage('University added successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error adding university:', error);
      setMessage('Failed to add university.');
      setMessageType('error');
    }
  };

  // Update university
  const updateExistingUniversity = async () => {
    if (!updateUniversity.uniname || !updateUniversity.location) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      await axios.put('http://localhost:5000/update-university', updateUniversity);
      fetchUniversities();
      setEditMode(false);
      setUpdateUniversity({ university_id: '', uniname: '', location: '' });
      setMessage('University updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating university:', error);
      setMessage('Failed to update university.');
      setMessageType('error');
    }
  };

  // Delete university
  const deleteUniversity = async (university_id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-university/${university_id}`);
      fetchUniversities();
      setMessage('University deleted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting university:', error);
      setMessage('Failed to delete university.');
      setMessageType('error');
    }
  };

  // Handle edit click
  const handleEditClick = (university) => {
    setUpdateUniversity(university);
    setEditMode(true);
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return (
    <div className="container">
      <h2>Manage Universities</h2>

      {/* Display Message */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Add University */}
      <div className="form-container">
        <h3>Add University</h3>
        <div className="input-field">
          <input
            type="text"
            placeholder="University Name"
            value={newUniversity.uniname}
            onChange={(e) => setNewUniversity({ ...newUniversity, uniname: e.target.value })}
          />
        </div>
        <div className="input-field">
          <input
            type="text"
            placeholder="Location"
            value={newUniversity.location}
            onChange={(e) => setNewUniversity({ ...newUniversity, location: e.target.value })}
          />
        </div>
        <button onClick={addUniversity}>Add University</button>
      </div>

      {/* Update University */}
      {editMode && (
        <div className="form-container">
          <h3>Update University</h3>
          <div className="input-field">
            <input
              type="text"
              placeholder="University ID"
              value={updateUniversity.university_id}
              onChange={(e) => setUpdateUniversity({ ...updateUniversity, university_id: e.target.value })}
              disabled
            />
          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="University Name"
              value={updateUniversity.uniname}
              onChange={(e) => setUpdateUniversity({ ...updateUniversity, uniname: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="Location"
              value={updateUniversity.location}
              onChange={(e) => setUpdateUniversity({ ...updateUniversity, location: e.target.value })}
            />
          </div>
          <button onClick={updateExistingUniversity} className="update-button">Update University</button>
        </div>
      )}

      {/* View Universities */}
      <div>
        <h3>Universities List</h3>
        <table className="universities-table">
          <thead>
            <tr>
              <th>University ID</th>
              <th>University Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((university) => (
              <tr key={university.university_id}>
                <td>{university.university_id}</td>
                <td>{university.uniname}</td>
                <td>{university.location}</td>
                <td>
                  <button onClick={() => handleEditClick(university)} className="update-button">Update</button>
                  <button onClick={() => deleteUniversity(university.university_id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Universities;
