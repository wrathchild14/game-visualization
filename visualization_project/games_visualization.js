// Global variables
// Points = tracking of the points on screen, Games_data = data handling
let Points = [], Games_data = [];

function preload() {
    table = loadTable('data/video_games.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    angleMode(DEGREES);

    setupData(4.0);
}

function draw() {
    background(200);

    textSize(30);
    text('Global sales of video games', width / 4, height / 4 - 120, width / 4 + 50);

    // how much data we display
    const rows = 150;

    const diagramX = (width / 4) * 3 - 90;
    // const diagramX = (width / 2);
    const diagramY = height / 2;
    // let radius = width / 5 - 100;
    const radius = width / 5 - 150;
    // const radius = width / 3 - 150;
    const angle = 360 / rows;

    const minValue = -5.09;
    const maxValue = 82.53;

    const lengthSize = [];
    for (let i = 0; i < rows; i += 1) {
        lengthSize[i] = map(Games_data[i].global_sale, minValue, maxValue, 0, 205);
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
            textSize(16);
            text(Games_data[i].release_years.slice(-2) + "'", 0, -5); // offset
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
            text(Games_data[i].title, diagramX, diagramY);

            fill('black');
            rect(diagramX, diagramY + 18, 30, 5);
            fill('green');
            textSize(20);
            text(Games_data[i].developer, diagramX, diagramY + 50);

            subText(Games_data[i].title, Games_data[i].global_sale, Games_data[i].user_score, Games_data[i].user_count);
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
            print(`Clicked ${Games_data[i].title}`, event);
            textSize(16);
            textAlign(LEFT);
            fill('black');
            text(`${Games_data[i].title}`, width / 4, height / 4 + 50);
        }
    }
}

function subText(name, global_sale, user_scores, user_counts) {
    textSize(16);
    textAlign(LEFT);
    fill('black');
    if (global_sale !== undefined && user_counts !== '') { // ?????
        text(`${name} has ${global_sale} million global sales with a rating of ${user_scores} from ${user_counts} users.`, width / 4, height / 4, width / 4);
    }
}

function setupData(global_sales_minimum) {
    const titles = table.getColumn('Name');
    const platforms = table.getColumn('Platform');
    const release_years = table.getColumn('Year_of_Release');
    const global_sales = table.getColumn('Global_Sales');
    const developers = table.getColumn('Developer');
    const user_counts = table.getColumn('User_Count');
    const user_scores = table.getColumn('User_Score');

    for (let i = 0; i < titles.length; i++) {
        if (user_scores[i] === '' || user_counts[i] === '' || global_sales[i] < global_sales_minimum) {
            continue;
        } else {
            let game_object = new Object();
            game_object.title = titles[i];
            game_object.release_years = release_years[i];
            game_object.platform = platforms[i];
            game_object.developer = developers[i];
            game_object.global_sale = global_sales[i];
            game_object.user_score = user_scores[i];
            game_object.user_count = user_counts[i];

            Games_data.push(game_object);
        }
    }

    Games_data.sort(function (a, b) {
        return a.release_years - b.release_years;
    });

    Games_data = Games_data.reverse();
}
