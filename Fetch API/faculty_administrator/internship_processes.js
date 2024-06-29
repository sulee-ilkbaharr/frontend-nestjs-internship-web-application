async function loadInternDetails() {
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
            const tableBody = document.getElementById('internshipTableBody');

            tableBody.innerHTML = '';

            internships.filter(internship => internship.status !== 'REJECT_FROM_DEPARTMENT' && internship.status !== 'WAITING_IN_DEPARTMENT_HEAD') // reject olanları filtrele
                .forEach(async (internship) => {
                    if (internship.status === 'WAITING_IN_DEAN') {
                        let approvalContentforDepartment = `<i class="bi bi-check-circle-fill accepted-icon"></i> Accepted`;

                        let approvalContentforDean = `<a class="nav-link" href="internship_application_approval.html?id=${internship.id}">View Application</a>`;
                        if (internship.status === 'WAITING_FOR_INSURANCE_ENTRY') {
                            let approvalContentforDean = `<i class="bi bi-check-circle-fill accepted-icon"></i> Accepted`;

                        } if (internship.status === 'REJECT_FROM_DEAN') {
                            approvalContentforDean = `<i class="bi bi-x-circle-fill text-danger"></i> Rejected`;
                        }
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                        <td class="text-center">${internship.studentName}</td>
                        <td class="text-center">${approvalContentforDepartment}</td>
                        <td class="text-center">${approvalContentforDean}</td>
                    `;
                        tableBody.appendChild(newRow);
                    }

                });

        } else {
            console.error('Failed to fetch student name');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}




document.addEventListener('DOMContentLoaded', () => {
    loadInternDetails();

    document.getElementById('internshipTableBody').addEventListener('click', (event) => {
        if (event.target.classList.contains('save-status-button')) {
            const reportId = event.target.getAttribute('data-report-id');
            const selectElement = document.querySelector(`.report-evaluation-select[data-report-id="${reportId}"]`);
            const status = selectElement.value;
            saveReportStatus(reportId, status);
        } else if (event.target.classList.contains('update-status-button')) {
            const reportId = event.target.getAttribute('data-report-id');
            const selectElement = document.querySelector(`.report-evaluation-select[data-report-id="${reportId}"]`);
            const status = selectElement.value;
            updateReportStatus(reportId, status);
        }
    });
});