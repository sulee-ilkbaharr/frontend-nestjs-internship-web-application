function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function loadInternDetails() {
    const internshipId = getQueryParam('id'); 
    if (!internshipId) {
        console.error('No internship ID provided in the URL');
        return;
    }

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
            const internship = internships.find(internship => internship.id === internshipId);
            if (!internship) {
                console.error('Internship not found');
                return;
            }

            document.getElementById('fullName').textContent = internship.studentName || 'N/A';
            document.getElementById('studentId').textContent = internship.user.student.studentId || 'N/A';
            document.getElementById('internshipNumber').textContent = internship.internshipNumber || 'N/A';
            document.getElementById('companyName').textContent = internship.companyName || 'N/A';
            document.getElementById('companyEmail').textContent = internship.company.companyEmailAddress || 'N/A';
            document.getElementById('departmentName').textContent = internship.departmentName || 'N/A';
            document.getElementById('startDate').textContent = internship.startDate || 'N/A';
            document.getElementById('finishDate').textContent = internship.finishDate || 'N/A';

        } else {
            console.error('Failed to fetch internship details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function updateStatus(status) {
    const internshipId = getQueryParam('id');
    if (!internshipId) {
        console.error('No internship ID provided in the URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/internship/${internshipId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // JWT kullanılıyorsa ekle
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            const updatedInternship = await response.json();
            showNotification(`Internship status updated to ${status}`);
            setTimeout(() => {
                window.location.href = '/view/department/internship_processes.html';
            }, 2000);
        } else {
            console.error('Failed to update internship status');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function showNotification(message) {
    document.getElementById('toastBody').textContent = message;
    const toastElement = document.getElementById('statusToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

document.addEventListener('DOMContentLoaded', loadInternDetails);