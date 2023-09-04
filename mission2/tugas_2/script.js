const dinosaur = document.getElementById("dinosaur");

document.addEventListener("keydown", jump);

function jump(event) {
    if (event.keyCode === 32) { // Tombol spasi
        dinosaur.style.animation = "jump 0.5s";
        setTimeout(() => {
            dinosaur.style.animation = "";
        }, 500);
    }
}
