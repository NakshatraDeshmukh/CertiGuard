import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Certificates.css'; 

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateForm, setCertificateForm] = useState({
    certificate_id: '',
    course: '',
    issue_date: '',
    student_id: '',
    university_id: ''
  });
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Toggle between add and update mode

  // Fetch certificates with university and student details
  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/certificates');
      console.log('Fetched certificates data:', response.data); // Debug line
      if (Array.isArray(response.data)) {
        setCertificates(response.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
        setCertificates([]); // Set to empty array if data format is incorrect
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]); // Ensure certificates is an array
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setCertificateForm({ ...certificateForm, [e.target.name]: e.target.value });
  };

  // Add new certificate
  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-certificate', certificateForm);
      alert('Certificate added successfully');
      setCertificateForm({
        certificate_id: '',
        course: '',
        issue_date: '',
        student_id: '',
        university_id: ''
      });
      fetchCertificates(); // Refresh list after adding
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Failed to add certificate');
    }
  };

  // Update certificate
  const handleUpdateCertificate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/update-certificate`, certificateForm);
      alert('Certificate updated successfully');
      setCertificateForm({
        certificate_id: '',
        course: '',
        issue_date: '',
        student_id: '',
        university_id: ''
      });
      setIsUpdateMode(false); // Switch back to add mode
      fetchCertificates(); // Refresh list after updating
    } catch (error) {
      console.error('Error updating certificate:', error);
      alert('Failed to update certificate');
    }
  };

  // Function to delete certificate
  const deleteCertificate = async (certificateId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-certificate/${certificateId}`);
      alert('Certificate deleted successfully');
      fetchCertificates(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate');
    }
  };

  // Select certificate to update (populate form with existing data)
  const selectCertificateToUpdate = (certificate) => {
    setCertificateForm({
      certificate_id: certificate.certificate_id,
      course: certificate.course,
      issue_date: certificate.issue_date,
      student_id: certificate.student.student_id,
      university_id: certificate.university.university_id
    });
    setIsUpdateMode(true); // Switch to update mode
  };

  return (
    <div className="certificates-container">
      <h2>{isUpdateMode ? 'Update Certificate' : 'Add Certificate'}</h2>
      <form onSubmit={isUpdateMode ? handleUpdateCertificate : handleAddCertificate} className="certificate-form">
        <table className="form-table">
          <tbody>
            <tr>
              <td>Course:</td>
              <td><input type="text" name="course" value={certificateForm.course} onChange={handleChange} className="form-input" required /></td>
              <td>Issue Date:</td>
              <td><input type="date" name="issue_date" value={certificateForm.issue_date} onChange={handleChange} className="form-input" required /></td>
              <td>Student ID:</td>
              <td><input type="text" name="student_id" value={certificateForm.student_id} onChange={handleChange} className="form-input" required /></td>
            </tr>
            <tr>
              <td>University ID:</td>
              <td><input type="text" name="university_id" value={certificateForm.university_id} onChange={handleChange} className="form-input" required /></td>
              <td colSpan="4">
                <button type="submit" className="submit-button">
                  {isUpdateMode ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <h2>Certificates List</h2>
      <table className="certificates-table">
        <thead>
          <tr>
            <th>Certificate ID</th>
            <th>Course</th>
            <th>Issue Date</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Student DOB</th>
            <th>Student Email</th>
            <th>University ID</th>
            <th>University Name</th>
            <th>University Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length === 0 ? (
            <tr><td colSpan="8">No certificates available</td></tr>
          ) : (
            certificates.map((certificate) => (
              <tr key={certificate.certificate_id}>
                <td>{certificate.certificate_id}</td>
                <td>{certificate.course}</td>
                <td>{certificate.issue_date}</td>
                <td>{certificate.student.student_id}</td>
                <td>{certificate.student.name}</td>
                <td>{certificate.student.date_of_birth}</td>
                <td>{certificate.student.email}</td>
                <td>{certificate.university.university_id}</td>
                <td>{certificate.university.uniname}</td>
                <td>{certificate.university.location}</td>
                <td>
                  <div className="button-container">
                    <button onClick={() => selectCertificateToUpdate(certificate)} className="update-button">Update</button>
                    <button onClick={() => deleteCertificate(certificate.certificate_id)} className="delete-button">Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Certificates;
