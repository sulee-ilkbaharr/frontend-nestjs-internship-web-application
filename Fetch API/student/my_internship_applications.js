async function loadInternships() {
    try {
        const response = await fetch('http://localhost:3000/internship', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // Include if using JWT
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const internships = await response.json();
            const tableBody = document.getElementById('internshipTableBody');
            tableBody.innerHTML = ''; // Clear existing rows

            internships.forEach(async internship => {
                const newRow = document.createElement('tr');
                let academicUnitApproval = '';
                let facultyAdministratorApproval = '';
                let internshipCoordinatorApproval = '';
                let downloadButton = '';

                switch (internship.status) {
                    case 'WAITING_IN_DEPARTMENT_HEAD':
                        academicUnitApproval = 'WAITING';
                        break;
                    case 'WAITING_IN_DEAN':
                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        facultyAdministratorApproval = 'WAITING';
                        break;
                    case 'WAITING_FOR_INSURANCE_ENTRY':
                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        downloadButton = 'Waiting for Insurance form';
                        break;
                    case 'INSURANCE_UPLOADED':
                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        break;
                    case 'INSURANCE_UPLOADED':
                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        downloadButton = '<button class="btn btn-primary download-btn">Download Form <i class="bi bi-download"></i></button>';
                        break;
                    case 'COMPLETED':
                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        facultyAdministratorApproval = '<i class="bi bi-check-circle-fill text-success"></i>';
                        break;
                    case 'REJECT_FROM_DEPARTMENT':
                        academicUnitApproval = '<i class="bi bi-x-circle-fill text-danger"></i>';
                        break;
                    case 'REJECT_FROM_DEAN':

                        academicUnitApproval = '<i class="bi bi-check-circle-fill text-success"></i>';

                        facultyAdministratorApproval = '<i class="bi bi-x-circle-fill text-danger"></i>';
                        break;
                }

                if (internship.insurance && internship.status !== 'WAITING_FOR_INSURANCE_ENTRY') {
                    const insuranceResponse = await fetch(`http://localhost:3000/insurance/${internship.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                            'Content-Type': 'application/json'
                        }
                    });

                    if (insuranceResponse.ok) {
                        const insurances = await insuranceResponse.json();
                        if (insurances.length > 0) {
                            downloadButton = '';
                            insurances.forEach(insurance => {
                                const token = localStorage.getItem('accessToken');
                                downloadButton += `<a href="javascript:void(0)" onclick="downloadInsurance('${insurance.InsuranceForm}', '${token}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
                                </svg>
                                </a>`;
                            });
                        }
                    } else {
                        console.error('Failed to fetch insurances', insuranceResponse.statusText);
                    }
                }

                newRow.innerHTML = `
                    <td>${internship.internshipNumber}</td>
                    <td class="text-center">${academicUnitApproval}</td>
                    <td class="text-center">${facultyAdministratorApproval}</td>
                    <td>${downloadButton}</td>
                `;
                tableBody.appendChild(newRow);
            });
        } else {
            console.error('Failed to fetch internships');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function downloadInsurance(filename, token) {
    try {
        const response = await fetch('http://localhost:3000/insurance/download/' + filename, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

window.onload = loadInternships;