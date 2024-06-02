const socket = io("ws://localhost:3000");

const spravy = document.getElementById("spravy");
const input = document.getElementById("input");

socket.on("message", (text) => {
    const el = document.createElement("li");
    el.innerHTML = text;
    spravy.appendChild(el)
});

document.getElementById("button").onclick = () => {
    const text = input.value;
    socket.emit("message", text);
}