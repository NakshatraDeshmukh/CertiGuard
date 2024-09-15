import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
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
  const [verificationForm, setVerificationForm] = useState({
    certificate_id: '',
    course: '',
    issue_date: '',
    student_id: '',
    university_id: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);

  // Web3 setup
  const web3 = new Web3(window.ethereum || 'http://localhost:7545'); // Connect to Ethereum node
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "certificateId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "studentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentDOB",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentEmail",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "course",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "universityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "universityName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "universityLocation",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateHash",
          "type": "string"
        }
      ],
      "name": "CertificateCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "certificateId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "studentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentDOB",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentEmail",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "course",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "universityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "universityName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "universityLocation",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "valid",
          "type": "bool"
        }
      ],
      "name": "CertificateVerified",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "certificateCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "certificates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "certificateId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "studentId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "studentDOB",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "studentEmail",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "course",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "universityId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "universityName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "universityLocation",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificateHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_studentId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_studentDOB",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_studentEmail",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_course",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_issueDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_universityId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_universityName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_universityLocation",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_certificateHash",
          "type": "string"
        }
      ],
      "name": "addCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_certificateId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_certificateHash",
          "type": "string"
        }
      ],
      "name": "verifyCertificate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  ;
  const contractAddress = '0xB929D55cdDeD441A47016a72630bf33BC433d658';
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // Fetch certificates with university and student details
  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/certificates');
      if (Array.isArray(response.data)) {
        setCertificates(response.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setCertificateForm({ ...certificateForm, [e.target.name]: e.target.value });
  };

  const handleVerificationChange = (e) => {
    setVerificationForm({ ...verificationForm, [e.target.name]: e.target.value });
  };

  // Adding new certificate
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
        fetchCertificates(); 
    } catch (error) {
        console.error('Error adding certificate:', error);
        alert('Failed to add certificate');
    }
  };

  // Verify certificate
  const handleVerifyCertificate = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:5000/verify-certificate', {
        certificate_id: verificationForm.certificate_id,
        student_id: verificationForm.student_id,
        university_id: verificationForm.university_id
      });
  
      if (response.data.valid) {
        setVerificationResult('Certificate is valid.');
      } else {
        setVerificationResult('Certificate is not valid.');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult('Error verifying certificate.');
    }
  };
  
  return (
    <div className="certificates-container">
      <h2>Add Certificate</h2>
      <form onSubmit={handleAddCertificate} className="certificate-form">
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
                <button type="submit" className="submit-button">Add Certificate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <h2>Verify Certificate</h2>
      <form onSubmit={handleVerifyCertificate} className="certificate-form">
        <table className="form-table">
          <tbody>
            <tr>
              <td>Certificate ID:</td>
              <td><input type="text" name="certificate_id" value={verificationForm.certificate_id} onChange={handleVerificationChange} className="form-input" required /></td>
              <td>Course:</td>
              <td><input type="text" name="course" value={verificationForm.course} onChange={handleVerificationChange} className="form-input" required /></td>
              <td>Issue Date:</td>
              <td><input type="date" name="issue_date" value={verificationForm.issue_date} onChange={handleVerificationChange} className="form-input" required /></td>
            </tr>
            <tr>
              <td>Student ID:</td>
              <td><input type="text" name="student_id" value={verificationForm.student_id} onChange={handleVerificationChange} className="form-input" required /></td>
              <td>University ID:</td>
              <td><input type="text" name="university_id" value={verificationForm.university_id} onChange={handleVerificationChange} className="form-input" required /></td>
              <td colSpan="4">
                <button type="submit" className="submit-button">Verify Certificate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {verificationResult && <p className="verification-result">{verificationResult}</p>}

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
            <th class="hash-column">Certificate Hash</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length === 0 ? (
            <tr><td colSpan="11">No certificates available</td></tr>
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
                <td>{certificate.certificate_hash}</td> {/* Updating column */ }
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Certificates;
