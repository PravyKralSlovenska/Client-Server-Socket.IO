const port = 3000;
const pouzivatelia = {};

const portDOM = document.getElementById('serverPort');
portDOM.textContent = port;

const pocet_pripojenych = document.getElementById('pripojeni');
pocet_pripojenych.textContent = `${pouzivatelia.lenght()}`

const serverHttp = require('http').createServer();
const io = require('socket.io')(serverHttp);

io.on("connection", (socket) => {
    socket.emit('chat-message', 'Vitajte na chate!')
    console.log("ahojte kokoti")

    socket.on('new-user', meno => {
        // pridajPouzivatela(meno);
        socket.broadcast.emit('user-connected', meno);
    });
    socket.on('send-chat-message', msg  => {
        // sprava(meno, msg);
        socket.broadcast.emit('chat-message', msg);
    });
    socket.on('disconnect', (meno) => {
        // odstranPouzivatela(meno);
        socket.broadcast.emit('user-disconnected', meno);
    });
});

// io.to("").emit("Hello!") //posielam spravu "Hello!" do roomky ""

serverHttp.listen(port, () => {
  console.log(`Server sa zapol, pocuvam na porte ${port}.`);
});

function pridajPouzivatela(meno) {
    let list  = document.getElementById('list');
    let user = document.createElement('li');
    user.textContent = meno;
    list.appendChild(user); 
    pouzivatelia.push(meno);
    pocet_pripojenych.textContent = `${pouzivatelia.lenght()}`;
}

function odstranPouzivatela(meno) {
    let list  = document.getElementById('list');
    let user = document.createElement('li');
    user.textContent = meno;
    list.removeChild(user); 
    pouzivatelia.pop(meno);
    pocet_pripojenych.textContent = `${pouzivatelia.lenght()}`;
}

function sprava(meno, msg) {
    let list = document.getElementById('spravy');
    let sprava = document.createElement('li');
    sprava.textContent = `${meno}: ${msg}`;
    list.appendChild(sprava);
}

// class Server {
//     constructor() {
        
//     }

//     broadcast(msg) {
//         io.emit("Server: %s", msg)
//     }
// }

// class Uzivatel {
//     constructor() {
//         this.meno = meno
//     }
// }