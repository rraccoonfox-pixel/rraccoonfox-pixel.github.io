// Номер выбранной кисти.
// При запуске выбрана кисть 1.
let choice = '1';

// Здесь будет храниться палитра.
let colorPicker;

// Здесь будет храниться загруженная PNG.
let brushImage;

// Кисть 1 запоминает маршрут мыши, а points это список точек этого маршрута.
// Сначала точек нет, поэтому стоят пустые скобки []. Когда рисую, программа добавляет сюда координаты.
// Затем соединяет их линией с тонкими концами.
let points = [];
let savedPixels; // Здесь сохраняем рисунок перед новым штрихом кисти 1.
let drawingTapered = false; // false — штрих не начат. true — штрих начат, можно его продолжать.

function preload() {   // ЗАГРУЗКА КАРТИНКИ 
  brushImage = loadImage('brushpainttext.png');   // Загружаем файл и запоминаем картинку в brushImage.
}

// ПОДГОТОВКА СТРАНИЦЫ
function setup() {  

  colorPicker = createColorPicker('#222222'); // Создаём палитру с начальным почти чёрным цветом.

  colorPicker.position(450, 10);

  let instructions = createP(  
    'Choose your brush: press 1–0.'
    );
 
  instructions.position(10, 0);
  let drawingCanvas = createCanvas(600, 600);   // Создаём холст шириной 600 и высотой 600.
  // Ставим холст ниже инструкции.
  drawingCanvas.position(10, 50);

  // Почти белый фон.
  background(250);

  // Нажатие именно на холст запускает startStroke().
  // Нажатие на палитру не начинает штрих первой кисти.
  drawingCanvas.mousePressed(startStroke);

  // Создаём кнопку сохранения под холстом.
  let saveButton = createButton('Save image');
  saveButton.position(10, 665);

  // Команды внутри выполняются при нажатии кнопки.
  saveButton.mousePressed(function() {
    saveCanvas('my-drawing', 'png');
  }
  );


  // Подготавливаем PNG для выбора любого цвета.
  //
  // Делаем цветные части картинки белыми,
  // сохраняя прозрачность каждого пикселя.
  //
  // Белую картинку можно окрасить через tint().
  // Сам PNG-файл на компьютере не меняется.
  brushImage.loadPixels();

  // У каждого пикселя четыре числа:
  // красный, зелёный, синий, непрозрачность.
  //
  // i += 4 — перейти к следующему пикселю.
  for (let i = 0; i < brushImage.pixels.length; i += 4) {
    brushImage.pixels[i] = 255;
    brushImage.pixels[i + 1] = 255;
    brushImage.pixels[i + 2] = 255;
    // Четвёртое число не меняем.
  }

  // Применяем изменения к картинке.
  brushImage.updatePixels();
}
// ЦВЕТ ИЗ ПАЛИТРЫ. Эта функция берёт выбранный цвет и задаёт ему нужную непрозрачность.
// Например, selectedColor(70): выбранный цвет с непрозрачностью 70 из 255.
function selectedColor(opacity) {
  // Создаём отдельную копию выбранного цвета.
  let brushColor = color(colorPicker.value());
  // 0 — полностью прозрачно.
  // 255 — полностью непрозрачно.
  brushColor.setAlpha(opacity);
  // Передаём готовый цвет обратно в команду, которая вызвала selectedColor().
  return brushColor;
}
// ВЫБОР КИСТИ ДЛЯ РИСОВАНИЯ
function draw() {

  // Если мышь за пределами холста, заканчиваем этот кадр без рисования.
  // return здесь означает «выйти из функции».
  if (mouseX < 0) return;
  if (mouseX >= width) return;
  if (mouseY < 0) return;
  if (mouseY >= height) return;
  
  // Рисуем, пока кнопка мыши зажата.
  if (mouseIsPressed) {

    // Если в choice записана '1', запускаем кисть 1.
    if (choice === '1') {          // === проверяет равенство.
      if (drawingTapered) {

        // Достаём последнюю сохранённую точку.
        // Номера точек начинаются с 0. Поэтому номер последней — количество минус 1.
        let lastPoint = points[points.length - 1];

        // Сохраняем новую точку только после движения больше чем на 2 пикселя.
        if (dist(mouseX, mouseY, lastPoint.x, lastPoint.y) > 2) {
       // Добавляем в список координаты новой точки.
          points.push( {
          x:
          mouseX, y:
            mouseY
          }
          );

          taperedBrush();
        }
      }
    }

    // 2: PNG-текстура.
    if (choice === '2') {
      imageTextureBrush();
    }

    // 3: штриховка.
    if (choice === '3') {
      hatching();
    }

    // 4: цепочка.
    if (choice === '4') {
      chainBrush();
    }

    // 5: карандашные царапинки.
    if (choice === '5') {
      scratchBrush();
    }

    // 6: маленькие кошачьи головы.
    if (choice === '6') {
      catBrush();
    }

    // 7: напыление.
    if (choice === '7') {
      sprayPaint();
    }

    // 8: текстура из маленьких квадратов.
    if (choice === '8') {
      squareTextureBrush();
    }

    // 9: знаки >.
    if (choice === '9') {
      angleBrush();
    }

    // 0: радужные контурные квадраты.
    if (choice === '0') {
      rainbowSquares();
    }
  }
}


// НАЧАЛО И КОНЕЦ ШТРИХА ПЕРВОЙ КИСТИ

function startStroke() {
  if (choice === '1') {

    // Сохраняем точную копию пикселей холста.
    // Она нужна для перерисовки текущего штриха.
    loadPixels();
    savedPixels = pixels.slice();

    // Начинаем новый список координат.Старый рисунок на холсте остаётся.
    points = [];

    // Первая точка — место нажатия мыши.
    points.push( {
    x:
    mouseX, y:
      mouseY
    }
    );

    drawingTapered = true;
  }
}

function mouseReleased() {  // При отпускании мыши завершаем штрих.
  drawingTapered = false;
}

// КИСТЬ 1: ТОНКО — ТОЛСТО — ТОНКО
function taperedBrush() {
  
  // Возвращаем рисунок до текущего штриха.
  // Затем заново рисуем этот штрих с новой толщиной.
  pixels.set(savedPixels);
  updatePixels();

  stroke(selectedColor(255));

  // Скругляем концы отрезков.
  strokeCap(ROUND);

  // Соединяем каждую точку с предыдущей.
  for (let i = 1; i < points.length; i++) {

    // Место отрезка внутри штриха:
    // около 0 — начало,
    // около 0.5 — середина,
    // около 1 — конец.
    let progress = (i - 0.5) / (points.length - 1);

    // sin() плавно увеличивает и уменьшает толщину.
    // 6 управляет толщиной середины.
    let thickness = 0.5 + sin(progress * PI) * 6;

    strokeWeight(thickness);

    line(
      points[i - 1].x,
      points[i - 1].y,
      points[i].x,
      points[i].y
      );
  }
}


// КИСТЬ 2: PNG-ТЕКСТУРА

function imageTextureBrush() {

  // Ширина одного отпечатка.
  let brushWidth = 50;

  // Сохраняем пропорции картинки при уменьшении.
  let brushHeight =
    brushWidth * brushImage.height / brushImage.width;

  // Окрашиваем картинку выбранным цветом.
  // 20 — нежная непрозрачность каждого отпечатка.
  tint(selectedColor(20));

  // Вычитаем половину размера,
  // чтобы центр картинки оказался под мышью.
  image(
    brushImage,
    mouseX - brushWidth / 2,
    mouseY - brushHeight / 2,
    brushWidth,
    brushHeight
    );

  // Отключаем tint после этой картинки.
  noTint();
}


// КИСТЬ 3: ШТРИХОВКА

function hatching() {
  stroke(selectedColor(140));
  strokeWeight(1);

  // mouseX, mouseY — положение мыши сейчас.
  // pmouseX, pmouseY — положение на предыдущем кадре.
  //
  // abs() убирает минус, чтобы измерить движение.
  let speed =
    abs(mouseX - pmouseX) + abs(mouseY - pmouseY);

  // Если мышь не двигается, штрихи не добавляем.
  if (speed > 0) {

    // Вектор — как стрелка с направлением и длиной.
    // Переставляем движения X и Y,
    // чтобы задать направление штрихов.
    let vector = createVector(
      mouseY - pmouseY,
      mouseX - pmouseX
      );

    // Ограничиваем длину значениями от 2 до 15.
    let length = constrain(speed / 2, 2, 15);
    vector.setMag(length);

    // Добавляем три штриха между положениями мыши.
    let lerps = 3;

    for (let i = 0; i < lerps; i++) {

      // lerp() находит промежуточное положение.
      let x = lerp(mouseX, pmouseX, i / lerps);
      let y = lerp(mouseY, pmouseY, i / lerps);

      line(
        x - vector.x,
        y - vector.y,
        x + vector.x,
        y + vector.y
        );
    }
  }
}


// КИСТЬ 4: ЦЕПОЧКА

function chainBrush() {

  // Только контур, без заливки.
  noFill();

  stroke(selectedColor(150));
  strokeWeight(1);

  let distance = dist(
    mouseX, mouseY,
    pmouseX, pmouseY
    );

  if (distance > 0) {

    // Находим угол движения мыши.
    let angle = atan2(
      mouseY - pmouseY,
      mouseX - pmouseX
      );

    // Сохраняем настройки перед переносом и поворотом.
    push();

    // Временно переносим начало координат под мышь.
    translate(mouseX, mouseY);

    // Поворачиваем овал вслед за движением.
    rotate(angle);

    // Звено шириной 10 и высотой 5.
    ellipse(0, 0, 10, 5);

    // Возвращаем обычные координаты.
    pop();
  }
}


// КИСТЬ 5: КАРАНДАШНЫЕ ЦАРАПИНКИ

function scratchBrush() {
  stroke(selectedColor(70));
  strokeWeight(1);

  // Повторяем пять раз: i = 0, 1, 2, 3, 4.
  for (let i = 0; i < 5; i++) {

    // Линии находятся через 2 пикселя друг от друга.
    let x = mouseX + i * 2;

    // Немного сдвигаем начало вверх или вниз.
    let y = mouseY + random(-2, 2);

    // Случайная длина от 6 до 12.
    let length = random(6, 12);

    // Конец слегка отклоняется в сторону.
    line(x, y, x + random(-1, 1), y + length);
  }
}


// КИСТЬ 6: МАЛЕНЬКИЕ КОШАЧЬИ ГОЛОВЫ

function catBrush() {

  // Убираем обводку.
  noStroke();

  // Заливка выбранным цветом.
  // 45 — небольшая непрозрачность:
  // кошки наслаиваются в текстуру.
  fill(selectedColor(45));

  // Короткие названия координат мыши.
  let x = mouseX;
  let y = mouseY;

  // triangle() получает координаты трёх вершин.
  //
  // x - 5 — на 5 пикселей левее мыши.
  // y - 8 — на 8 пикселей выше мыши.

  // Левое ухо.
  triangle(
    x - 5, y - 1,
    x - 5, y - 8,
    x, y - 4
    );

  // Правое ухо.
  triangle(
    x, y - 4,
    x + 5, y - 8,
    x + 5, y - 1
    );

  // Голова:
  // центр под мышью, ширина 11, высота 10.
  ellipse(x, y, 11, 10);
}


// КИСТЬ 7: НАПЫЛЕНИЕ

function sprayPaint() {
  stroke(selectedColor(160));
  strokeWeight(1);

  let speed =
    abs(mouseX - pmouseX) + abs(mouseY - pmouseY);

  // Минимальный радиус распыления.
  let minRadius = 8;

  // В каждой группе — 12 точек.
  let sprayDensity = 12;

  // Три группы за кадр: всего 36 точек.
  let lerps = 3;

  // Движение увеличивает радиус,
  // но он остаётся между 8 и 20.
  let r = constrain(minRadius + speed / 4, 8, 20);
  let rSquared = r * r;

  for (let i = 0; i < lerps; i++) {

    // Располагаем группы вдоль движения мыши.
    let lerpX = lerp(mouseX, pmouseX, i / lerps);
    let lerpY = lerp(mouseY, pmouseY, i / lerps);

    for (let j = 0; j < sprayDensity; j++) {

      // Случайное горизонтальное смещение.
      let randX = random(-r, r);

      // Выбираем вертикальное смещение,
      // при котором точка остаётся внутри круга.
      let randY =
        random(-1, 1) * sqrt(rSquared - randX * randX);

      point(
        lerpX + randX,
        lerpY + randY
        );
    }
  }
}


// КИСТЬ 8: ТЕКСТУРА ИЗ КВАДРАТОВ

function squareTextureBrush() {
  push();

  noStroke();
  fill(selectedColor(60));

  // Представь сетку вокруг курсора.
  // Первый цикл перебирает столбцы,
  // второй — строки.
  for (let x = -15; x <= 15; x += 3) {
    for (let y = -9; y <= 9; y += 3) {

      // Проверяем, находится ли место внутри овала.
      let distance = (x / 15) * (x / 15)
        + (y / 9) * (y / 9);

      if (distance < 1) {

        // Часть квадратов пропускаем,
        // чтобы в текстуре оставались просветы.
        if (random(1) < 0.65) {

          // Маленький квадрат со стороной 1.5 пикселя.
          // Случайный сдвиг убирает идеальную ровность.
          square(
            mouseX + x + random(-0.5, 0.5),
            mouseY + y + random(-0.5, 0.5),
            1.5
            );
        }
      }
    }
  }

  pop();
}


// КИСТЬ 9: ЗНАКИ >

function angleBrush() {
  stroke(selectedColor(90));
  strokeWeight(1);

  let x = mouseX;
  let y = mouseY;

  // Верхняя половина знака.
  line(x - 3, y - 5, x + 3, y);

  // Нижняя половина знака.
  line(x + 3, y, x - 3, y + 5);
}


// КИСТЬ 0: РАДУЖНЫЕ КОНТУРНЫЕ КВАДРАТЫ

function rainbowSquares() {

  // Сохраняем настройки других кистей.
  push();

  // HSB позволяет выбирать оттенок одним числом.
  // Оттенок — от 0 до 360.
  // Остальные значения — от 0 до 100.
  colorMode(HSB, 360, 100, 100, 100);

  // frameCount увеличивается каждый кадр.
  // % 360 возвращает оттенок к началу цветового круга.
  let hue = (frameCount * 2) % 360;

  // Квадраты остаются пустыми внутри.
  noFill();

  // Эта кисть использует собственный радужный цвет.
  stroke(hue, 75, 85, 60);
  strokeWeight(0.8);

  let distance = dist(
    mouseX, mouseY,
    pmouseX, pmouseY
    );

  if (distance > 0) {

    // Находим середину между положениями мыши.
    let midX = (mouseX + pmouseX) / 2;
    let midY = (mouseY + pmouseY) / 2;

    // Размер ограничен значениями от 4 до 10.
    let size = constrain(distance, 4, 10);

    // Центрируем квадрат в найденной точке.
    square(
      midX - size / 2,
      midY - size / 2,
      size
      );
  }

  // Возвращаем обычный цветовой режим.
  pop();
}


// УПРАВЛЕНИЕ КЛАВИАТУРОЙ

// Эта функция запускается при нажатии клавиши.
// key хранит символ нажатой клавиши.
function keyPressed() {

  // Дополнительное сохранение английской S.
  if (key === 's') {
    saveCanvas('my-drawing', 'png');
  }

  // При переключении завершаем старый штрих
  // и запоминаем номер новой кисти.
  if (key === '1') {
    drawingTapered = false;
    choice = '1';
  }

  if (key === '2') {
    drawingTapered = false;
    choice = '2';
  }

  if (key === '3') {
    drawingTapered = false;
    choice = '3';
  }

  if (key === '4') {
    drawingTapered = false;
    choice = '4';
  }

  if (key === '5') {
    drawingTapered = false;
    choice = '5';
  }

  if (key === '6') {
    drawingTapered = false;
    choice = '6';
  }

  if (key === '7') {
    drawingTapered = false;
    choice = '7';
  }

  if (key === '8') {
    drawingTapered = false;
    choice = '8';
  }

  if (key === '9') {
    drawingTapered = false;
    choice = '9';
  }

  if (key === '0') {
    drawingTapered = false;
    choice = '0';
  }

  // Английская X очищает весь холст.
  if (key === 'x') {
    drawingTapered = false;
    background(250);
  }

  if (key === 'X') {
    drawingTapered = false;
    background(250);
  }
}


// Для сенсорного экрана:
// не прокручиваем страницу при рисовании пальцем.
function touchMoved() {
  return false;
}
