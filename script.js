
// Get data from Local Storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data in Local Storage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Create default Admin account
if (!localStorage.getItem("admin")) {
    localStorage.setItem("admin", JSON.stringify({
        name: "Placement Admin",
        email: "admin@college.com",
        password: "admin123"
    }));
}


// STUDENT REGISTRATION

const studentForm = document.getElementById("studentForm");

if (studentForm) {
    studentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let students = getData("students");

        let student = {
            id: Date.now(),
            name: document.getElementById("studentName").value,
            rollNumber: document.getElementById("rollNumber").value,
            email: document.getElementById("studentEmail").value,
            password: document.getElementById("studentPassword").value,
            phone: document.getElementById("studentPhone").value,
            branch: document.getElementById("studentBranch").value,
            year: document.getElementById("studentYear").value,
            cgpa: document.getElementById("studentCgpa").value
        };

        let exists = students.some(function(item) {
            return item.email.toLowerCase() === student.email.toLowerCase()
                || item.rollNumber.toLowerCase() === student.rollNumber.toLowerCase();
        });

        if (exists) {
            document.getElementById("message").innerText =
                "Email or Roll Number already registered!";
        } else {
            students.push(student);
            saveData("students", students);

            alert("Student registered successfully!");
            window.location.href = "index.html";
        }
    });
}


// COMPANY REGISTRATION

const companyForm = document.getElementById("companyForm");

if (companyForm) {
    companyForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let companies = getData("companies");

        let company = {
            id: Date.now(),
            name: document.getElementById("companyName").value,
            contact: document.getElementById("contactPerson").value,
            email: document.getElementById("companyEmail").value,
            password: document.getElementById("companyPassword").value,
            location: document.getElementById("companyLocation").value
        };

        let exists = companies.some(function(item) {
            return item.email.toLowerCase() === company.email.toLowerCase();
        });

        if (exists) {
            document.getElementById("message").innerText =
                "Company email already registered!";
        } else {
            companies.push(company);
            saveData("companies", companies);

            alert("Company registered successfully!");
            window.location.href = "index.html";
        }
    });
}


// LOGIN FOR ALL THREE ROLES

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let type = document.getElementById("userType").value;
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        let foundUser = null;

        if (type === "admin") {
            let admin = JSON.parse(localStorage.getItem("admin"));

            if (admin.email === email && admin.password === password) {
                foundUser = admin;
            }
        }

        if (type === "student") {
            let students = getData("students");

            foundUser = students.find(function(user) {
                return user.email === email &&
                       user.password === password;
            });
        }

        if (type === "company") {
            let companies = getData("companies");

            foundUser = companies.find(function(user) {
                return user.email === email &&
                       user.password === password;
            });
        }

        if (foundUser) {
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(foundUser)
            );

            localStorage.setItem("loggedInType", type);

            window.location.href = "dashboard.html";
        } else {
            document.getElementById("message").innerText =
                "Invalid role, email or password!";
        }
    });
}


// FUNCTION TO CREATE TABLES

function makeTable(headers, rows) {

    if (rows.length === 0) {
        return "<p class='empty'>No records available.</p>";
    }

    let html = "<div class='table-wrap'><table><tr>";

    headers.forEach(function(header) {
        html += "<th>" + header + "</th>";
    });

    html += "</tr>";

    rows.forEach(function(row) {
        html += "<tr>";

        row.forEach(function(value) {
            html += "<td>" + value + "</td>";
        });

        html += "</tr>";
    });

    html += "</table></div>";

    return html;
}


// LOAD DASHBOARD

const welcome = document.getElementById("welcome");

if (welcome) {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let type = localStorage.getItem("loggedInType");

    if (!user || !type) {
        window.location.href = "index.html";
    } else {

        welcome.innerText = "Welcome, " + user.name + " (" + type + ")";

        if (type === "admin") {
            showAdminDashboard();
        }

        if (type === "student") {
            showStudentDashboard(user);
        }

        if (type === "company") {
            showCompanyDashboard(user);
        }
    }
}


// ADMIN DASHBOARD

function showAdminDashboard() {

    document.getElementById("adminSection").classList.remove("hidden");

    let students = getData("students");
    let companies = getData("companies");
    let jobs = getData("jobs");
    let applications = getData("applications");

    document.getElementById("adminStats").innerHTML =
        "<div class='stat'><strong>" + students.length +
        "</strong>Students</div>" +

        "<div class='stat'><strong>" + companies.length +
        "</strong>Companies</div>" +

        "<div class='stat'><strong>" + jobs.length +
        "</strong>Jobs</div>" +

        "<div class='stat'><strong>" + applications.length +
        "</strong>Applications</div>";

    document.getElementById("adminStudents").innerHTML = makeTable(
        ["Name", "Roll Number", "Email", "Branch", "Year", "CGPA"],

        students.map(function(s) {
            return [
                s.name, s.rollNumber, s.email,
                s.branch, s.year, s.cgpa
            ];
        })
    );

    document.getElementById("adminCompanies").innerHTML = makeTable(
        ["Company", "Contact Person", "Email", "Location"],

        companies.map(function(c) {
            return [
                c.name, c.contact, c.email, c.location
            ];
        })
    );

    document.getElementById("adminJobs").innerHTML = makeTable(
        ["Job", "Company", "Package", "Branches", "Minimum CGPA"],

        jobs.map(function(j) {
            return [
                j.title, j.companyName, j.package + " LPA",
                j.branches, j.minCgpa
            ];
        })
    );

    document.getElementById("adminApplications").innerHTML = makeTable(
        ["Student", "Roll Number", "Job", "Company", "Status"],

        applications.map(function(a) {
            return [
                a.studentName, a.rollNumber,
                a.jobTitle, a.companyName, a.status
            ];
        })
    );
}


// STUDENT DASHBOARD

function showStudentDashboard(user) {

    document.getElementById("studentSection").classList.remove("hidden");

    document.getElementById("studentProfile").innerHTML =
        "<b>Roll Number:</b> " + user.rollNumber + "<br>" +
        "<b>Email:</b> " + user.email + "<br>" +
        "<b>Phone:</b> " + user.phone + "<br>" +
        "<b>Branch:</b> " + user.branch + "<br>" +
        "<b>Year:</b> " + user.year + "<br>" +
        "<b>CGPA:</b> " + user.cgpa;

    displayAvailableJobs(user);
    displayStudentApplications(user);
}


// SHOW ELIGIBLE JOBS

function displayAvailableJobs(user) {

    let jobs = getData("jobs");
    let applications = getData("applications");

    let eligibleJobs = jobs.filter(function(job) {

        let branches = job.branches.toLowerCase()
            .split(",")
            .map(function(item) {
                return item.trim();
            });

        return branches.includes(user.branch.toLowerCase()) &&
               Number(user.cgpa) >= Number(job.minCgpa);
    });

    let rows = eligibleJobs.map(function(job) {

        let alreadyApplied = applications.some(function(app) {
            return app.jobId === job.id &&
                   app.studentId === user.id;
        });

        let action;

        if (alreadyApplied) {
            action = "Already Applied";
        } else {
            action =
                "<button class='action-button' onclick='applyForJob(" +
                job.id + ")'>Apply</button>";
        }

        return [
            job.title,
            job.companyName,
            job.package + " LPA",
            job.branches,
            job.minCgpa,
            action
        ];
    });

    document.getElementById("availableJobs").innerHTML = makeTable(
        ["Job Title", "Company", "Package", "Branches", "Minimum CGPA", "Action"],
        rows
    );
}


// APPLY FOR JOB

function applyForJob(jobId) {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    let jobs = getData("jobs");
    let applications = getData("applications");

    let job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job not found!");
        return;
    }

    let alreadyApplied = applications.some(function(app) {
        return app.jobId === jobId &&
               app.studentId === user.id;
    });

    if (alreadyApplied) {
        alert("You have already applied!");
        return;
    }

    applications.push({

        id: Date.now(),
        jobId: job.id,
        studentId: user.id,
        studentName: user.name,
        rollNumber: user.rollNumber,
        companyId: job.companyId,
        companyName: job.companyName,
        jobTitle: job.title,
        status: "Applied"

    });

    saveData("applications", applications);

    alert("Application submitted successfully!");

    displayAvailableJobs(user);
    displayStudentApplications(user);
}


// STUDENT APPLICATION STATUS

function displayStudentApplications(user) {

    let applications = getData("applications").filter(function(app) {
        return app.studentId === user.id;
    });

    let rows = applications.map(function(app) {
        return [
            app.jobTitle,
            app.companyName,
            app.status
        ];
    });

    document.getElementById("myApplications").innerHTML = makeTable(
        ["Job Title", "Company", "Application Status"],
        rows
    );
}


// COMPANY DASHBOARD

function showCompanyDashboard(user) {

    document.getElementById("companySection").classList.remove("hidden");

    document.getElementById("companyProfile").innerHTML =
        "<b>Company:</b> " + user.name + "<br>" +
        "<b>Contact Person:</b> " + user.contact + "<br>" +
        "<b>Email:</b> " + user.email + "<br>" +
        "<b>Location:</b> " + user.location;

    displayCompanyJobs(user);
    displayCompanyApplicants(user);
}


// POST A JOB

const jobForm = document.getElementById("jobForm");

if (jobForm) {

    jobForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let user = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!user || localStorage.getItem("loggedInType") !== "company") {
            alert("Please log in as a company!");
            return;
        }

        let jobs = getData("jobs");

        let job = {

            id: Date.now(),
            companyId: user.id,
            companyName: user.name,
            title: document.getElementById("jobTitle").value,
            description: document.getElementById("jobDescription").value,
            package: document.getElementById("jobPackage").value,
            branches: document.getElementById("jobBranches").value,
            minCgpa: document.getElementById("jobCgpa").value

        };

        jobs.push(job);

        saveData("jobs", jobs);

        alert("Job posted successfully!");

        jobForm.reset();

        displayCompanyJobs(user);
    });
}


// DISPLAY COMPANY JOB POSTS

function displayCompanyJobs(user) {

    let jobs = getData("jobs").filter(function(job) {
        return job.companyId === user.id;
    });

    let rows = jobs.map(function(job) {
        return [
            job.title,
            job.package + " LPA",
            job.branches,
            job.minCgpa,
            job.description
        ];
    });

    document.getElementById("companyJobs").innerHTML = makeTable(
        ["Job Title", "Package", "Branches", "Minimum CGPA", "Description"],
        rows
    );
}


// DISPLAY COMPANY APPLICANTS

function displayCompanyApplicants(user) {

    let applications = getData("applications").filter(function(app) {
        return app.companyId === user.id;
    });

    let html = "";

    if (applications.length === 0) {

        html = "<p class='empty'>No students have applied yet.</p>";

    } else {

        html = "<div class='table-wrap'><table>" +
            "<tr><th>Student</th><th>Roll Number</th>" +
            "<th>Job</th><th>Status</th><th>Update Status</th></tr>";

        applications.forEach(function(app) {

            html += "<tr>";

            html += "<td>" + app.studentName + "</td>";
            html += "<td>" + app.rollNumber + "</td>";
            html += "<td>" + app.jobTitle + "</td>";
            html += "<td>" + app.status + "</td>";

            html += "<td><select onchange='updateApplicationStatus(" +
                app.id + ", this.value)'>";

            ["Applied", "Shortlisted", "Selected", "Rejected"].forEach(
                function(status) {

                    let selected = app.status === status ? "selected" : "";

                    html += "<option value='" + status + "' " +
                        selected + ">" + status + "</option>";
                }
            );

            html += "</select></td>";
            html += "</tr>";
        });

        html += "</table></div>";
    }

    document.getElementById("companyApplicants").innerHTML = html;
}


// UPDATE APPLICATION STATUS

function updateApplicationStatus(applicationId, newStatus) {

    let applications = getData("applications");

    applications = applications.map(function(app) {

        if (app.id === applicationId) {
            app.status = newStatus;
        }

        return app;
    });

    saveData("applications", applications);

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    displayCompanyApplicants(user);
}


// LOGOUT

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInType");

        window.location.href = "index.html";
    });
}
