// Student Registration

var studentForm = document.getElementById("studentForm");

if (studentForm) {

    studentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var students = JSON.parse(localStorage.getItem("students")) || [];

        var student = {
            name: document.getElementById("studentName").value,
            rollNumber: document.getElementById("rollNumber").value,
            email: document.getElementById("studentEmail").value,
            password: document.getElementById("studentPassword").value,
            phone: document.getElementById("studentPhone").value,
            branch: document.getElementById("studentBranch").value,
            year: document.getElementById("studentYear").value
        };

        var found = false;

        for (var i = 0; i < students.length; i++) {
            if (students[i].email === student.email) {
                found = true;
            }
        }

        if (found) {

            document.getElementById("message").innerHTML =
                "Email already registered!";

        } else {

            students.push(student);

            localStorage.setItem("students", JSON.stringify(students));

            alert("Student registered successfully!");

            window.location.href = "index.html";
        }

    });

}


// Company Registration

var companyForm = document.getElementById("companyForm");

if (companyForm) {

    companyForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var companies = JSON.parse(localStorage.getItem("companies")) || [];

        var company = {
            name: document.getElementById("companyName").value,
            contact: document.getElementById("contactPerson").value,
            email: document.getElementById("companyEmail").value,
            password: document.getElementById("companyPassword").value,
            jobRole: document.getElementById("jobRole").value,
            package: document.getElementById("package").value,
            location: document.getElementById("companyLocation").value
        };

        var found = false;

        for (var i = 0; i < companies.length; i++) {
            if (companies[i].email === company.email) {
                found = true;
            }
        }

        if (found) {

            document.getElementById("message").innerHTML =
                "Email already registered!";

        } else {

            companies.push(company);

            localStorage.setItem("companies", JSON.stringify(companies));

            alert("Company registered successfully!");

            window.location.href = "index.html";
        }

    });

}


// Login

var loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        var type = document.getElementById("loginType").value;

        var email = document.getElementById("loginEmail").value;

        var password = document.getElementById("loginPassword").value;

        var users = [];

        if (type === "student") {

            users = JSON.parse(localStorage.getItem("students")) || [];

        } else if (type === "company") {

            users = JSON.parse(localStorage.getItem("companies")) || [];

        }

        var foundUser = null;

        for (var i = 0; i < users.length; i++) {

            if (users[i].email === email &&
                users[i].password === password) {

                foundUser = users[i];

            }

        }

        if (foundUser !== null) {

            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            localStorage.setItem("loggedInType", type);

            window.location.href = "dashboard.html";

        } else {

            document.getElementById("message").innerHTML =
                "Invalid email or password!";

        }

    });

}


// Display Details

var details = document.getElementById("details");

if (details) {

    var user = JSON.parse(localStorage.getItem("loggedInUser"));

    var type = localStorage.getItem("loggedInType");

    if (user === null) {

        window.location.href = "index.html";

    } else {

        var output = "";

        if (type === "student") {

            document.getElementById("welcome").innerHTML =
                "Welcome, " + user.name;

            output = "<div class='detail'><b>Student Name:</b> " + user.name + "</div>";

            output += "<div class='detail'><b>Roll Number:</b> " + user.rollNumber + "</div>";

            output += "<div class='detail'><b>Email:</b> " + user.email + "</div>";

            output += "<div class='detail'><b>Phone:</b> " + user.phone + "</div>";

            output += "<div class='detail'><b>Branch:</b> " + user.branch + "</div>";

            output += "<div class='detail'><b>Year:</b> " + user.year + "</div>";

        } else if (type === "company") {

            document.getElementById("welcome").innerHTML =
                "Welcome, " + user.name;

            output = "<div class='detail'><b>Company Name:</b> " + user.name + "</div>";

            output += "<div class='detail'><b>Contact Person:</b> " + user.contact + "</div>";

            output += "<div class='detail'><b>Email:</b> " + user.email + "</div>";

            output += "<div class='detail'><b>Job Role:</b> " + user.jobRole + "</div>";

            output += "<div class='detail'><b>Package:</b> " + user.package + "</div>";

            output += "<div class='detail'><b>Location:</b> " + user.location + "</div>";

        }

        details.innerHTML = output;

    }

}


// Logout

function logout() {

    localStorage.removeItem("loggedInUser");

    localStorage.removeItem("loggedInType");

    window.location.href = "index.html";

}