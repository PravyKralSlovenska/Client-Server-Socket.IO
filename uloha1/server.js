const http = require("http").createServer(); 
const io = require('socket.io')(http, {
    cors: {origin: "*",}
});

io.on("connection", (socket) => {
    console.log("kokot sa pripojil");

    socket.on("message", (message) => {
        console.log(message);
        io.emit("message", `typek povedal: ${message}`)
    });
});

const port = 3000;
http.listen(port, () => console.log(`Server je zapnuty, pocuvam na porte ${port}`));

// http://127.0.0.1:3000/
// http://localhost:3000/methods: ["GET", "POST"]