// _g = Global variables
// points_g = tracking of the points on screen, games_data_g = data handling
let points_g = [], games_data_g = [];
let multiplier_diagram_x_g = 1 / 4, multiplier_diagram_y_g = 1 / 2, multiplier_r_g = 0; // inital multiplier values
let zoomed_state_g = false;
let focused_game_g = 0;

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
    
    // freeing
    points_g = [];

    if (!zoomed_state_g) { 
        multiplier_diagram_x_g = lerp(multiplier_diagram_x_g, 2.8 / 4, 0.1);
        multiplier_r_g = lerp(multiplier_r_g, 1 / 7, 0.075);

        textSize(30);
        text('Global sales of video games through the years', width / 4, height / 4 - 120, width /3  + 150);

        textSize(15);
        text('Hover/click the points...', width / 4, height / 4 - 80, width /3  + 145);
    } else {
        multiplier_diagram_x_g = lerp(multiplier_diagram_x_g, 1 / 2, 0.1);
        multiplier_r_g = lerp(multiplier_r_g, 1 / 4, 0.075);

        show_focused_text();
    }

    // how much data we display
    const rows = 120;

    // works with our global variables
    diagramX = multiplier_diagram_x_g * width;
    diagramY = multiplier_diagram_y_g * height;
    radius = multiplier_r_g * width;

    const angle = 360 / rows;

    const minValue = -5.09;
    const maxValue = 82.53;

    const line_size = [];
    for (let i = 0; i < rows; i += 1) {
        line_size[i] = map(games_data_g[i].global_sale, minValue, maxValue, 0, 205);
        const pointX = (line_size[i] + radius) * cos(angle * i) + diagramX;
        const pointY = (line_size[i] + radius) * sin(angle * i) + diagramY;
        points_g.push([pointX, pointY]);
        const cirx = radius * cos(angle * i) + diagramX;
        const ciry = radius * sin(angle * i) + diagramY;

        // year divider
        if (i % 10 == 0) {
            push();
            translate(pointX, pointY); // where the years are going to be
            rotate(angle * i + 90);
            textAlign(CENTER);
            textSize(16);
            text(games_data_g[i].release_years.slice(-2) + "'", 0, -5); // offset
            pop();

            strokeWeight(1.5);
        } else {
            strokeWeight(0.5);
        }

        stroke('black');
        line(cirx, ciry, pointX, pointY);

        handle_points(pointX, pointY, diagramX, diagramY, i);
    }
    
    // handle zooming out
    const mouse_pos_circle = dist(mouseX, mouseY, diagramX, diagramY);
    if (mouse_pos_circle > radius + 250 && zoomed_state_g) {
        zoomed_state_g = false;
    }
}

function mouseClicked(event) {
    // this is heavy
    for (let i = 0; i < points_g.length; i += 1) {
        const [pointX, pointY] = points_g[i];
        const dis = dist(mouseX, mouseY, pointX, pointY);
        if (dis < 7) {
            zoomed_state_g = true;
            focused_game_g = i;
            // print(`Clicked ${games_data_g[i].title}`, event);
            
            // text(`${games_data_g[i].title}`, width / 4, height / 4 + 50);
        }
    }
}

function subText(name, global_sale, user_scores, user_counts) {
    textSize(16);
    textAlign(LEFT);
    fill('black');
    if (global_sale !== undefined && user_counts !== '') { // ????? i guess this should stay here because it doesnt even display text
        text(`${name} has ${global_sale} million global sales with a rating of ${user_scores} from ${user_counts} users.`, width / 4, height / 4, width / 3 + 140);
    }
}

function show_focused_text() {
    textSize(16);
    textAlign(CENTER);
    fill('black');
    text(games_data_g[focused_game_g].title, width/2, height/2, width/3)
}

// showing of points, showing of bigger point and sub text when hovering
function handle_points( pointX, pointY, diagramX, diagramY, focused_point) {
    const i = focused_point;
    const dis = dist(mouseX, mouseY, pointX, pointY);
    let pointSize = 3;
    if (dis < 5 && !zoomed_state_g) {
        fill('black');
        pointSize = 12;
        noStroke();
        circle(pointX, pointY, pointSize);

        textAlign(CENTER);
        textSize(25);
        fill('black');
        text(games_data_g[i].title, diagramX, diagramY);

        fill('black');
        rect(diagramX, diagramY + 18, 30, 5);
        fill('green');
        textSize(20);
        text(games_data_g[i].developer, diagramX, diagramY + 50);

        if (!zoomed_state_g) {
            subText(games_data_g[i].title, games_data_g[i].global_sale, games_data_g[i].user_score, games_data_g[i].user_count);
        }
    } else {
        fill('blue');
        pointSize = 4;

        noStroke();
        circle(pointX, pointY, pointSize);
        subText();
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

            games_data_g.push(game_object);
        }
    }

    games_data_g.sort(function (a, b) {
        return a.release_years - b.release_years;
    });

    games_data_g = games_data_g.reverse();
}
