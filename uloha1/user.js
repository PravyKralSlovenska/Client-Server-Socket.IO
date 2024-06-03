const port2 = 3000;
const socket = io(`http://localhost:${port2}`);

const spravy = document.getElementById("spravy");
const input = document.getElementById("input");
const tlacidlo = document.getElementById("tlacidlo");
const list_el = document.getElementById("list");
const miestnost_el = document.getElementById("miestnost");
const nadpis = document.getElementById("nadpis");

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

tlacidlo.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("message", input.value);
    input.value = "";
});

input.addEventListener("keyup", (event) => {
    console.log("key pressed")
    if (event.key === "Enter") {
        event.preventDefault();
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

    miestnost_el.innerHTML = miestnost;
    document.getElementById("menicko").style.display = "none";
    document.getElementById("bodicko").style.visibility = "visible";
    document.getElementById("meno").innerHTML = meno;
});