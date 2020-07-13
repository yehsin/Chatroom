Chatroom proiect report
===

[TOC]

# Basic component
## Membership Mechanism
>> * Write in login.js
>> **Sign UP**
>> 1. When Signup button click
```javascript=
btnSignUp.addEventListener('click',function())  
```
>> 2. Use firebase.auth().creatUserWithEmailAndPassword to build signup function.
```javascript=
firebase.auth().createUserWithEmailAndPassword(txtEmail.value, txtPassword.value).then((result) => {}
```

>> **Sign In**
>> 1. Use signWithEmailAndPassword to build sign in function
>> 2. When sign in, window will direct to index.html
```javascript=
btnLogin.addEventListener('click', function() {
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

```

## Host Firebase page
>> [My Chatroom](https://webclass-chatroom.web.app)

## Database read/write
>> * Write in database.rules.json
>> 1. User need to be auth that he/she can read and write.
```json
{

    "rules": {
        ".read": "(auth != null)",
        ".write": "(auth != null)"
    }
}

```

## RWD
>> * write in bootstrap class and css
>> 1. In index
**Before** ![](https://i.imgur.com/Ve6FStm.png)
**After** ![](https://i.imgur.com/pNghuEs.png)
>> 2. In chatroom
**Before** ![](https://i.imgur.com/LtacFHL.png)
**After** ![](https://i.imgur.com/6w2ce0k.png)

Note : Cute cat!


## Topic Key Functions
>> 1. When login we can creat a group or join a group that you had already joined.
>> >> In invite.js, add function is a promise function that it will wait the database load all group that you owned then close the window.
```javascript=
async function add() {
    await addfriend();
    window.close();
}
```
>> 2. The page will load history and you can chat with somebody who are in the chatroom.
>> >> In chatroom.js, there will be a chatroom name on left top. I use window.opener to get it'a parent page to get chatroom name.
```javascript=
var cookieValue = window.opener.chatroom_name;
document.getElementById("ID").innerHTML = cookieValue;
```
>> >> User post new comment and it will upload to database
```javascript=
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
```
>> >>　load history by read once and on.
```javascript=
postsref.once('value').then(function(snapshot) {
            snapshot.forEach((childSnapshot) => {
                var Data = childSnapshot.val();
                first_count += 1;
                show_commit(Data.my_email, Data.my_commit, Data.time, v);
            });
            window.scrollTo(0, document.body.scrollHeight); // scroll to bottom

            postsref.on('child_added', (data) => {
                console.log(second_count, first_count);
                second_count += 1;
                if (second_count > first_count) {
                    var lData = data.val();
                    show_commit(lData.my_email, lData.my_commit, lData.time, 1);
                    window.scrollTo(0, document.body.scrollHeight);
                }
            });
        }
    )
```
>> >> 
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|15%|Y|
|Firebase Page|5%|Y|
|Database|15%|Y|
|RWD|15%|Y|
|Topic Key Function|20%|Y|

# Advanced component
## Sign Up/In with Google
>> * write in login.js
>> >> 1. Use GoogleAuthProvider to sign in google and take email as username.
```javascript=
btnGoogle.addEventListener('click', function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var txt = result.user.email.split("@");
            firebase.database().ref('user_list').child(txt[0]).set({
                'user_password': '***'
            })
            window.location.assign("index.html");
```
## Add Chrome notification
>> * write in index.js
>> >> Use Notification function to creat a notification and it occurs after the user login and return to index.html
```javascript=
var notify = {
    body: '\\ ^o^ /',
    icon: '/images/favicon.ico'
}
Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    var notification = new Notification('Hi there!', notify);
                }
            });
```
![](https://i.imgur.com/CTh6Dw1.png)

## Use CSS animation
>> 1. Write in wrapper.css for index.html
![](https://i.imgur.com/pxzY6Qi.png)
![](https://i.imgur.com/HfkAL8U.png)
>> 2. Write in hw1.css for chatroom.html
![](https://i.imgur.com/pSh0hzH.png)

## Cross-site security
>> * Write in chatroom.js
>> * show_comment()
>> I don't use innerText and innerHTML to prevent the cross-site attack. Because I want to add some html tag custom by js also erase the cross-site attack.
>> ***So, I use creatElement to write div and h and p tags and append them together.Finally creat a creatTextNode to append after them.***
>> **But**, the shortcomes is it can't be change the text attribute directly. It is changed by p tag. 
```javascript=
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
```
>> And it just look like this:![](https://i.imgur.com/2vCkQGu.png)

## Other function
### Remember me
>> * Write in login.js
>> * Use localStage to store the user info.
```javascript=
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
``` 
### Profile
>> * Write your mood and something you like to paste to yourself
>> * Write profile at right top
![](https://i.imgur.com/vux1qML.png)
![](https://i.imgur.com/dgdhNBQ.png)
>> Attention that it will recycle when you exit the page.

### Your comment are different
>> User's comment are display on right and other people's are on left.
![](https://i.imgur.com/z22GihQ.png)

### Forget password
>> If you forget your password, you can click **forget password?** to creat a new password from your email.
1. When you check the forget password, you will enter a page to enter your email.
![](https://i.imgur.com/FRh0pGN.png)
![](https://i.imgur.com/7fkAnyV.png)
2. Check your email, enter your ner password.
![](https://i.imgur.com/7MkqPdF.png)
![](https://i.imgur.com/3ElHtIe.png)
![](https://i.imgur.com/KkrHd9K.png)



### Other UI design
1. User can logout from right wrapper
![](https://i.imgur.com/F6ax0vW.png)

2. CreatGroup from mid wrapper
>> If no login it will direct to login.html
![](https://i.imgur.com/IBqsyut.png)

3. Invite someone to your chatroom
![](https://i.imgur.com/HF16pvk.png)
>> It will detect whether the user exit. If not it will alert "No User". If yes, it will close the window and that user can join the chatroom.
![](https://i.imgur.com/rGWowS9.png)

4. Notice: You can't open two or more index.html to enter chatroom, because it will cause chatroom can't find it's parent.

5. When you logout, you need to push f12 and then can enter the password. 

### Video
{%youtube NHmC0HJ0N4Y %}

|Component|Score|Y/N|
|:-:|:-:|:-:|
|Third-Party Sign In|2.5%|Y|
|Chrome Notification|5%|Y|
|Use CSS Animation|2.5%|Y|
|Security Report|5%|Y|



