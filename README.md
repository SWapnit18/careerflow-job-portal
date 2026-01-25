JobPortal - Complete HTML/CSS/JavaScript Application
A modern job portal application with separate dashboards for students and companies, featuring ATS (Applicant Tracking System) scoring.
📁 Folder Structure
job-portal/
│
├── index.html          # Main HTML file
│
├── css/
│   └── style.css       # All styles (embedded in index.html)
│
├── js/
│   ├── data.js         # Mock API & Jobs data
│   ├── auth.js         # Login & Register logic
│   ├── student.js      # Student dashboard logic
│   ├── company.js      # Company dashboard logic
│   └── app.js          # Main app controller
│
└── assets/
    └── icons/          # (Optional - using inline SVG)
🚀 How to Run
Option 1: Direct Open

Extract all files maintaining the folder structure
Simply open index.html in your browser
No server required!

Option 2: With Local Server (Recommended)
bash# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
Then open: http://localhost:8000
📋 Features
For Students

✅ Browse available jobs
✅ Search jobs by title, company, or location
✅ View job details with required skills
✅ Apply to jobs with skill matching
✅ Get instant ATS score based on skill match
✅ Dashboard with statistics

For Companies

✅ Post new job listings
✅ View all posted jobs
✅ See all applicants per job
✅ View ATS scores for each applicant
✅ Dashboard with analytics

General

✅ User registration and login
✅ Role-based dashboards (Student/Company)
✅ Modern, responsive UI
✅ Gradient design with smooth animations
✅ Local storage for session persistence

🎨 File Descriptions
index.html
Main HTML structure with:

Authentication page
Student dashboard layout
Company dashboard layout
Application modal
Embedded CSS styles

js/data.js

Mock database (DB object)
API functions for all operations
Sample job listings
User management

js/auth.js

Login/Register toggle
Form validation
Session management
Token storage

js/student.js

Job browsing and filtering
Application submission
ATS score calculation
Stats rendering

js/company.js

Job posting form
Applicant management
Company dashboard stats
Job listings

js/app.js

Main application controller
Navigation management
Dashboard initialization
User info updates

🧪 Test Accounts
Create Your Own

Click "Don't have an account? Register"
Fill in your details
Select role (Student or Company)
Click Register
Login with your credentials

🎯 How to Use
As a Student:

Register with role "Student"
Login to view dashboard
Search for jobs
Click "Apply Now" on any job
Enter your skills (comma-separated)
Get instant ATS score!

As a Company:

Register with role "Company"
Login to view dashboard
Click "Post Job" in navigation
Fill in job details
View applicants and their ATS scores

🔧 Customization
Adding More Jobs
Edit js/data.js and add to the jobs array:
javascript{
    _id: '4',
    title: 'Your Job Title',
    company: 'Your Company',
    skillsRequired: ['Skill1', 'Skill2'],
    description: 'Job description',
    location: 'Location',
    salary: '$XX - $XX',
    postedDate: '2026-01-24',
    applicants: []
}
Changing Colors
Edit the CSS gradients in index.html:

Primary gradient: #2563eb to #9333ea
Stat cards: .stat-card.blue/green/purple/orange

Connecting to Real Backend
Replace API functions in js/data.js with real API calls:
javascriptasync login(email, password) {
    const response = await fetch('YOUR_API_URL/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}
📱 Responsive Design

Desktop: Full layout with all features
Tablet: Adjusted grid layouts
Mobile: Single column, simplified navigation

🔒 Security Note
This is a frontend demo using localStorage. For production:

Implement proper backend authentication
Use secure token storage
Add input sanitization
Implement HTTPS
Add CSRF protection

📄 License
Free to use for personal and educational projects.
🤝 Support
For issues or questions, refer to the inline code comments.
