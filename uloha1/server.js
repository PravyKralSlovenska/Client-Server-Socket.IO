const http = require("http").createServer(); 
const io = require('socket.io')(http, {
    cors: {origin: "*",}
});
// !!!!!!
// ked je v miestnosti 0 ludi, tak server spadne (nie je osetrene, nechce sa mi osetrit)
const miestnosti = []; // [["default", [[anonym1, farba1]]], ["room1", [peter, farba2]]]
var n = 0;

io.on("connection", (socket) => {
    console.log("typek sa pripojil");

    socket.on("init", (meno, miestnost) => {
        if (meno === "") {
            meno = `anonym_${n++}`;
        }
        
        socket.meno = meno;
        socket.miestnost = miestnost;
        socket.farba = ranFarba();
        
        if (miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)) {
            miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1].push([socket.meno, socket.farba]);
        } else {
            miestnosti.push([socket.miestnost, [[socket.meno, socket.farba]]]);
        }
        
        socket.join(socket.miestnost);

        io.to(socket.miestnost).emit("message", `<b>${nowTime()} Server: <span style="color: ${socket.farba}">${socket.meno}</span></b> sa pripojil do miestnosti ${socket.miestnost}`);
        io.to(socket.miestnost).emit("update_list", miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1]);
    });

    socket.on("message", (message) => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} <span style="color: ${socket.farba}">${socket.meno}</span>:</b> ${message}`);
    });

    socket.on("disconnect", () => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} Server: <span style="color: ${socket.farba}">${socket.meno}</span></b> sa odpojil z chatu`);
        
        // if (miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1].length === 1) {} // neviem ci 1 alebo 0 :()
        try {
            miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1] = miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1].filter((clovek) => clovek[0] !== socket.meno);
            io.to(socket.miestnost).emit("update_list", miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1]);
        } catch (error) {
            console.log(error)
        }

        console.log("typek sa odpojil");
    });
});

const port = 3000;
http.listen(port, () => console.log(`Server je zapnuty, pocuvam na porte ${port}`));

// http://127.0.0.1:3000/
// http://localhost:3000/methods: ["GET", "POST"]

function ranFarba() {
    let zoznam = ["red", "blue", "green", "purple", "orange", "brown", "black"];
    return zoznam[Math.floor(Math.random() * zoznam.length)];
}

function nowTime() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}