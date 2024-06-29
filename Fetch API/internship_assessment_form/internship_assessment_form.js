document.getElementById('assessmentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        studentName: document.getElementById('inputContact1').value,
        internshipNumber: document.getElementById('inputContact2').value,
        companyName: document.getElementById('inputContact3').value,
        companyEmailAddress: document.getElementById('inputContact4').value,
        startDate: formatDate(document.getElementById('inputContact5').value),
        finishDate: formatDate(document.getElementById('inputContact6').value),
        internshipDuration: document.getElementById('inputContact7').value,
        reportSufficiency: parseInt(document.getElementById('inputContact8').value),
        achievementLevel: parseInt(document.getElementById('inputContact9').value),
        willingness: parseInt(document.getElementById('inputContact10').value),
        attendance: parseInt(document.getElementById('inputContact11').value),
        behavior: parseInt(document.getElementById('inputContact12').value),
        knowledgeApplication: parseInt(document.getElementById('inputContact13').value),
        professionalInterest: parseInt(document.getElementById('inputContact14').value),
        additionalComments: document.getElementById('inputContact15').value,
        authorizedPersonInfo: document.getElementById('inputContact16').value
    };

    const internshipId = new URLSearchParams(window.location.search).get('internshipId');
    try {
        const response = await fetch(`http://localhost:3000/assessment/${internshipId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Assessment submitted successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            alert('Failed to submit assessment: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the assessment.');
    }
});

function formatDate(dateString) {
const parts = dateString.split('-');
const year = parts[2];
const month = parts[1];
const day = parts[0];
return `${year}-${month}-${day}`;
}
