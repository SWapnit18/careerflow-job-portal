// Company Dashboard Module
const CompanyDashboard = {
    init() {
        this.renderStats();
        this.renderJobs();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Submit job button
        document.getElementById('submitJobBtn').addEventListener('click', () => {
            this.submitJob();
        });
    },

    renderStats() {
        const companyJobs = API.getCompanyJobs();
        const totalApplicants = companyJobs.reduce((sum, job) => sum + job.applicants.length, 0);
        
        let totalScore = 0;
        let scoreCount = 0;
        companyJobs.forEach(job => {
            job.applicants.forEach(app => {
                totalScore += app.atsScore;
                scoreCount++;
            });
        });
        
        const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
        
        document.getElementById('activeJobs').textContent = companyJobs.length;
        document.getElementById('totalApplicants').textContent = totalApplicants;
        document.getElementById('avgAtsScore').textContent = avgScore + '%';
    },

    renderJobs() {
        const jobs = API.getCompanyJobs();
        const container = document.getElementById('companyJobsList');
        
        if (jobs.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280;">No jobs posted yet. Click "Post Job" to create your first job listing.</p>';
            return;
        }

        container.innerHTML = jobs.map(job => this.createCompanyJobCard(job)).join('');
    },

    createCompanyJobCard(job) {
        return `
            <div class="company-job-card">
                <div class="company-job-header">
                    <div style="display: flex; align-items: start; gap: 16px;">
                        <div class="job-icon" style="width: 56px; height: 56px;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="job-title">${job.title}</h3>
                            <p class="job-description" style="margin: 8px 0 12px 0;">${job.description}</p>
                            <div class="job-meta">
                                <div class="job-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    ${job.location}
                                </div>
                                <div class="job-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    Posted ${job.postedDate}
                                </div>
                                <div class="job-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    ${job.salary}
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="job-badge" style="background: #d1fae5; color: #059669;">
                        ${job.applicants.length} Applicants
                    </span>
                </div>

                ${job.applicants.length > 0 ? this.renderApplicants(job.applicants) : ''}
            </div>
        `;
    },

    renderApplicants(applicants) {
        return `
            <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; margin-top: 24px;">
                <h4 style="font-weight: 600; color: #111827; margin-bottom: 16px;">Applicants</h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${applicants.map(app => this.createApplicantCard(app)).join('')}
                </div>
            </div>
        `;
    },

    createApplicantCard(applicant) {
        const scoreColor = applicant.atsScore >= 70 ? '#059669' : 
                          applicant.atsScore >= 50 ? '#d97706' : '#dc2626';
        
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f9fafb; padding: 16px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="user-avatar" style="width: 40px; height: 40px;">
                        ${applicant.studentName.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight: 500; color: #111827;">${applicant.studentName}</div>
                        <div style="font-size: 12px; color: #6b7280;">
                            Applied ${new Date(applicant.appliedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="text-align: right;">
                        <div style="font-size: 18px; font-weight: 700; color: ${scoreColor};">
                            ${applicant.atsScore}%
                        </div>
                        <div style="font-size: 12px; color: #6b7280;">ATS Score</div>
                    </div>
                    <button class="btn-apply" style="padding: 8px 16px; font-size: 14px;">
                        View Profile
                    </button>
                </div>
            </div>
        `;
    },

    submitJob() {
        const title = document.getElementById('jobTitle').value.trim();
        const description = document.getElementById('jobDescription').value.trim();
        const location = document.getElementById('jobLocation').value.trim();
        const salary = document.getElementById('jobSalary').value.trim();
        const skillsInput = document.getElementById('jobSkills').value.trim();

        if (!title || !description || !skillsInput) {
            alert('Please fill in all required fields (Title, Description, Skills)');
            return;
        }

        const skillsRequired = skillsInput.split(',').map(s => s.trim()).filter(s => s);

        const result = API.createJob({
            title,
            description,
            location: location || 'Not specified',
            salary: salary || 'Negotiable',
            skillsRequired
        });

        if (result.success) {
            alert('Job posted successfully!');
            
            // Clear form
            document.getElementById('jobTitle').value = '';
            document.getElementById('jobDescription').value = '';
            document.getElementById('jobLocation').value = '';
            document.getElementById('jobSalary').value = '';
            document.getElementById('jobSkills').value = '';
            
            // Switch to dashboard view
            document.querySelector('.nav-link[data-page="dashboard"]').click();
            
            // Refresh jobs list
            this.renderJobs();
            this.renderStats();
        } else {
            alert(result.message);
        }
    }
};

// Make available globally
window.CompanyDashboard = CompanyDashboard;