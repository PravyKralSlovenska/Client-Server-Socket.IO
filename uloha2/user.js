const port2 = 3000;
const socket = io(`http://localhost:${port2}`);

const input = document.getElementById("input");
const spravy = document.getElementById("spravy");
const tlacidlo = document.getElementById("tlacidlo");
const list_el = document.getElementById("pripojeni");

// ======================== SOKETY ========================

socket.on("message", (text) => {
    const el = document.createElement("li");
    el.innerHTML = text;
    spravy.appendChild(el)
});

socket.on("update_list", (list) => {
    document.getElementById("pripojeni").innerHTML = list.length;
    list_el.innerHTML = "";

    list.forEach((clovek) => {
        console.log(clovek)
        let li = document.createElement("li");
        li.innerHTML = `<b><span style='color: ${clovek[1]};'>${clovek[0]}</span></b>`;
        list_el.appendChild(li);
    });
});

socket.on("get_canvas", () => {
    socket.emit("update_canvas", context.getImageData(0, 0, canvas.width, canvas.height));
});

socket.on("update-put_canvas", (data) => {
    // vymaz_canvas();
    context.putImageData(data, 0, 0);
});

socket.on("clear_canvas", () => {
    vymaz_canvas();
});

socket.on("undo_canvas", () => {
    console.log("undo platno");
});

setInterval(() => {
    socket.emit("update_canvas", context.getImageData(0, 0, canvas.width, canvas.height));
}, 1500);

// ======================== NEJAKE FUNKCIE NAVYSE ========================
tlacidlo.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("message", input.value);
    input.value = "";
});

input.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
        tlacidlo.click();
    }
});

document.getElementById("pripojitButton").addEventListener("click", (event) => {
    event.preventDefault();
    let meno = document.getElementById("menoInput").value;
    let miestnost = document.getElementById("miestnostInput").value;

    if (miestnost === "") {
        miestnost = "default";
    }

    socket.emit("init", meno, miestnost);

    // miestnost_el.innerHTML = miestnost;
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("main").style.visibility = "visible";
    document.getElementById("form").style.visibility = "visible";
    document.getElementById("meno").innerHTML = meno;
});

document.getElementById("clearCanvas").addEventListener("click", () => {
    socket.emit("clear_canvas");
});

// ======================== KRESLENIE ========================
var stroke_log = [] //[[...], ...]

var kreslime = false;
var coord = {x:0, y:0};
var velkost = 10;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function ziskajCoords(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop; 
}

window.addEventListener('load', () => {
    document.addEventListener("mousedown", () => {kreslime = true; ziskajCoords(event)});
    document.addEventListener("mouseup", () => {kreslime = false;});
    document.addEventListener("mousemove", vykresli);
});

function vykresli() {
    if (!kreslime) return; // ked je kreslime false, tak sa vykona return a funkcia skonci :3
    context.beginPath();
    context.lineWidth = velkost;
    context.strokeStyle = document.getElementById("colorPick").value;
    context.lineCap = "round";
    context.moveTo(coord.x,coord.y);
    ziskajCoords(event);
    context.lineTo(coord.x, coord.y);
    context.stroke(); // vykresli ciarku
    context.closePath();
}

function update_canvas() {
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

function vymaz_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// zmen farbu pozadia canvasu
function farba_canvas(farba = "#FFFFFF"){
    context.beginPath();
    context.fillStyle = farba;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.closePath();
    context.fill();
};

// zmen velkost velkost ciary
document.getElementById("kruh1").addEventListener("click", () => {
    velkost = 1;
});

document.getElementById("kruh5").addEventListener("click", () => {
    velkost = 5;
});

document.getElementById("kruh10").addEventListener("click", () => {
    velkost = 10;
});

document.getElementById("kruh15").addEventListener("click", () => {
    velkost = 15;
});

document.getElementById("kruh20").addEventListener("click", () => {
    velkost = 20;
});

document.getElementById("kruh25").addEventListener("click", () => {
    velkost = 25;
});

