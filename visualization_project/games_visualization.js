// Global variables
let Points;
let Names;

function preload() {
    table = loadTable('data/video_games.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
}

function draw() {
    background(200);

    textSize(30);
    text('Global sales of video games', width / 4, height / 4 - 120, width / 4 + 50);

    Names = table.getColumn('Name');
    // const platforms = table.getColumn('Platform');
    // const releaseYear = table.getColumn('Year_of_Release');
    const global_sales = table.getColumn('Global_Sales');
    const developer = table.getColumn('Developer');
    const na_sales = table.getColumn('NA_Sales');
    // const euSales = table.getColumn('EU_Sales');
    // const jpSales = table.getColumn('JP_Sales');
    const user_count = table.getColumn('User_Count');
    const user_score = table.getColumn('User_Score');

    const rows = 150;

    const sales = na_sales.slice(0, rows);
    const diagramX = (width / 4) * 3 - 90;
    const diagramY = height / 2;
    // let radius = width / 5 - 100;
    const radius = width / 4 - 150;
    const angle = 360 / rows;

    const minValue = -5.09;
    const maxValue = 82.53;

    const lengthSize = [];
    Points = [];
    for (let i = 0; i < rows; i += 1) {
        lengthSize[i] = map(sales[i], minValue, maxValue, 0, 205);
        const pointX = (lengthSize[i] + radius) * cos(radians(angle * i)) + diagramX;
        const pointY = (lengthSize[i] + radius) * sin(radians(angle * i)) + diagramY;
        Points.push([pointX, pointY]);
        const cirx = radius * cos(radians(angle * i)) + diagramX;
        const ciry = radius * sin(radians(angle * i)) + diagramY;

        stroke('black');
        strokeWeight(0.5);
        line(cirx, ciry, pointX, pointY);

        const dis = dist(mouseX, mouseY, pointX, pointY);
        let pointSize = 3;
        if (dis < 5) {
            fill('black');
            pointSize = 12;
            noStroke();
            circle(pointX, pointY, pointSize);

            textAlign(CENTER);
            textSize(25);
            fill('black');
            text(Names[i], diagramX, diagramY);

            fill('black');
            rect(diagramX, diagramY + 18, 30, 5);
            fill('green');
            textSize(20);
            text(developer[i], diagramX, diagramY + 50);

            subText(Names[i], global_sales[i], user_score[i], user_count[i]);
        } else {
            fill('blue');
            pointSize = 4;

            noStroke();
            circle(pointX, pointY, pointSize);

            subText();
        }
    }
}

function mouseClicked(event) {
    for (let i = 0; i < Points.length; i += 1) {
        const [pointX, pointY] = Points[i];
        const dis = dist(mouseX, mouseY, pointX, pointY);
        if (dis < 7) {
            print(`Clicked ${Names[i]}`, event);
            textSize(16);
            textAlign(LEFT);
            fill('black');
            text(`${Names[i]}`, width / 4, height / 4 + 50);
        }
    }
}

function subText(name, global_sale, user_score, user_count) {
    textSize(16);
    textAlign(LEFT);
    fill('black');
    if (global_sale !== undefined && user_count !== "") { // ?????
        text(`${name} has ${global_sale} million global sales with a rating of ${user_score} from ${user_count} users.`, width / 4, height / 4, width / 4);
    }
}
