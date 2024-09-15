pragma solidity ^0.8.0;

contract CertiGuard {
    struct Certificate {
        uint256 certificateId;
        uint256 studentId;
        string studentName;
        string studentDOB;
        string studentEmail;
        string course;
        uint256 issueDate;
        uint256 universityId;
        string universityName;
        string universityLocation;
        string certificateHash; 
        bool isValid;
    }

    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCount;

    event CertificateCreated(
        uint256 certificateId,
        uint256 studentId,
        string studentName,
        string studentDOB,
        string studentEmail,
        string course,
        uint256 issueDate,
        uint256 universityId,
        string universityName,
        string universityLocation,
        string certificateHash 
    );

    event CertificateVerified(
        uint256 certificateId,
        uint256 studentId,
        string studentName,
        string studentDOB,
        string studentEmail,
        string course,
        uint256 issueDate,
        uint256 universityId,
        string universityName,
        string universityLocation,
        bool valid
    );

    function addCertificate(
        uint256 _studentId,
        string memory _studentName,
        string memory _studentDOB,
        string memory _studentEmail,
        string memory _course,
        uint256 _issueDate,
        uint256 _universityId,
        string memory _universityName,
        string memory _universityLocation,
        string memory _certificateHash 
    ) public {
        certificateCount++;
        certificates[certificateCount] = Certificate(
            certificateCount,
            _studentId,
            _studentName,
            _studentDOB,
            _studentEmail,
            _course,
            _issueDate,
            _universityId,
            _universityName,
            _universityLocation,
            _certificateHash, 
            true
        );
        emit CertificateCreated(
            certificateCount,
            _studentId,
            _studentName,
            _studentDOB,
            _studentEmail,
            _course,
            _issueDate,
            _universityId,
            _universityName,
            _universityLocation,
            _certificateHash 
        );
    }

    function verifyCertificate(uint256 _certificateId) public view returns (bool) {
        Certificate memory cert = certificates[_certificateId];
        bool isValid = cert.isValid;
        emit CertificateVerified(
            _certificateId,
            cert.studentId,
            cert.studentName,
            cert.studentDOB,
            cert.studentEmail,
            cert.course,
            cert.issueDate,
            cert.universityId,
            cert.universityName,
            cert.universityLocation,
            isValid
        );
        return isValid;
    }
}
