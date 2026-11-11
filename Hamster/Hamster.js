var bally = 400;
var ballx = 300;
var score = 0;
var level = 1;
var ballSize = 90;
//dif color for baloon
var ballR = 245;
var ballG = 125;
var ballB = 165;

var speed = 1.5;
var gameState = "begin";   //начала с play then begin  и новая функция

//переменная speed, число 1.5 означает, что шарик будет подниматься на 1,5 пикселя за каждое выполнение draw()
var hamsterImg;
var moonImg;
var confettiImg;

function preload() {        //функция для загрузки ресурсов перед запуском
  hamsterImg  = loadImage('hamster.png');  //сохраняет загруженную картинку в нашу переменную
  moonImg = loadImage('moon.png');
  confettiImg = loadImage('confetti.png');
}

function setup() {
  createCanvas(600, 600);
  pixelDensity(1); // один пиксель canvas = один пиксель в массиве
  imageMode(CENTER);  //прошу поставить картинку по центру
}


function draw() {
  background(245, 235, 225);


  if (gameState == "Win") {
    image(confettiImg, width / 2, height / 2, width, height);
    fill(65, 45, 40);

    textSize(30);
    text("Hamster stays home!", 160, 200);

    image(hamsterImg, 300, 310, 120, 120);

    textSize(20);
    text("All 5 levels completed!", 200, 420);
    text("Click to play again", 220, 470);



    return;
  }

  if (gameState == "nextLevel") {
    // frame
    noFill();
    stroke(180, 150, 125);
    strokeWeight(1);
    rect(20, 20, 560, 560);
    noStroke();

    fill(65, 45, 40);

    textSize(30);
    text("Congratulations!", 180, 110);
    

    textSize(24);
    text("Level " + level + " Complete!", 200, 160);

    if (level == 3 || level == 4) {
      image(moonImg, 300, 260, 120, 120);
    } else {
      image(hamsterImg, 300, 260, 120, 120);
    }

    textSize(20);
    text("15 / 15 balloons popped!", 190, 360);


    if (level == 3 || level == 4) {
  noStroke();
  fill(225, 215, 195);
  rect(60, 390, 480, 55, 8);

  fill(65, 45, 40);
  textSize(16);

  if (level == 3) {
    text("Night has fallen... and he seems to have a plan.", 125, 423);
  } else {
    text("It's getting darker... but he hasn't given up.", 140, 423);
  }
}

noStroke();
fill(65, 45, 40);
textSize(24);
text("Click to continue", 210, 512);

    return;
  }

  if (gameState == 'begin') {

    // frame
    noFill();
    stroke(180, 150, 125);
    strokeWeight(1);
    rect(20, 20, 560, 560);
    noStroke();

    fill(65, 45, 40);
    textSize(29);
    text("Don't let Hamster escape!", 130, 130);

    image(hamsterImg, 300, 250, 100, 100);

    textSize(20);
    text("Click to start", 240, 350);
    textSize(16);
    text("Click the balloon before the hamster escapes.", 130, 420);
    text("Pop 15 balloons to complete each level.", 150, 450);
    text("Levels 4–5: move your mouse to use the flashlight.", 115, 480);
    return;
  }

  if (gameState == 'Lose') {
    fill(65, 45, 40);
    textSize(32);
    text('Hamster escaped! :(', 160, 300);

    textSize(20);
    text('Click to try again', 220, 350);

    return;
  }

   //floor
  noStroke();
  fill(190, 155, 120);
  rect(0, 555, width, 12);
  
  //Baloon
  noStroke();
  fill(ballR, ballG, ballB);
  ellipse(ballx, bally, ballSize, ballSize);

  image(hamsterImg, ballx, bally +115, 80, 80); //загруз. картинку и ставлю под уентр шара
  stroke(100, 80, 65);
  strokeWeight(2);
  line(ballx, bally + ballSize /2, ballx, bally + 120);
  noStroke();
  bally = bally - speed;  //bally = bally - 1; каждый раз вычитали из Y число 1.
  //Теперь вычитаем значение, которое хранится в speed.    400 -> 398.5 -> 397 -> 395.5…  goes up

  if (bally + 115 + 80/2 < 0) {
    // Центр хомяка: bally + 115; добавляем половину высоты (80/2), чтобы найти нижний край.
    gameState = 'Lose';
  }
  // Центр хомяка расположен на bally + 110, а высота картинки — 80
  // СОЗДАЕМ ТЕКСТ

  if (level >= 4) {
    loadPixels(); // получаем пиксели уже нарисованной игры

    var lightRadius = 115; // радиус фонарика

    if (level == 5) {
      lightRadius = 90;
    }

    for (var y = 0; y < height; y++) { //начинает с 0 и продолжю пока У высоты поля
      // у++ после каждого потворения увеличиваем У на один.    smthg like y = y + 1
      for (var x = 0; x < width; x++) {

        //Находим, где записан цвет выбранного пикселя
        var loc = (x + y * width) * 4;  //loc-location  4 это ргби альфа непрозрачность
        var distance = dist(x, y, mouseX, mouseY);

        // Всё за пределами круга делаем чёрным
        if (distance > lightRadius) {
          pixels[loc] = 0;  //красный 0
          pixels[loc + 1] = 0;  // зеленый 0
          pixels[loc + 2] = 0;  // синий 0
          pixels[loc + 3] = 255; //  непрозрачность = 255
        }
      }
    }

    updatePixels(); // показываем изменённые пиксели

    // Светлая полоска, чтобы счёт и уровень были видны
    noStroke();
    fill(245, 235, 225);
    rect(0, 0, width, 60);
  }


  fill(65, 45, 40);
  textSize(24);
  text("Score: " + score +"/15", 20, 35);     // like 0/15
  text("Level: "+level, 450, 35);
}

function mousePressed() {

  // Клик на экране паузы: начинаем следующий уровень
  if (gameState == "nextLevel") {
    if (mouseX < 180 || mouseX > 420 ||
        mouseY < 480 || mouseY > 530) {
      return;
    }

    level = level + 1;
    
    score = 0;

    if (level == 1) {
      speed = 1.5;
    } else if (level == 2) {
      speed = 2.3;
    } else if (level == 3) {
      speed = 3;
    } else if (level == 4) {
      speed = 3.3;
    } else if (level == 5) {
      speed = 3.6;
    }

    ballx = random(65, width - 65);
    bally = 400;

    gameState = "play";
    return;
  }

  // Клик на начальном экране или после проигрыша
  if (gameState == "Lose" || gameState == "begin" || gameState =="Win") {
    score = 0;
    level = 1;
    speed = 1.5;
    
    ballR = random(80, 245);
    ballG = random(80, 245);
    ballB = random(80, 245);

    ballx = 300;
    bally = 400;

    gameState = "play";
    return;
  }

  // Проверяем попадание по шарику
  var distance = dist(ballx, bally, mouseX, mouseY);

  if (distance < ballSize / 2) {
    score = score + 1;
    
    ballR = random(80, 245);
    ballG = random(80, 245);
    ballB = random(80, 245);

    // После 15 попаданий включаем паузу
    if (score >= 15) {
      if (level == 5) {
        gameState = "Win";
      } else {
        gameState = "nextLevel";
      }

      return;
    }

    ballx = random(65, width - 65);
    bally = 400;
  }
}
