function invite_init() {

    var btnInvite = document.getElementById("btnInvite");
    btnInvite.addEventListener("click", add);
}

async function add() {
    await addfriend();
    window.close();
}

function addfriend() {

    var groups = window.opener.document.getElementById("ID").innerHTML;
    var No_friend = true;
    return new Promise((resolve, reject) => {
        var invite = document.getElementById("inputFriend").value;
        var people = firebase.database().ref('user_list');

        people.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                console.log(childSnapshot.key);
                if (invite == childSnapshot.key) {
                    No_friend = false;
                    return resolve(
                        people.child(invite).child('groups').child(groups).set('member'),
                        firebase.database().ref('groups').child(groups).child(invite).set('member')
                    );
                }
            });
            if (No_friend == true) reject(alert("No User"));
        })



    });
}

window.onload = () => {
    invite_init();
}