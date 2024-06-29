document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        // Login successful, handle token and role
        console.log('Login successful:', data);
        localStorage.setItem('accessToken', data.accessToken);
        
        // Redirect based on user role
        switch(data.role) {
            case 'STUDENT':
                window.location.href = '/view/student/home.html';
                break;
            case 'DEPARTMENT':
                window.location.href = '/view/department/home.html';
                break;
            case 'FACULTY_DEAN':
                window.location.href = '/view/faculty-administrator/home.html';
                break;
            case 'INTERNSHIP_COORDINATOR':
                window.location.href = '/view/internship_coordinator/home.html';
                break;
            default:
                alert('Unknown user role');
        }
    } else {
        // Login failed, handle error
        console.error('Login failed:', data);
        alert(data.message || 'Login failed');
    }
});
