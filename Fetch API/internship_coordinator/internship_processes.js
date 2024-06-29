async function loadInternDetails(filter = '') {
    try {
        const response = await fetch('http://localhost:3000/internship/details', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const internships = await response.json();
            const tableBody = document.getElementById('internshipTableBodyForCoordinator');
            tableBody.innerHTML = '';

            for (const internship of internships) {
                let academicUnitApproval = '';
                let facultyAdministratorApproval = '';
                let insuranceEntryDocument = '';
                let internshipForms = '';

                if (filter && internship.status !== filter) {
                    continue;
                }

                if (internship.status === 'WAITING_FOR_INSURANCE_ENTRY') {
                    academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                    facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                    insuranceEntryDocument = `<form id="upload-form-${internship.id}" enctype="multipart/form-data">
                        <input type="file" name="InsuranceForm" accept="application/pdf" />
                        <button type="button" class="btn btn-primary" onclick="uploadInsurance('${internship.id}')">Upload</button>
                    </form>`;
                } else if (internship.status === 'INSURANCE_UPLOADED') {
                    academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                    facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                } else if (internship.status === 'COMPLETED') {
                    academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                    facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                }
                if (internship.status === 'REJECT_FROM_DEPARTMENT') {
                    academicUnitApproval = `<i class="bi bi-x-circle-fill text-danger"></i> Rejected`;
                    facultyAdministratorApproval = `INVALID`;
                }
                if (internship.status === 'REJECT_FROM_DEAN') {
                    academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                    facultyAdministratorApproval = `<i class="bi bi-x-circle-fill text-danger"></i> Rejected`;
                }
                if (internship.status === 'INSURANCE_UPLOADED') {
                    insuranceEntryDocument = 'INSURANCE UPLOADED';
                }

                // Formlar yüklendiyse View Forms butonunu göster
                const filesResponse = await fetch(`http://localhost:3000/files/${internship.id}/uploaded`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                        'Content-Type': 'application/json'
                    }
                });

                if (filesResponse.ok) {
                    const files = await filesResponse.json();
                    if (files.Internship_Application_Form || files.Employer_Information_Form || files.Declaration_Commitment_Document || files.ID_Card_Photocopy) {
                        internshipForms = `<button class="btn btn-view-forms" onclick="viewForms('${internship.id}')">View Forms</button>`;
                    }
                }

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${internship.studentName}</td>
                    <td class="text-center">${academicUnitApproval}</td>
                    <td class="text-center">${facultyAdministratorApproval}</td>
                    <td>${internship.startDate}</td>
                    <td>${internship.finishDate}</td>
                    <td class="text-center">${internshipForms}</td>
                    <td class="text-center">${insuranceEntryDocument}</td>
                `;
                tableBody.appendChild(newRow);
            }
        } else {
            console.error('Failed to fetch internship details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function filterInternships(status) {
    loadInternDetails(status);
}

async function uploadInsurance(internshipId) {
    const form = document.getElementById(`upload-form-${internshipId}`);
    const formData = new FormData(form);
    try {
        const response = await fetch(`http://localhost:3000/insurance/${internshipId}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            alert('File uploaded successfully');
            loadInternDetails();
        } else {
            alert('Failed to upload file');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading file');
    }
}

function viewForms(internshipId) {
    window.location.href = `view_forms.html?internshipId=${internshipId}`;
}

document.addEventListener('DOMContentLoaded', () => loadInternDetails());

