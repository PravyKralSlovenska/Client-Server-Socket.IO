const http = require("http").createServer(); 
const io = require('socket.io')(http, {
    cors: {origin: "*",}
});

const miestnosti = []; 
const canvas_log = []; //[[...], [...], ...]
var n = 0;

io.on('connection', (socket) => {
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
    
        console.log("typek sa pripojil", socket.meno, socket.miestnost);
    });

    socket.on("message", (message) => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} <span style="color: ${socket.farba}">${socket.meno}</span>:</b> ${message}`);
    });

    socket.on("disconnect", () => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} Server: <span style="color: ${socket.farba}">${socket.meno}</span></b> sa odpojil z chatu`);
        
        // if (miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1].length === 1) {} // neviem ci 1 alebo 0 :()
        // niekedy vyhodi error, musel som nejako osetrit
        try {
            miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1] = miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1].filter((clovek) => clovek[0] !== socket.meno);
            io.to(socket.miestnost).emit("update_list", miestnosti.find((miestnost) => miestnost[0] === socket.miestnost)[1]);
        } catch (error) {
            console.log("error")
        }

        console.log("typek sa odpojil");
    });

    socket.on("clear_canvas", () => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} Server: <span style="color: ${socket.farba}">${socket.meno}</span></b> vymazal platno`);
        io.to(socket.miestnost).emit("clear_canvas");
    });

    socket.on("undo_canvas", () => {
        io.to(socket.miestnost).emit("message", `<b>${nowTime()} Server: <span style="color: ${socket.farba}">${socket.meno}</span></b> spravil undo`);
        io.to(socket.miestnost).emit("undo_canvas");
    });

    socket.on("update_canvas", (data) => {
        io.to(socket.miestnost).emit("update-put_canvas", data);
    });
});

const port = 3000;
http.listen(port, () => console.log(`Server je zapnuty, pocuvam na porte ${port}`));

function ranFarba() {
    let zoznam = ["red", "blue", "green", "purple", "orange", "brown", "black"];
    return zoznam[Math.floor(Math.random() * zoznam.length)];
}

function nowTime() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}