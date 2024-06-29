// $(function () {
//     var minDate = new Date();
//     minDate.setDate(minDate.getDate());

//     $('#start_datepicker').datepicker({
//         format: 'dd-mm-yyyy',
//         startDate: minDate,
//         todayHighlight: true,
//         autoclose: true
//     });

//     $('#finish_datepicker').datepicker({
//         format: 'dd-mm-yyyy',
//         startDate: minDate,
//         todayHighlight: true,
//         autoclose: true
//     });

//     $('#datepicker').datepicker({
//         multidate: true,
//         format: 'dd-mm-yyyy',
//         startDate: minDate,
//     });
// });


$(function () {
    var minDate = new Date();
    minDate.setDate(minDate.getDate() + 15);

    $('#start_datepicker').datepicker({
        format: 'dd/mm/yyyy',
        startDate: minDate,
        todayHighlight: true,
        autoclose: true
    }).on('changeDate', function (e) {
        var selectedDate = e.date;
        if (selectedDate < minDate) {
            alert('En erken 15 gün sonrayı seçebilirsiniz');
            $('#startDate').val('');
        } else {
            $('#datepicker').datepicker('setDate', selectedDate);
        }
    });

    $('#finish_datepicker').datepicker({
        format: 'dd/mm/yyyy',
        startDate: minDate,
        todayHighlight: true,
        autoclose: true
    });

    $('#datepicker').datepicker({
        multidate: true,
        format: 'dd/mm/yyyy',
        startDate: minDate
    }).on('changeDate', function (e) {
        var dates = $(this).datepicker('getDates');
        if (dates.length > 0) {
            var startDate = $('#startDate').datepicker('getDate');
            if (!startDate || startDate.toDateString() !== dates[0].toDateString()) {
                $('#startDate').datepicker('setDate', dates[0]);
            }
            if (dates.length === 20) {
                $('#finishDate').datepicker('setDate', dates[19]);
            }
        }
    });

    async function loadCompanyAndDepartmentNames() {
        try {
            const companyResponse = await fetch('http://localhost:3000/company/getAll');
            const departmentResponse = await fetch('http://localhost:3000/department/getAll');

            if (companyResponse.ok && departmentResponse.ok) {
                const companies = await companyResponse.json();
                const departments = await departmentResponse.json();

                const companyDatalist = document.getElementById('companyNames');
                companies.forEach(company => {
                    const option = document.createElement('option');
                    option.value = company.name;
                    companyDatalist.appendChild(option);
                });

                const departmentDatalist = document.getElementById('departmentNames');
                departments.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.name;
                    departmentDatalist.appendChild(option);
                });
            } else {
                console.error('Failed to fetch company or department data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    loadCompanyAndDepartmentNames();
});

document.getElementById('companyName').addEventListener('input', async function () {
    const companyName = this.value;
    if (companyName) {
        try {
            const response = await fetch(`http://localhost:3000/company/getByName?companyName=${encodeURIComponent(companyName)}`);
            if (response.ok) {
                const company = await response.json();
                if (company) {
                    document.getElementById('departmentName').value = company.departmentName || '';
                    document.getElementById('productionArea').value = company.productionArea || '';
                    document.getElementById('companyPhoneNumber').value = company.companyPhoneNumber || '';
                    document.getElementById('companyEmailAddress').value = company.companyEmailAddress || '';
                    document.getElementById('companyAddress').value = company.companyAddress || '';
                } else {
                    // Şirket bulunamadığında formu temizleyin
                    document.getElementById('departmentName').value = '';
                    document.getElementById('productionArea').value = '';
                    document.getElementById('companyPhoneNumber').value = '';
                    document.getElementById('companyEmailAddress').value = '';
                    document.getElementById('companyAddress').value = '';
                }
            } else {
                console.error('Failed to fetch company data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        document.getElementById('departmentName').value = '';
        document.getElementById('productionArea').value = '';
        document.getElementById('companyPhoneNumber').value = '';
        document.getElementById('companyEmailAddress').value = '';
        document.getElementById('companyAddress').value = '';
    }
});

document.getElementById('internshipForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dates = $('#datepicker').datepicker('getDates').map(date => {
        return new Date(date).toISOString().slice(0, 10); // ISO formatında kısa tarih
    });

    const sameDepartmentGraduate = document.getElementById('sameDepartmentGraduate').value;
    if (sameDepartmentGraduate.toLowerCase() === 'no') {
        alert('There must be someone who graduated from the same department as you in the department where you will do your internship.');
        return;
    }


    if (dates.length !== 20) {
        alert('You must select exactly 20 dates.');
        return; 
    }

    const formData = {
        companyName: document.getElementById('companyName').value,
        departmentName: document.getElementById('departmentName').value,
        productionArea: document.getElementById('productionArea').value,
        companyPhoneNumber: document.getElementById('companyPhoneNumber').value,
        companyEmailAddress: document.getElementById('companyEmailAddress').value,
        companyAddress: document.getElementById('companyAddress').value,
        internshipNumber: document.getElementById('internshipNumber').value,
        sameDepartmentGraduate: document.getElementById('sameDepartmentGraduate').value,
        startDate: document.getElementById('startDate').value,
        finishDate: document.getElementById('finishDate').value,
        internshipDays: document.getElementById('internshipDays').value,
        correspondingPerson: document.getElementById('correspondingPerson').value,
    };

    localStorage.setItem('internshipFormData', JSON.stringify(formData));

    try {
        const response = await fetch('http://localhost:3000/internship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // Eğer token kullanıyorsanız
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json()
            const internshipID = result.id;
            localStorage.setItem('internshipId', internshipID);
            alert('Internship application submitted successfully!');
            window.location.href = '/view/student/internship_application_step2.html'; // Yönlendirme işlemi burada gerçekleşir.
        } else {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            alert('Failed to submit internship application: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the application.');
    }


    const internshipID = localStorage.getItem('internshipId');
    console.log("Internship ID:", internshipID);
    if (!internshipID) {
        console.error("Internship ID is not defined or empty.");
    } else {
        try {
            const response = await fetch(`http://localhost:3000/internship/${internshipID}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert('Failed to send email: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the email.');
        }
    }

});
