function forget_init() {
    var email = document.getElementById("inputemail");
    var btnForget = document.getElementById("btnForget");

    btnForget.addEventListener('click', function(e) {
        firebase.auth().sendPasswordResetEmail(email.value).then(function() {
            // Email sent.
            alert("更改密碼Email已發送");
            email.value = "";
        }).catch((e) => {
            alert(e);
        });
    });
}


window.onload = function() {
    forget_init();
}