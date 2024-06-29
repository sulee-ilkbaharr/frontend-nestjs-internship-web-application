document.getElementById('download-docx').addEventListener('click', function () {
    const formData = JSON.parse(localStorage.getItem('internshipFormData'));

    if (!formData) {
        alert('Form data not found');
        return;
    }

    // Fetch doc.html content
    fetch('internship_application_form.html')
        .then(response => response.text())
        .then(docContent => {
            // Replace placeholders in doc.html with form data
            docContent = docContent
                .replace('<!--companyName-->', formData.companyName || '')
                .replace('<!--departmentName-->', formData.departmentName || '')
                .replace('<!--productionArea-->', formData.productionArea || '')
                .replace('<!--companyPhoneNumber-->', formData.companyPhoneNumber || '')
                .replace('<!--companyEmailAddress-->', formData.companyEmailAddress || '')
                .replace('<!--companyAddress-->', formData.companyAddress || '')
                .replace('<!--internshipNumber-->', formData.internshipNumber || '')
                .replace('<!--sameDepartmentGraduate-->', formData.sameDepartmentGraduate || '')
                .replace('<!--startDate-->', formData.startDate || '')
                .replace('<!--finishDate-->', formData.finishDate || '')
                .replace('<!--internshipDays-->', formData.internshipDays || '')
                .replace('<!--correspondingPerson-->', formData.correspondingPerson || '');

            // Create a temporary element to hold the updated docContent
            const tempElement = document.createElement('div');
            tempElement.innerHTML = docContent;

            // Convert the content to PDF
            const options = {
                filename: 'Internship_Application_Form.pdf',
                margin: 1,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            };
            html2pdf().set(options).from(tempElement).save();
        })
        .catch(error => {
            console.error('Error fetching doc.html:', error);
            alert('An error occurred while generating the PDF.');
        });
});

document.getElementById('download-docx1').addEventListener('click', function () {
    const formData = JSON.parse(localStorage.getItem('internshipFormData'));

    if (!formData) {
        alert('Form data not found');
        return;
    }

    // Fetch doc.html content
    fetch('employer_information_form.html')
        .then(response => response.text())
        .then(docContent => {
            // Replace placeholders in doc.html with form data
            docContent = docContent
                .replace('<!--companyName-->', formData.companyName || '')
                .replace('<!--departmentName-->', formData.departmentName || '')
                .replace('<!--productionArea-->', formData.productionArea || '')
                .replace('<!--companyPhoneNumber-->', formData.companyPhoneNumber || '')
                .replace('<!--companyEmailAddress-->', formData.companyEmailAddress || '')
                .replace('<!--companyAddress-->', formData.companyAddress || '')
                .replace('<!--internshipNumber-->', formData.internshipNumber || '')
                .replace('<!--sameDepartmentGraduate-->', formData.sameDepartmentGraduate || '')
                .replace('<!--startDate-->', formData.startDate || '')
                .replace('<!--finishDate-->', formData.finishDate || '')
                .replace('<!--internshipDays-->', formData.internshipDays || '')
                .replace('<!--correspondingPerson-->', formData.correspondingPerson || '');

            // Create a temporary element to hold the updated docContent
            const tempElement = document.createElement('div');
            tempElement.innerHTML = docContent;

            // Convert the content to PDF
            const options = {
                filename: 'Employer_Information_Form.pdf',
                margin: 1,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            };
            html2pdf().set(options).from(tempElement).save();
        })
        .catch(error => {
            console.error('Error fetching doc.html:', error);
            alert('An error occurred while generating the PDF.');
        });
});

document.getElementById('download-docx2').addEventListener('click', function () {
    // Create a temporary anchor element to download the DOC file
    const link = document.createElement('a');
    link.href = '/view/student/DECLARATION AND COMMITMENT.doc';  // Ensure this path is correct
    link.download = 'DECLARATION AND COMMITMENT.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('nextButton').addEventListener('click', function () {
    window.location.href = '/view/student/upload_internship_application.html';
});
