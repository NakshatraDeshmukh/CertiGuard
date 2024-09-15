const CertiGuard = artifacts.require("CertiGuard");
const { assert } = require("chai");

contract("CertiGuard", (accounts) => {
    let certiGuard;

    beforeEach(async () => {
        certiGuard = await CertiGuard.new();
    });

    it("should deploy the contract", async () => {
        assert.ok(certiGuard.address);
    });

    it("should add a certificate", async () => {
        const studentId = 1;
        const studentName = "John Doe";
        const studentDOB = "2000-01-01";
        const studentEmail = "john.doe@example.com";
        const course = "Computer Science";
        const issueDate = Math.floor(Date.now() / 1000); 
        const universityId = 101;
        const universityName = "Example University";
        const universityLocation = "Example City";
        const certificateHash = web3.utils.sha3("example certificate hash");

        const receipt = await certiGuard.addCertificate(
            studentId,
            studentName,
            studentDOB,
            studentEmail,
            course,
            issueDate,
            universityId,
            universityName,
            universityLocation,
            certificateHash
        );

        const event = receipt.logs[0];
        assert.equal(event.event, "CertificateCreated");
        assert.equal(event.args.studentId.toNumber(), studentId);
        assert.equal(event.args.studentName, studentName);
        assert.equal(event.args.studentDOB, studentDOB);
        assert.equal(event.args.studentEmail, studentEmail);
        assert.equal(event.args.course, course);
        assert.equal(event.args.issueDate.toNumber(), issueDate);
        assert.equal(event.args.universityId.toNumber(), universityId);
        assert.equal(event.args.universityName, universityName);
        assert.equal(event.args.universityLocation, universityLocation);
        assert.equal(event.args.certificateHash, certificateHash);
    });

    it("should verify a certificate", async () => {
        const studentId = 1;
        const studentName = "John Doe";
        const studentDOB = "2000-01-01";
        const studentEmail = "john.doe@example.com";
        const course = "Computer Science";
        const issueDate = Math.floor(Date.now() / 1000); 
        const universityId = 101;
        const universityName = "Example University";
        const universityLocation = "Example City";
        const certificateHash = web3.utils.sha3("example certificate hash");

        await certiGuard.addCertificate(
            studentId,
            studentName,
            studentDOB,
            studentEmail,
            course,
            issueDate,
            universityId,
            universityName,
            universityLocation,
            certificateHash
        );

        const isValid = await certiGuard.verifyCertificate(0, certificateHash);
        assert.isTrue(isValid, "The certificate should be valid");
    });
});
