// Mock Database
const DB = {
    users: [],
    jobs: [
        {
            _id: '1',
            title: 'Full Stack Developer',
            company: 'TechCorp',
            skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express'],
            description: 'Looking for experienced full stack developer to join our team',
            location: 'Remote',
            salary: '$80k - $120k',
            postedDate: '2026-01-20',
            applicants: []
        },
        {
            _id: '2',
            title: 'Frontend Developer',
            company: 'WebSolutions',
            skillsRequired: ['React', 'JavaScript', 'CSS', 'HTML'],
            description: 'Join our frontend team and build amazing user experiences',
            location: 'New York',
            salary: '$70k - $100k',
            postedDate: '2026-01-18',
            applicants: []
        },
        {
            _id: '3',
            title: 'Backend Engineer',
            company: 'DataCorp',
            skillsRequired: ['Python', 'Django', 'PostgreSQL'],
            description: 'Build scalable backend systems for our growing platform',
            location: 'San Francisco',
            salary: '$90k - $130k',
            postedDate: '2026-01-15',
            applicants: []
        }
    ],
    currentUser: null
};

// Mock API
const API = {
    // Register User
    register(userData) {
        const exists = DB.users.find(u => u.email === userData.email);
        if (exists) {
            return { success: false, message: 'User already exists' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            ...userData
        };
        
        DB.users.push(newUser);
        return { success: true, message: 'Registration successful' };
    },

    // Login User
    login(email, password) {
        const user = DB.users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }
        
        DB.currentUser = { ...user };
        delete DB.currentUser.password;
        
        return {
            success: true,
            user: DB.currentUser,
            token: 'mock-token-' + user.id
        };
    },

    // Logout
    logout() {
        DB.currentUser = null;
        return { success: true };
    },

    // Get Current User
    getCurrentUser() {
        return DB.currentUser;
    },

    // Get All Jobs
    getJobs() {
        return DB.jobs;
    },

    // Create Job (Company only)
    createJob(jobData) {
        if (!DB.currentUser || DB.currentUser.role !== 'company') {
            return { success: false, message: 'Unauthorized' };
        }

        const newJob = {
            _id: Date.now().toString(),
            ...jobData,
            company: DB.currentUser.name,
            postedDate: new Date().toISOString().split('T')[0],
            applicants: []
        };

        DB.jobs.push(newJob);
        return { success: true, job: newJob };
    },

    // Apply to Job
    applyToJob(jobId, skills) {
        const job = DB.jobs.find(j => j._id === jobId);
        if (!job) {
            return { success: false, message: 'Job not found' };
        }

        if (!DB.currentUser || DB.currentUser.role !== 'student') {
            return { success: false, message: 'Only students can apply' };
        }

        // Calculate ATS Score
        const matched = job.skillsRequired.filter(skill =>
            skills.includes(skill)
        );
        const atsScore = Math.round((matched.length / job.skillsRequired.length) * 100);

        // Add applicant
        const application = {
            studentName: DB.currentUser.name,
            studentEmail: DB.currentUser.email,
            skills: skills,
            atsScore: atsScore,
            appliedAt: new Date().toISOString()
        };

        job.applicants.push(application);
        
        return { success: true, atsScore: atsScore };
    },

    // Get Company Jobs
    getCompanyJobs() {
        if (!DB.currentUser || DB.currentUser.role !== 'company') {
            return [];
        }
        return DB.jobs.filter(j => j.company === DB.currentUser.name);
    },

    // Get Student Applications
    getStudentApplications() {
        if (!DB.currentUser || DB.currentUser.role !== 'student') {
            return [];
        }
        
        let applications = [];
        DB.jobs.forEach(job => {
            const app = job.applicants.find(a => a.studentEmail === DB.currentUser.email);
            if (app) {
                applications.push({
                    jobTitle: job.title,
                    company: job.company,
                    ...app
                });
            }
        });
        
        return applications;
    }
};

// Make API available globally
window.DB = DB;
window.API = API;
