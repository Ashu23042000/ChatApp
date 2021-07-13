
const socket = io();

// get username----

let username = "";

// while (!username) {
//     username = prompt("Enter your name");
// };


// send connected username to server---

socket.emit("user_connect", username);

// get another connected usernames----

socket.on("another_user_connected", (username) => {
    let markup = document.createElement("div");
    markup.innerHTML = `<p>${username} has joined the chat.</p>`;
    markup.classList.add("new_user");
    message_area.appendChild(markup);
});


// sending message----

let send_button = document.querySelector(".send_button");
let message_input = document.querySelector(".message_input")
let message_area = document.querySelector(".message_area");
let userId = document.querySelector(".userId");



send_button.addEventListener("click", () => {

    let data = {
        username,
        message: message_input.value
    };

    message_input.value = "";

    append_message(data, "outoing_message");

    // sending data to server----

    socket.emit("user_message_server", data);

});

// append message---


function append_message(data, message_type) {

    let html = document.createElement("div");


    html.innerHTML = `<span class="user">${data.username}</span>
                <span class="time">${moment().format("LT")}</span>
                <p>${data.message}
                </p>`;

    html.classList.add(message_type);
    message_area.appendChild(html);

    scrollToBottom();
};


// scroll to bottom----

function scrollToBottom() {
    message_area.scrollTop = message_area.scrollHeight;
};


// getting message from server-----------

socket.on("userMessage", (data) => {
    console.log(data);
    append_message(data, "incoming_message");
});


const hamburger = document.querySelector(".hamburger");
const hamburger_navMenu = document.querySelector(".hamburger_navMenu");

hamburger.addEventListener("click", () => {
    hamburger_navMenu.classList.toggle("show");
});












