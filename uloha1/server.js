const http = require("http").createServer();
const io = require("socket.io")(http, {
    cors: {origin: "*"}
});

io.on("connection", (socket) => {
    console.log("mnamka");

    socket.on("message", (message) => {
        console.log(message);
        io.emit("message", `${socket.id,substr(0,2)} said ${message}`);
    });
});

const port = 3000;
http.listen(port, () => console.log(`Server je zapnuty, pocuvam na porte ${port}`));
