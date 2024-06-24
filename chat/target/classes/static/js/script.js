'use strict';

var frontPage = document.querySelector('.front-page');
var chatPage = document.querySelector('#chat-page');
var connectingClass = document.querySelector('.connecting');

var userNameForm = document.querySelector('#userNameForm');

var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var imageUpload = document.querySelector('#image')

var client = null;
var username = null;


var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function websocketConnection(event) {
    username = document.getElementById('username').value.trim();

    if (username) {
        frontPage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        //connecting the endpoint with our JS file 
        var socket = new SockJS('/websocket');
        client = Stomp.over(socket);
        client.connect({}, connecting, error);
    }

    event.preventDefault();
}

function connecting() {
    alert('You have been registered as: '+ username);

    client.subscribe('/topic/public', onMessageReceived);

    //It returns detailed status of the user on our console 
    client.send('/app/chat.registerUser', {}, JSON.stringify({ sender: username, type: 'JOIN' }));

    connectingClass.classList.add('hidden');
}

function error() {
    var errorMessage;
    errorMessage.textContent = "Couldn't connect to websocket services";
    errorMessage.style.color = 'red';
}

function message(event) {
    var content = messageInput.value.trim();
    
    if (content && client) {
        client.send('/app/chat.sendMessage', {}, 
        JSON.stringify({sender: username, content: messageInput.value, type:'CHAT'}));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {

    var message = JSON.parse(payload.body);
    console.log("Message received:", message);

    var messageElement = document.createElement('li');

    if (message.messageType === 'JOIN') {
        messageElement.classList.add('event-message');
        messageElement.textContent = username + ' joined! Say hi!'
        messageElement.style.color= 'blue';
    } 
    else if (message.messageType === 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.textContent = message.sender + ' left...See you around :)';
        messageElement.style.color= 'red';
    } 
    else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        
    }
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);
    
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

userNameForm.addEventListener('submit', websocketConnection, true);
messageForm.addEventListener('submit', message, true);
