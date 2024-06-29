document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/internship', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });

    if (response.status === 401) {
        alert('Unauthorized access. Please sign in.');
        return;
    }

    const internships = await response.json();
    const tableBody = document.getElementById('internshipTableBody');

    for (const internship of internships) {
        if (internship.status !== 'REJECT_FROM_DEPARTMENT' && internship.status !== 'REJECT_FROM_DEAN') {
            const reportsResponse = await fetch(`http://localhost:3000/reports/${internship.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
            });

            if (reportsResponse.status === 401) {
                alert('Unauthorized access. Please sign in.');
                return;
            }

            const reports = await reportsResponse.json();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${internship.internshipNumber}</td>
                <td>
                    ${reports.length > 0 ?
                    `<a href="javascript:void(0)" onclick="downloadReport('${reports[0].Internship_Report}', '${localStorage.getItem('accessToken')}')">${reports[0].Internship_Report}</a>
                        <i class="fas fa-check approval-icon"></i>`
                    : `<input class="form-control" type="file" data-internship-id="${internship.id}" onchange="uploadReport(event)">`}
                </td>
                <td>${reports.length > 0 ? reports[0].Evaluation : 'No report uploaded'}</td>
            `;
            tableBody.appendChild(row);
        }
    }
});

async function uploadReport(event) {
    const fileInput = event.target;
    const internshipId = fileInput.getAttribute('data-internship-id');
    const formData = new FormData();
    formData.append('Internship_Report', fileInput.files[0]);

    const response = await fetch(`http://localhost:3000/reports/${internshipId}/upload`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: formData,
    });

    if (response.status === 401) {
        alert('Unauthorized access. Please sign in.');
        return;
    }

    alert('Report uploaded successfully');
    location.reload();
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
