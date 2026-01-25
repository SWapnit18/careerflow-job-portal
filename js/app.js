// Main Application Controller
const App = {
    currentPage: 'dashboard',

    init() {
        this.updateUserInfo();
        this.setupNavigation();
        this.initializeDashboard();
    },

    updateUserInfo() {
        const user = API.getCurrentUser();
        if (!user) return;

        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = user.role;
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();

        // Show/hide Post Job button for companies
        if (user.role === 'company') {
            document.getElementById('postJobBtn').classList.remove('hidden');
        }
    },

    setupNavigation() {
        // Nav menu clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                Auth.logout();
            }
        });
    },

    navigateToPage(page) {
        this.currentPage = page;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        // Hide all dashboard content
        document.querySelectorAll('.dashboard-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show appropriate content
        const user = API.getCurrentUser();
        if (page === 'dashboard') {
            if (user.role === 'student') {
                document.getElementById('studentDashboard').classList.remove('hidden');
                StudentDashboard.init();
            } else if (user.role === 'company') {
                document.getElementById('companyDashboard').classList.remove('hidden');
                CompanyDashboard.init();
            }
        } else if (page === 'post-job' && user.role === 'company') {
            document.getElementById('postJobForm').classList.remove('hidden');
        }
    },

    initializeDashboard() {
        const user = API.getCurrentUser();
        if (!user) return;

        if (user.role === 'student') {
            document.getElementById('studentDashboard').classList.remove('hidden');
            StudentDashboard.init();
        } else if (user.role === 'company') {
            document.getElementById('companyDashboard').classList.remove('hidden');
            CompanyDashboard.init();
        }
    }
};

// Make App available globally
window.App = App;