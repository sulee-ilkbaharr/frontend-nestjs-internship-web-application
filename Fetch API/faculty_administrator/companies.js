document.addEventListener('DOMContentLoaded', async () => {
    const internshipTableBody = document.querySelector('#internship-table tbody');

    try {
        const response = await fetch('http://localhost:3000/internship/all-with-evaluations', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const internships = await response.json();

        internships.forEach((internship, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${internship.studentName}</td>
        <td>${internship.studentDepartment}</td>
        <td>${internship.companyName}</td>
        <td>${internship.companyDepartment}</td>
        <td>${internship.score || ''}</td>
        <td>${internship.notes || ''}</td>
        
    `;

            internshipTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching internships:', error);
    }
});

async function saveEvaluation(index, companyId) {
    const score = document.getElementById(`score-${index}`).value;
    const notes = document.getElementById(`notes-${index}`).value;

    try {
        const response = await fetch('http://localhost:3000/company-evaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({ score, notes, companyId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Evaluation saved:', result);

        // Show alert message
        alert('Evaluation saved successfully!');

        // Enable the update button and set the companyEvaluationId for future updates
        const updateBtn = document.getElementById(`update-btn-${index}`);
        updateBtn.disabled = false;
        updateBtn.setAttribute('onclick', `updateEvaluation(${index}, '${result.id}')`);

        // Disable input fields and change button to indicate saved state
        document.getElementById(`score-${index}`).disabled = true;
        document.getElementById(`notes-${index}`).disabled = true;
    } catch (error) {
        console.error('Error saving evaluation:', error);
        alert('Error saving evaluation. Please try again.');
    }
}

async function updateEvaluation(index, companyEvaluationId) {
    const score = document.getElementById(`score-${index}`).value;
    const notes = document.getElementById(`notes-${index}`).value;

    try {
        const response = await fetch(`http://localhost:3000/company-evaluation/${companyEvaluationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({ score, notes })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Evaluation updated:', result);

        // Show alert message
        alert('Evaluation updated successfully!');

        // Disable input fields and change button to indicate updated state
        document.getElementById(`score-${index}`).disabled = true;
        document.getElementById(`notes-${index}`).disabled = true;
    } catch (error) {
        console.error('Error updating evaluation:', error);
        alert('Error updating evaluation. Please try again.');
    }
}
