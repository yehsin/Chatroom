var database = firebase.database();
var chatroom_name;
var notify = {
    body: '\\ ^o^ /',
    icon: '/images/favicon.ico'
}

function herf(e) {
    chatroom_name = e.innerHTML;
    console.log(chatroom_name);
    window.open("chatroom.html", "newwindow");
}

function openwindow() {
    window.open("CreatGroup.html", "newwindow", "height=300, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}

function index_init() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    var notification = new Notification('Hi there!', notify);
                }
            });
            document.getElementById("invite_wrapper").href = "#";
            document.getElementById("invite_wrapper").addEventListener('click', openwindow);
            document.getElementById('creatgroup_top').addEventListener('click', openwindow);
            username = [];
            total_groups = [];
            context_contain = [];
            username = user.email.split("@");
            document.getElementById("ID").innerHTML = username[0];
            document.getElementById("logout_menu").innerHTML +=
                "<a id = 'logout-btn' class='nav-dropdown-item' href='login.html'>logout</a>";
            var out = document.getElementById("logout-btn");
            out.addEventListener('click', function() {
                firebase.auth().signOut().then(function(result) {
                    alert("sucess");
                }).catch(function(error) {
                    // An error happened.
                    alert("error");
                });
            })

            document.getElementById("login_wrapper").addEventListener('click', function() {
                firebase.auth().signOut().then(function(result) {
                    alert("sucess");
                }).catch(function(error) {
                    // An error happened.
                    alert("error");
                });
            })
            var groups = firebase.database().ref('user_list').child(username[0]).child('groups');
            console.log(groups.on);

            groups.once('value').then(function(data) {
                data.forEach(element => {
                    console.log(element);
                    total_groups.push("<button class='dropdown-item' id='" + element.key + "' onclick = herf(" + element.key + ")>" + element.key + "</button>")
                    document.getElementById("groups").innerHTML = total_groups.join('');

                })
            }).catch(e => console.log(e.message));

            document.getElementById('profile_btn').addEventListener('click', function() {

                var profile = document.getElementById('profile_ctx').value;

                document.getElementById('user_profile').innerText = profile;
            });
        } else {
            document.getElementById("invite_wrapper").href = "login.html";
            document.getElementById('creatgroup_top').href = "login.html"
        }


    });
}

window.onload = function() {
    index_init();
}