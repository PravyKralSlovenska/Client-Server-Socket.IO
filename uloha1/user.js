const port2 = 3000;
const socket = io(`http://localhost:${port2}`);

const spravy = document.getElementById("spravy");
const input = document.getElementById("input");
const tlacidlo = document.getElementById("tlacidlo");

// const list = document.getElementById("list");
// list.appendChild(document.createElement("li")).innerHTML = "typek2";

socket.on("message", (text) => {
    const el = document.createElement("li");
    el.innerHTML = text;
    spravy.appendChild(el)
});

tlacidlo.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("klikol si na tlacidlo");
    socket.emit("message", input.value);
    input.value = "";
});