var pdf;
var myFont;
var cnv;
let schoolX, schoolY, textX, textY;
let slider;
let multipleforce;
let name, school, town, opt, day, month, year;
let bg;
let pg;
var but;
var marginleft, margintop;
let pdfprint;
let mm, pt;
let schoolData;
let amount;
let mainKegel, mainLead, smallKegel, smallLead;
let bottomM, topM, leftP, rightP;
let regular, bold;
let tAlign, sAlign;

const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const options = ["Communication", "Design", "Art"];

function preload() {
  bg = loadImage("assets/dna.png");

  schoolData = loadTable("assets/allschools.csv", "csv", "header");
  regular = loadFont("fonts/Dedale-Regular.otf");
  bold = loadFont("fonts/Dedale-Bold.otf");
  myFont = loadFont(
    "fonts/DedaleVAR.ttf",
    () => {wght: [616]},
    () => {},
    "Dedale"
  );
}

function setup() {
  amount = schoolData.getRowCount() - 2;
  cnv = createCanvas(
    (0.94 * min(windowHeight, windowWidth) * 210.0) / 297,
    0.94 * min(windowHeight, windowWidth),
    SVG
  );
  mm = height / 297.0;

  let menuWidth = 400;

  cnv.parent("container");

  marginleft = 8 * mm;
  margintop = 7 * mm;

  name = createInput();
  name.value("Archibald Haddock");
  name.position(width + 0.03 * height + 20, 30);
  name.style("width", menuWidth - 8 + "px");

  but = createButton("Download PDF");
  but.position(width + 0.03 * height + 20, 230);
  but.mouseClicked(readyToPrint);
  but.style("width", menuWidth + "px");

  school = createSelect();
  school.position(width + 0.03 * height + 20, 150);
  school.style("width", menuWidth + "px");
  for (let j = 0; j < amount; j++) {
    school.option(schoolData.getString(j, 0));
  }
  
  day = createInput();
  day.position(width + 0.03 * height + 20, 74);
  day.style("width", "30px");
  day.value("10");

  month = createSelect();
  month.position(width + 0.03 * height + 66, 70);
  for (let j = 0; j < months.length; j++) {
    month.option(months[j]);
  }
  month.style("width", menuWidth - 110 + "px");

  year = createInput();
  year.position(width + 0.03 * height + 20 + menuWidth - 58, 74);
  year.style("width", "50px");
  year.value("2002");

  town = createInput();
  town.value("Nancy");
  town.position(width + 0.03 * height + 20, 114);
  //town.style("margin-left", "75px");
  town.style("width", menuWidth + "px");

  opt = createSelect();
  opt.position(width + 0.03 * height + 20, 190);
  for (let j = 0; j < options.length; j++) {
    opt.option(options[j]);
  }
  opt.style("width", menuWidth + "px");
  opt.value(options[1]);
  
  slider = createSlider(1, 10, 10, 0.1);
  slider.position(width + 0.03 * height + 20, 280);
  slider.style('width', menuWidth + "px");

  //calculating area:
  bottomM = schoolData.getNum(0, 1);
  topM = schoolData.getNum(0, 1);
  for (let j = 0; j < amount; j++) {
    if (bottomM > schoolData.getNum(j, 1)) {
      bottomM = schoolData.getNum(j, 1);
    }
    if (topM < schoolData.getNum(j, 1)) {
      topM = schoolData.getNum(j, 1);
    }
  }

  leftP = schoolData.getNum(0, 2);
  rightP = schoolData.getNum(0, 2);
  for (let j = 0; j < amount; j++) {
    if (leftP > schoolData.getNum(j, 2)) {
      leftP = schoolData.getNum(j, 2);
    }
    if (rightP < schoolData.getNum(j, 2)) {
      rightP = schoolData.getNum(j, 2);
    }
  }
  background(255);
}

function draw() {
  clear();
  if (pdfprint) {
    pdf = createPDF();
    pdf.beginRecord();
    
    background(255);
    // myFont = loadFont(
    //   "fonts/DedaleVAR.ttf",
    //   () => {},
    //   () => {},
    //   "Dedale"
    // );
  } else {
    image(bg, 0, 0, width, height);
  }
  
  pt = 0.353 * mm;
  (mainKegel = 10), 3 * pt;
  (mainLead = 12), 64 * pt;
  smallKegel = 6.5 * pt;
  smallLead = 8 * pt;
  let gapX = 16 * mm;
  let gapY = 15.611 * mm;
  fill("#000000");
  noStroke();
  
  let schoolRow = schoolData.findRow(school.value(), "Nom");

  schoolX = int(map(schoolRow.getNum(2), leftP, rightP, 0, 8));
  schoolY = int(map(schoolRow.getNum(1), topM, bottomM, 0, 14));
  textX = 8 - schoolX;
  textY = 14 - schoolY;
  let startX = textX * gapX + 1 * mm;
  let startY = textY * gapY + 1 * mm;
  let endX = schoolX * gapX + 1 * mm;
  let endY = schoolY * gapY + 1 * mm;

  let totalLines = 9;
  let t1 = "La Direction de l’école certifie que";
  let t2 = name.value();
  let t3islong;
  t3islong = false;
  let t3 =
    "Nee le " +
    day.value() +
    " " +
    month.value() +
    " " +
    year.value() +
    " à " +
    town.value();
  
  if (textWidth(t3) > 5.9 * gapX) {
    for (let j = t3.length; j >= 0; j--) {
      if (t3.charAt(j) == "-") {
        t3 = t3.substring(0, j + 1) + " " + t3.substring(j + 1);
      }
    }
    t3 +=
      " a satisfait, dans les formes réglementaires,\naux épreuves en vue d’obtenir";
    t3islong = true;
    totalLines = 10;
  } else {
    t3 +=
      "\na satisfait, dans les formes réglementaires,\naux épreuves en vue d’obtenir";
    totalLines = 9;
  }
  let t4 = "Le diplôme national d’art\nconférant grade de licence";
  let t5 = "à la session d’examen de juin 2024";
  let t6 = "option " + opt.value();

  let s1 = decimalToDMS(schoolRow.getNum(1), schoolRow.getNum(2));
  let s2 = schoolRow.getString(0);
  let s3 = "Fait à Nancy\nle 20 juin 2024";
  let s4 = "Signature de la direction\net tampon de l’école";
  let s3height = 250.8 * mm - gapY - margintop - 0.4 * mm;
  let s4height = 276.943 * mm - gapY - margintop;

  //main margin
  translate(marginleft + 3 * gapX, margintop + gapY);

  //ellipse
  

  push();
  //horisontal school position
  translate(schoolX * gapX, 0);
  if (schoolX < 5) {
    tAlign = LEFT;
    translate(3.8 * mm, 0);
  } else {
    tAlign = RIGHT;
    translate(-3.9 * gapX - 1.8 * mm, 0);
  }

  //below
  if (schoolY > 7) {
    textFont(bold);textSize(mainKegel);
    textLeading(mainLead);
    textAlign(tAlign, TOP);
    text(s3, 0, s3height, 3.9 * gapX, 2 * mainLead);
    textFont(bold);textSize(smallKegel);
    textLeading(smallLead);textAlign(tAlign, TOP);
    text(s4, 0, s4height, 3.9 * gapX, 2 * smallLead);
  }

  translate(0, schoolY * gapY - 0.8 * mm);
  if (schoolY == 14) {
    translate(0, -gapY);
    endY-=gapY;
  }
  textFont(bold);textSize(smallKegel);
  textLeading(smallLead);
  textAlign(tAlign, TOP);
  text(s1, 0, 0 + 0.0 * mm, 3.9 * gapX, 2 * smallLead);
  textFont(bold);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(tAlign, TOP);
  text(s2, 0, 2 * smallLead + 0.0 * mm, 3.9 * gapX, gapY);
  pop();

  //person
  let lines = 1;
  let lineNum = 0;
  push();
  translate(textX * gapX, 0);
  if (textX < 4) {
    sAlign = LEFT;
    translate(3.8 * mm, -0.8 * mm);
  } else {
    sAlign = RIGHT;
    translate(-5.9 * gapX - 1.8 * mm, -0.8 * mm);
    noFill();
  
  }
  
  fill(0);
  if (schoolY <= 7) {
    textFont(bold);textSize(mainKegel);
    textLeading(mainLead);
    textAlign(sAlign, TOP);
    text(s3, 0, s3height, 5.9 * gapX, 2 * mainLead);
    textFont(bold);textSize(smallKegel);
    textLeading(smallLead);
    textAlign(sAlign, TOP);
    text(s4, 0, s4height, 5.9 * gapX, 2 * smallLead);
  }
  translate(0, textY * gapY-0.6*mm);
  if ((textY < 8 && textY > 3) || textY > 11) {
    //translate(0,(1-totalLines)*mainLead);
    translate(0, -3 * gapY);
    startY -= 3 * gapY;
  }
  if (schoolY == textY) {
    translate(0, -gapY);
    startY-=gapY;
  }
  textFont(regular);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  text(t1, 0, lineNum, 5.9 * gapX, lines * mainLead);
  lineNum += lines;

  textFont(bold);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  text(t2, 0, lineNum * mainLead, 5.9 * gapX, lines * mainLead);
  lineNum += lines;
  textFont(regular);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  if (!t3islong) {
    lines = 3;
  } else {
    lines = 4;
  }
  text(t3, 0, lineNum * mainLead, 5.9 * gapX, lines * mainLead);
  lineNum += lines;
  lines = 2;
  textFont(bold);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  text(t4, 0, lineNum * mainLead, 5.9 * gapX, lines * mainLead);
  lineNum += lines;
  lines = 1;
  textFont(regular);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  text(t5, 0, lineNum * mainLead, 5.9 * gapX, lines * mainLead);
  lineNum += lines;
  textFont(bold);textSize(mainKegel);
  textLeading(mainLead);
  textAlign(sAlign, TOP);
  text(t6, 0, lineNum * mainLead, 5.9 * gapX, lines * mainLead);
  pop();
  
  noFill();
  stroke(0);
  strokeWeight(1 * pt);
  
  ellipse(endX, endY, 2 * mm, 2 * mm);
  ellipse(startX, startY, 2 * mm, 2 * mm);
  
  
  strokeWeight(0.6 * pt);
  


  let v = createVector(endX, endY, startX, startY);
  let angleS = 0;
  for(let j = 0; j<t2.length; j++) {
   angleS += letterToNumber(t2.charAt(j));
   
  }
  let plusS = 0;
  if (opt.value() == options[0]) {
    plusS = (PI * 17) / 16;
  } else if (opt.value() == options[1]) {
    plusS = ((5 / 3) * PI * 17) / 16;
  } else if (opt.value() == options[2]) {
    plusS = ((7 / 3) * PI * 17) / 16;
  }
  angleE = v.heading() + plusS;
  force = 0.1*height;
  
  
  let controlStartX;
  let controlStartY;
  let controlEndX;
  let controlEndY;
  while (force<slider.value()*height) {


  controlStartX = startX + cos(angleS) * force;
  controlStartY = startY + sin(angleS) * force;
  controlEndX = endX + cos(angleE) * force * 0.5;
  controlEndY = endY + sin(angleE) * force * 0.5;
  
  let maxX = -Infinity;
let minX = Infinity;
let maxY = -Infinity;
let minY = Infinity;
  for (let t = 0; t <= 1; t += 0.01) {
  // Use the Catmull-Rom spline equation to calculate the coordinates
  let x = catmullRomX(controlStartX, startX, endX, controlEndX, t);
  let y = catmullRomY(controlStartY, startY, endY, controlEndY, t);

  // Update the maximum and minimum x and y values
  maxX = max(maxX, x);
  minX = min(minX, x);
  maxY = max(maxY, y);
  minY = min(minY, y);
  }
if(minX<=-2.5*gapX||maxX>=8.5*gapX||minY<=-0.5*gapY||maxY>=14*gapY) {
  break;
}
    force+=height*0.1;
  }
  
  curve(
    controlStartX,
    controlStartY,
    startX,
    startY,
    endX,
    endY,
    controlEndX,
    controlEndY
  );

  if (pdfprint) {
    pdf.save();
    pdfprint = false;
  }
}

function readyToPrint() {
  pdfprint = true;
}


function catmullRomX(p0, p1, p2, p3, t) {
  return 0.5 * (
    (-p0 + 3 * p1 - 3 * p2 + p3) * (t * t * t) +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * (t * t) +
    (-p0 + p2) * t +
    2 * p1
  );
}

function catmullRomY(p0, p1, p2, p3, t) {
  return 0.5 * (
    (-p0 + 3 * p1 - 3 * p2 + p3) * (t * t * t) +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * (t * t) +
    (-p0 + p2) * t +
    2 * p1
  );
}

function decimalToDMS(latitude, longitude) {
  const latDeg = int(abs(latitude));
  const latMin = int((abs(latitude) - latDeg) * 60);
  const latSec = (abs(latitude) - latDeg - latMin / 60) * 60 * 60;
  const latDirection = latitude >= 0 ? "N" : "S";

  const lonDeg = int(abs(longitude));
  const lonMin = int((abs(longitude) - lonDeg) * 60);
  const lonSec = (abs(longitude) - lonDeg - lonMin / 60) * 60 * 60;
  const lonDirection = longitude >= 0 ? "E" : "W";

  const latSecFormatted = nf(int(latSec / 100), 2);
  const lonSecFormatted = nf(int(lonSec / 100), 2);

  const result =
    latDeg +
    "°" +
    latMin +
    "'" +
    latSecFormatted +
    '"' +
    latDirection +
    "\n" +
    lonDeg +
    "°" +
    lonMin +
    "'" +
    lonSecFormatted +
    '"' +
    lonDirection;
  return result;
}
function letterToNumber(letter) {
  if (letter.match(/[a-zA-Z]/)) {
    // Convert the letter to uppercase to handle both cases
    letter = letter.toUpperCase();

    // Subtract the ASCII value of 'A' to get the position in the alphabet (0-based)
    return letter.charCodeAt(0) - "A".charCodeAt(0) + 1;
  } else {
    // Handle non-letter characters, e.g., return -1 or an error code
    return -1;
  }
}

