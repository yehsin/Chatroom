function initApp() {
    // Login with Email/Password
    var txtUsername = document.getElementById('inputUsername');
    var txtEmail = document.getElementById('inputEmail');
    var txtPassword = document.getElementById('inputPassword');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btnGoogle');
    var btnSignUp = document.getElementById('btnSignUp');
    var rmcheck = document.getElementById("rememberme");

    if (localStorage.email != "") {
        txtEmail.value = localStorage.email;
        txtPassword.value = localStorage.pass;
        rmcheck.checked = true;
    }

    btnLogin.addEventListener('click', function() {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()" and clean input field
        firebase.auth().signInWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then(() => {
                window.location.assign("index.html");
            })
            .catch(function(error) {
                var errorMessage = error.message;
                create_alert("error", errorMessage);
                txtEmail.value = "";
                txtPassword.value = "";
            });
        if (rmcheck.checked == true) {
            localStorage.email = txtEmail.value;
            localStorage.pass = txtPassword.value;
            localStorage.checked = true;
        } else {
            localStorage.email = "";
            localStorage.pass = "";
            localStorage.checked = "";
            alert("failed");
        }
    });


    btnGoogle.addEventListener('click', function() {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            var txt = result.user.email.split("@");
            firebase.database().ref('user_list').child(txt[0]).set({
                'user_password': '***'
            })
            window.location.assign("index.html");
        }).catch(function(error) {
            var errorMessage = error.message;
            var credential = error.credential;
            create_alert("error", error.message);
        });

    });

    btnSignUp.addEventListener('click', function() {
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        firebase.auth().createUserWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then((result) => {
                var txt = txtEmail.value.split("@");
                firebase.database().ref('user_list').child(txt[0]).set({
                    'user_password': txtPassword.value
                })
                create_alert("success", result.message);
                txtEmail.value = "";
                txtPassword.value = "";
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorMessage = error.message;
                create_alert("error", errorMessage);
                txtEmail.value = "";
                txtUsername.value = "";
                txtPassword.value = "";
            });
    });
}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}

window.onload = function() {
    initApp();
};