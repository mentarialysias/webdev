//board
let board;
let boardWidth = 1000;
let boardHeight = 500;
let context;

//object
let objectWidth = 88;
let objectHeight = 94;
let objectX = 50;
let objectY = 250;
let objectImg;

let object = {
    x: objectX,
    y: objectY,
    width: objectWidth,
    height: objectHeight
}

//hambatan
let hambatanArray = [];

let hambatan1Width = 70;
let hambatan2Width = 69;
let hambatan3Width = 102;

let hambatanHeight = 70;
let hambatanX = 1000;
let hambatanY = boardHeight - hambatanHeight;

let hambatan1Img;
let hambatan2Img;
let hambatan3Img;

//physics
let velocityX = -8; //hambatan moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;
let jumping = false; // Menyimpan status meloncat

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial objectsaur
    objectImg = new Image();
    objectImg.src = "./img/nemo.png";
    objectImg.onload = function () {
        context.drawImage(objectImg, object.x, object.y, object.width, object.height);
    }

    hambatan1Img = new Image();
    hambatan1Img.src = "./img/meteor.png";

    hambatan2Img = new Image();
    hambatan2Img.src = "./img/batu.webp";

    hambatan3Img = new Image();
    hambatan3Img.src = "./img/api.png";

    requestAnimationFrame(update);
    setInterval(placehambatan, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", function (e) {
        if (e.code === "Space" && objectY > 30 && !jumping) {
            //jump
            velocityY = -10; // Atur kecepatan vertikal negatif untuk meloncat
            jumping = true; // Objek sedang meloncat
        }
        else if (e.code == "ArrowUp" && objectY > 30) {
            //duck
            objectY -= 20;
        }
        else if (e.code == "ArrowDown" && objectY < 380) {
            //duck
            objectY += 20;
        }
    });
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //object
    velocityY += gravity;
    object.y = Math.min(object.y + velocityY, objectY); //apply gravity to current object.y, making sure it doesn't exceed the ground
    context.drawImage(objectImg, object.x, object.y, object.width, object.height);

    //hambatan
    for (let i = 0; i < hambatanArray.length; i++) {
        let hambatan = hambatanArray[i];
        hambatan.x += velocityX;
        context.drawImage(hambatan.img, hambatan.x, hambatan.y, hambatan.width, hambatan.height);

        if (detectCollision(object, hambatan)) {
            gameOver = true;
            objectImg.src = "./img/kalah.png";
            objectImg.onload = function () {
                context.clearRect(object.x, object.y, object.width, object.height);
                context.drawImage(objectImg, object.x, object.y, object.width, object.height);
            }
        }
    }

    //score
    context.fillStyle = "white"; // Mengatur warna tulisan menjadi putih
    context.font = "40px courier";
    score++;
    const scoreText = "Score: " + score;
    const textWidth = context.measureText(scoreText).width; // Mengukur lebar teks

    // Mengatur posisi teks di tengah horizontal canvas
    const centerX = (board.width - textWidth) / 2;

    context.fillText(scoreText, centerX, 50); // Menggambar teks di tengah horizontal dan pada koordinat Y 20

    // Pengecekan jika objek telah kembali ke tanah
    if (object.y >= objectY) {
        object.y = objectY; // Pastikan objek berada di tanah
        velocityY = 0; // Nolkan kecepatan vertikal setelah meloncat
        jumping = false; // Objek tidak lagi dalam kondisi meloncat
    }
}

function placehambatan() {
    if (gameOver) {
        return;
    }

    //place hambatan
    let hambatan = {
        img: null,
        x: hambatanX,
        y: Math.random() * (boardHeight - hambatanHeight), // Generate random y within the canvas height
        width: null,
        height: hambatanHeight
    }

    let placehambatanChance = Math.random(); //0 - 0.9999...

    if (placehambatanChance > 0.90) { // 10% you get hambatan3
        hambatan.img = hambatan3Img;
        hambatan.width = hambatan3Width;
        hambatanArray.push(hambatan);
    }
    else if (placehambatanChance > 0.70) { // 30% you get hambatan2
        hambatan.img = hambatan2Img;
        hambatan.width = hambatan2Width;
        hambatanArray.push(hambatan);
    }
    else if (placehambatanChance > 0.50) { // 50% you get hambatan1
        hambatan.img = hambatan1Img;
        hambatan.width = hambatan1Width;
        hambatanArray.push(hambatan);
    }

    if (hambatanArray.length > 5) {
        hambatanArray.shift(); // remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
