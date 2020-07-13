async function init() {

    btnGroup.addEventListener('click', receive);
}

function datapush() {


    total_groups = [];
    return new Promise(resolve => {
        let username = [];
        firebase.auth().onAuthStateChanged(function(user) {
            username = user.email.split("@");
            var Groupname = document.getElementById('inputGroupName');

            firebase.database().ref('user_list').child(username[0]).child('groups').child(Groupname.value).set('member');
            var postref = firebase.database().ref('groups').child(Groupname.value);
            resolve(postref.set({
                member: username[0]
            }));

        });
    });
}

async function receive() {
    await datapush();
    window.close();
}

window.onload = function() {
    init();
};