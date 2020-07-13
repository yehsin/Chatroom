function show_commit(email, commit, time, v) {
    //add commit-------------------------------------------------------
    var new_comment = document.getElementById('post_list');

    var div = document.createElement("div");
    div.innerHTML = "<h6 class='border-bottom border-gray pb-2 mb-0'>" + time;
    div.className = "my-3 p-3 bg-white rounded box-shadow";
    div.style.height = '150px';
    //div.style.posotion = "absolute";

    var p = document.createElement("p");
    p.className = "media-body pb-3 mb-0 small lh-125 border-buttom border-gray";
    if (v == 1) p.style.color = 'blue';
    else p.style.color = 'green';

    var div2 = document.createElement("div");
    div2.className = "media text-muted pt-3 d-inline-block";
    if (v == 1) div2.style.float = 'right';

    var strong = document.createElement('strong');
    strong.className = "d-block text-gray-dark"
    strong.innerHTML = email;

    var comment_node = document.createTextNode(commit);


    p.appendChild(strong);
    p.appendChild(comment_node);
    div2.appendChild(p);
    div.appendChild(div2);
    new_comment.appendChild(div);
    //------------------------------------------------------------
}

function chatroom_init() {
    var cookieValue = window.opener.chatroom_name;
    document.getElementById("ID").innerHTML = cookieValue;

    post_txt = document.getElementById('comment');
    post_btn = document.getElementById("post_btn");

    user_name = [];

    firebase.auth().onAuthStateChanged(function(user) {
        user_name = user.email.split('@');
    })

    post_btn.addEventListener('click', function() {

        if (post_txt.value != "") {
            var postref = firebase.database().ref('groups').child(cookieValue).child('com_list');
            var commit = postref.push();
            const timestamp = new Date();
            var Now_time = (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes() + ':' + timestamp.getSeconds();
            commit.set({
                "my_email": user_name[0],
                "my_commit": post_txt.value,
                'time': Now_time
            });
            post_txt.value = "";
        }
    });



    var postsref = firebase.database().ref('groups').child(cookieValue).child('com_list');
    // List for store posts html
    var total_post = [];
    // Counter for checking history post update complete
    var first_count = 0;
    // Counter for checking when to update new post
    var second_count = 0;

    postsref.once('value').then(function(snapshot) {
            snapshot.forEach((childSnapshot) => {
                var Data = childSnapshot.val();
                first_count += 1;
                if (Data.my_email == user_name[0]) v = 1;
                else v = 0;
                show_commit(Data.my_email, Data.my_commit, Data.time, v);
            });

            window.scrollTo(0, document.body.scrollHeight);

            postsref.on('child_added', (data) => {
                console.log(second_count, first_count);
                second_count += 1;
                if (second_count > first_count) {
                    var lData = data.val();
                    show_commit(lData.my_email, lData.my_commit, lData.time, 1);
                    window.scrollTo(0, document.body.scrollHeight);


                }
            });
        })
        .catch(e => console.log(e.message));

}

function openwindow() {
    window.open("invite.html", "invitewindow", "height=300, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}

window.onload = function() {

    chatroom_init();
};