function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(245, 238, 232);
  noStroke();

  // back hair
  fill(125, 57, 16);
  rect(150, 190, 300, 350);
  ellipse(300, 190, 300, 260);

  // neck
  fill(242, 220, 190);
  rect(260, 390, 80, 130);

  // body
  fill(20);
  ellipse(300, 570, 450, 180);

  // face
  fill(242, 220, 190);
  ellipse(300, 280, 250, 330);

  // blond hair
  fill(235, 230, 150);
  triangle(180, 140, 290, 110, 175, 440);
  triangle(310, 110, 420, 140, 425, 440);

  // eyes: white parts stay still
  fill(255);
  ellipse(245, 270, 75, 40);
  ellipse(355, 270, 75, 40);

  // direction from each eye to the cursor
  let leftAngle = atan2(mouseY - 270, mouseX - 245);
  let rightAngle = atan2(mouseY - 270, mouseX - 355);

  // moving positions inside the eyes
  let leftX = 245 + cos(leftAngle) * 14;
  let leftY = 270 + sin(leftAngle) * 2;

  let rightX = 355 + cos(rightAngle) * 14;
  let rightY = 270 + sin(rightAngle) * 2;

  // green irises
  fill(20, 160, 65);
  ellipse(leftX, leftY, 30, 35);
  ellipse(rightX, rightY, 30, 35);

  // black pupils move with the irises
  fill(0);
  ellipse(leftX, leftY, 12, 22);
  ellipse(rightX, rightY, 12, 22);

  // eyebrows
  fill(125, 57, 16);
  rect(210, 230, 65, 8);
  rect(329, 230, 65, 8);

  // lashes
  fill(0);
  triangle(195, 248, 210, 263, 280, 263);
  triangle(405, 248, 390, 263, 320, 263);

  // nose
  fill(215, 185, 150);
  ellipse(300, 330, 25, 18);

  // lips
  fill(210, 40, 50);
  ellipse(300, 380, 65, 22);

  // lip line
  stroke(110, 25, 35);
  strokeWeight(2);
  line(270, 380, 330, 380);
}
