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
            const tableBody = document.getElementById('departmentInternshipTableBody');
            tableBody.innerHTML = '';

            for (const internship of internships) {
                let approvalContent = `<a class="nav-link" href="internship_application_approval.html?id=${internship.id}">View Application</a>`;
                if (internship.status === 'WAITING_IN_DEAN' || internship.status === 'WAITING_FOR_INSURANCE_ENTRY' || internship.status === 'INSURANCE_UPLOADED' || internship.status === 'COMPLETED') { //internship.status === 'ACCEPTED' olamamalı
                    approvalContent = `<i class="bi bi-check-circle-fill accepted-icon"></i> Accepted`;
                }
                if (internship.status === 'REJECT_FROM_DEPARTMENT') {
                    approvalContent = `<i class="bi bi-x-circle-fill text-danger"></i> Rejected`;
                }

                let reportContent = '';
                let reportEvaluationOptions = '';
                let buttonContent = '';

                if (internship.reports) {
                    const reportsResponse = await fetch(`http://localhost:3000/reports/${internship.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                            'Content-Type': 'application/json'
                        }
                    });

                    if (reportsResponse.ok) {
                        const reports = await reportsResponse.json();
                        reports.forEach(report => {
                            reportContent += `<a href="javascript:void(0)" onclick="downloadReport('${report.Internship_Report}', '${localStorage.getItem('accessToken')}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
                                </svg>
                            </a>`;

                            // Report Evaluation Options
                            reportEvaluationOptions += `
                                <select class="form-control report-evaluation-select" data-report-id="${report.id}">
                                    <option value="WAITING_FOR_EVALUATION" ${report.Evaluation === 'WAITING_FOR_EVALUATION' || !report.Evaluation ? 'selected' : ''}>Choose...</option>
                                    <option value="PASSED" ${report.Evaluation === 'PASSED' ? 'selected' : ''}>PASSED</option>
                                    <option value="FAILED" ${report.Evaluation === 'FAILED' ? 'selected' : ''}>FAILED</option>
                                </select>
                            `;
                            buttonContent += `
                                <div class="btn-group mt-2" role="group">
                                    <button class="btn btn-primary save-status-button" data-report-id="${report.id}">Save</button>
                                    <button class="btn btn-secondary update-status-button" data-report-id="${report.id}">Update</button>
                                </div>
                            `;
                        });
                    }
                }

                let viewFormContent = '';
                const assessmentResponse = await fetch(`http://localhost:3000/assessment/${internship.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                        'Content-Type': 'application/json'
                    }
                });
                if (assessmentResponse.ok) {
                    const assessments = await assessmentResponse.json();
                    if (assessments.length > 0) {
                        viewFormContent = `<a class="nav-link" href="view_form.html?id=${internship.id}">View Form</a>`;
                    }
                }

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="text-center">${internship.studentName}</td>
                    <td class="text-center">${approvalContent}</td>
                    <td class="text-center">${reportContent}</td>
                    <td class="text-center">${reportEvaluationOptions}</td>
                    <td class="text-center">${buttonContent}</td>
                    <td class="text-center">${viewFormContent}</td>
                `;
                tableBody.appendChild(newRow);
            }

            filterRejectInternships();
        } else {
            console.error('Failed to fetch internship details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function downloadReport(filename, token) {
    try {
        const response = await fetch(`http://localhost:3000/reports/download/${filename}`, {
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

async function saveReportStatus(reportId, status) {
    try {
        const response = await fetch(`http://localhost:3000/reports/${reportId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            console.error('Failed to save report status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateReportStatus(reportId, status) {
    try {
        const response = await fetch(`http://localhost:3000/reports/${reportId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            console.error('Failed to update report status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadInternDetails();

    document.getElementById('departmentInternshipTableBody').addEventListener('click', (event) => {
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