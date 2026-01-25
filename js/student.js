// Student Dashboard Module
const StudentDashboard = {
    selectedJob: null,

    init() {
        this.renderStats();
        this.renderJobs();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchJobs').addEventListener('input', (e) => {
            this.filterJobs(e.target.value);
        });

        // Application modal buttons
        document.getElementById('submitApplicationBtn').addEventListener('click', () => {
            this.submitApplication();
        });

        document.getElementById('cancelApplicationBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click
        document.getElementById('applicationModal').addEventListener('click', (e) => {
            if (e.target.id === 'applicationModal') {
                this.closeModal();
            }
        });
    },

    renderStats() {
        const jobs = API.getJobs();
        const applications = API.getStudentApplications();
        
        document.getElementById('availableJobs').textContent = jobs.length;
        document.getElementById('myApplications').textContent = applications.length;
    },

    renderJobs(jobsToRender = null) {
        const jobs = jobsToRender || API.getJobs();
        const container = document.getElementById('jobsGrid');
        
        if (jobs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No jobs found</p>';
            return;
        }

        container.innerHTML = jobs.map(job => this.createJobCard(job)).join('');

        // Add event listeners to apply buttons
        document.querySelectorAll('.btn-apply').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.jobId;
                this.openApplicationModal(jobId);
            });
        });
    },

    createJobCard(job) {
        const displaySkills = job.skillsRequired.slice(0, 3);
        const remainingSkills = job.skillsRequired.length - 3;

        return `
            <div class="job-card">
                <div class="job-card-header">
                    <div class="job-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <span class="job-badge">${job.applicants.length} Applied</span>
                </div>

                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">${job.company}</div>
                <p class="job-description">${job.description}</p>

                <div class="job-meta">
                    <div class="job-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${job.location}
                    </div>
                    <div class="job-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        ${job.salary}
                    </div>
                </div>

                <div class="job-skills">
                    ${displaySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    ${remainingSkills > 0 ? `<span class="skill-tag" style="background: #f3f4f6; color: #6b7280;">+${remainingSkills}</span>` : ''}
                </div>

                <div class="job-footer">
                    <span class="job-salary">${job.salary}</span>
                    <button class="btn-apply" data-job-id="${job._id}">Apply Now</button>
                </div>
            </div>
        `;
    },

    filterJobs(searchTerm) {
        const jobs = API.getJobs();
        const filtered = jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderJobs(filtered);
    },

    openApplicationModal(jobId) {
        const job = API.getJobs().find(j => j._id === jobId);
        if (!job) return;

        this.selectedJob = job;
        
        document.getElementById('modalJobTitle').textContent = `Apply for ${job.title}`;
        document.getElementById('modalCompany').textContent = `at ${job.company}`;
        document.getElementById('requiredSkills').textContent = `Required: ${job.skillsRequired.join(', ')}`;
        document.getElementById('applicantSkills').value = '';
        
        document.getElementById('applicationModal').classList.add('active');
    },

    closeModal() {
        document.getElementById('applicationModal').classList.remove('active');
        this.selectedJob = null;
    },

    submitApplication() {
        const skillsInput = document.getElementById('applicantSkills').value.trim();
        
        if (!skillsInput) {
            alert('Please enter your skills');
            return;
        }

        const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
        
        const result = API.applyToJob(this.selectedJob._id, skills);
        
        if (result.success) {
            alert(`Application submitted successfully!\n\nYour ATS Score: ${result.atsScore}%`);
            this.closeModal();
            this.renderJobs();
            this.renderStats();
        } else {
            alert(result.message);
        }
    }
};

// Make available globally
window.StudentDashboard = StudentDashboard;