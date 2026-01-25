// Authentication Module
const Auth = {
    isLogin: true,

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Toggle between login and register
        document.getElementById('toggleAuth').addEventListener('click', () => {
            this.toggleMode();
        });

        // Handle auth submit
        document.getElementById('authBtn').addEventListener('click', () => {
            this.handleSubmit();
        });

        // Enter key to submit
        const authInputs = document.querySelectorAll('#authPage input');
        authInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit();
                }
            });
        });
    },

    toggleMode() {
        this.isLogin = !this.isLogin;
        
        const nameField = document.getElementById('nameField');
        const roleField = document.getElementById('roleField');
        const authBtn = document.getElementById('authBtn');
        const authSubtitle = document.getElementById('authSubtitle');
        const toggleAuth = document.getElementById('toggleAuth');

        if (this.isLogin) {
            nameField.classList.add('hidden');
            roleField.classList.add('hidden');
            authBtn.textContent = 'Login';
            authSubtitle.textContent = 'Welcome back!';
            toggleAuth.textContent = "Don't have an account? Register";
        } else {
            nameField.classList.remove('hidden');
            roleField.classList.remove('hidden');
            authBtn.textContent = 'Register';
            authSubtitle.textContent = 'Create your account';
            toggleAuth.textContent = 'Already have an account? Login';
        }

        // Clear inputs
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('name').value = '';
    },

    handleSubmit() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (this.isLogin) {
            this.login(email, password);
        } else {
            const name = document.getElementById('name').value.trim();
            const role = document.getElementById('role').value;

            if (!name) {
                alert('Please enter your name');
                return;
            }

            this.register(name, email, password, role);
        }
    },

    login(email, password) {
        const result = API.login(email, password);
        
        if (result.success) {
            // Store session
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            
            // Navigate to dashboard
            this.navigateToDashboard();
        } else {
            alert(result.message);
        }
    },

    register(name, email, password, role) {
        const result = API.register({ name, email, password, role });
        
        if (result.success) {
            alert('Registration successful! Please login.');
            this.toggleMode();
        } else {
            alert(result.message);
        }
    },

    navigateToDashboard() {
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        
        // Initialize dashboard
        if (window.App) {
            window.App.init();
        }
    },

    logout() {
        API.logout();
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Navigate to auth page
        document.getElementById('dashboardPage').classList.remove('active');
        document.getElementById('authPage').classList.add('active');
        
        // Clear inputs
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    },

    checkAuth() {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('currentUser');
        
        if (token && userStr) {
            const user = JSON.parse(userStr);
            DB.currentUser = user;
            this.navigateToDashboard();
            return true;
        }
        return false;
    }
};

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    
    // Check if user is already logged in
    if (!Auth.checkAuth()) {
        document.getElementById('authPage').classList.add('active');
    }
});