document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const internshipId = urlParams.get('id');

    if (internshipId) {
        try {
            const response = await fetch(`http://localhost:3000/assessment/${internshipId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const assessments = await response.json();
                console.log(assessments);

                if (assessments.length > 0) {
                    const assessment = assessments[0];
                    document.getElementById('fullName').textContent = assessment.studentName || 'N/A';
                    document.getElementById('internshipNumber').textContent = assessment.internshipNumber || 'N/A';
                    document.getElementById('companyName').textContent = assessment.companyName || 'N/A';
                    document.getElementById('companyEmail').textContent = assessment.companyEmailAddress || 'N/A';
                    document.getElementById('internshipStart').textContent = assessment.startDate || 'N/A';
                    document.getElementById('internshipFinish').textContent = assessment.finishDate || 'N/A';
                    document.getElementById('internshipDuration').textContent = assessment.internshipDuration || 'N/A';
                    document.getElementById('reportSufficiency').textContent = assessment.reportSufficiency || 'N/A';
                    document.getElementById('achievementLevel').textContent = assessment.achievementLevel || 'N/A';
                    document.getElementById('willingness').textContent = assessment.willingness || 'N/A';
                    document.getElementById('attendance').textContent = assessment.attendance || 'N/A';
                    document.getElementById('behavior').textContent = assessment.behavior || 'N/A';
                    document.getElementById('knowledgeApplication').textContent = assessment.knowledgeApplication || 'N/A';
                    document.getElementById('professionalInterest').textContent = assessment.professionalInterest || 'N/A';
                    document.getElementById('additionalComments').textContent = assessment.additionalComments || 'N/A';
                    document.getElementById('authorizedPersonInfo').textContent = assessment.authorizedPersonInfo || 'N/A';
                } else {
                    console.error('No assessment data found');
                }
            } else {
                console.error('Failed to fetch assessment data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('No internship ID found in URL');
    }
});