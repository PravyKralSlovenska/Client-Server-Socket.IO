const port = 3000;
const socket = io(`http://localhost:${port}`);

const list = document.getElementById('spravy');
const msgInput = document.getElementById('input');

socket.on('chat-message', data => {
    console.log(data);
});

list.addEventListener('submit', event => {
    event.preventDefault();
    const msg = msgInput.value;
    socket.emit('send-chat-message', msg);
    msgInput.value = '';
});