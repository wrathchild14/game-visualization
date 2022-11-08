// Global variables
let Points;
let Titles;
let Entities;
let games_data;

function preload() {
    table = loadTable('data/video_games.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(200);

    textSize(30);
    text('Global sales of video games', width / 4, height / 4 - 120, width / 4 + 50);

    games_data = {};

    Titles = table.getColumn('Name');
    const platforms = table.getColumn('Platform');
    const release_year = table.getColumn('Year_of_Release');
    const global_sales = table.getColumn('Global_Sales');
    const developers = table.getColumn('Developer');
    const user_counts = table.getColumn('User_Count');
    const user_scores = table.getColumn('User_Score');

    for (let i = 0; i < Titles.length; i++) {
        if (user_scores[i] === '' || user_counts[i] === '') {
            continue;
        } else {
            // sort dict by the release year
            games_data[Titles[i]] = [ 
                platforms[i], developers[i], release_year[i], global_sales[i], user_scores[i], user_counts[i]
            ];
        }
    }

    // placeholder
    const na_sales = table.getColumn('NA_Sales');

    // how much data we display
    const rows = 100;

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
        const pointX = (lengthSize[i] + radius) * cos(angle * i) + diagramX;
        const pointY = (lengthSize[i] + radius) * sin(angle * i) + diagramY;
        Points.push([pointX, pointY]);
        const cirx = radius * cos(angle * i) + diagramX;
        const ciry = radius * sin(angle * i) + diagramY;

        // year divider
        if (i % 10 == 0) {
            push();
            translate(pointX, pointY); // where the years are going to be
            rotate(angle * i + 90);
            textAlign(CENTER);
            textSize(12);
            text("'22", 0, -5); // offset
            pop();

            strokeWeight(1.5);
        } else {
            strokeWeight(0.5);
        }

        stroke('black');
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
            text(Titles[i], diagramX, diagramY);

            fill('black');
            rect(diagramX, diagramY + 18, 30, 5);
            fill('green');
            textSize(20);
            text(developers[i], diagramX, diagramY + 50);

            subText(Titles[i], global_sales[i], user_scores[i], user_counts[i]);
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
            print(`Clicked ${Titles[i]}`, event);
            textSize(16);
            textAlign(LEFT);
            fill('black');
            text(`${Titles[i]}`, width / 4, height / 4 + 50);
        }
    }
    // print(Entities);
}

function subText(name, global_sale, user_scores, user_counts) {
    textSize(16);
    textAlign(LEFT);
    fill('black');
    // this wont be needed as i will bad data
    if (global_sale !== undefined && user_counts !== '') { // ?????
        text(`${name} has ${global_sale} million global sales with a rating of ${user_scores} from ${user_counts} users.`, width / 4, height / 4, width / 4);
    }
}
