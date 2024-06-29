document.addEventListener('DOMContentLoaded', function () {
    fetchFiles();
});
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
async function fetchFiles() {
    const internshipId = getQueryParameter('internshipId');
    if (!internshipId) {
        console.error('Internship ID not found in URL');
        return;
    }
    const response = await fetch(`http://localhost:3000/files/${internshipId}/uploaded`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const files = await response.json();
        if (files.Internship_Application_Form) {
            document.getElementById('internshipApplicationFormRow').innerHTML = `
                <a href="http://localhost:3000/uploads/${files.Internship_Application_Form}" class="btn btn-primary" download>Download Form <i class="fa fa-download"></i></a>
            `;
        }
        if (files.Employer_Information_Form) {
            document.getElementById('employerInformationFormRow').innerHTML = `
                <a href="http://localhost:3000/uploads/${files.Employer_Information_Form}" class="btn btn-primary" download>Download Form <i class="fa fa-download"></i></a>
            `;
        }
        if (files.Declaration_Commitment_Document) {
            document.getElementById('declarationCommitmentDocumentRow').innerHTML = `
                <a href="http://localhost:3000/uploads/${files.Declaration_Commitment_Document}" class="btn btn-primary" download>Download Form <i class="fa fa-download"></i></a>
            `;
        }
        if (files.ID_Card_Photocopy) {
            document.getElementById('idCardPhotocopyRow').innerHTML = `
                <a href="http://localhost:3000/uploads/${files.ID_Card_Photocopy}" class="btn btn-primary" download>Download Form <i class="fa fa-download"></i></a>
            `;
        }
    } else {
        console.error('Failed to fetch files:', response.statusText);
    }
}
