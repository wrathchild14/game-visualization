function preload() {
    table = loadTable("data/VideoGames.csv", "csv", "header");
}

// Data format
// Name,Platform,Year_of_Release,Genre,Publisher,NA_Sales,EU_Sales,JP_Sales,Other_Sales,Global_Sales,Critic_Score,Critic_Count,User_Score,User_Count,Developer,Rating

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    noLoop();
}

function draw() {
    background(200);

    
    let names = table.getColumn("Name");
    let platforms = table.getColumn("Platform");
    let releaseYear = table.getColumn("Year_of_Release");
    let globalSales = table.getColumn("Global_Sales");
    let developer = table.getColumn("Developer");

    textSize(50);
    text("Global sales", width/2 - 130, 100)

    pieChart(800, globalSales.slice(0, 50));
}

function pieChart(diameter, data) {
    let lastAngle = 0;
    for (let i = 0; i < data.length; i++) {
        let gray = map(i, 0, data.length, 0, 255);
        fill(gray);
        arc(
            width / 2,
            height / 2,
            diameter,
            diameter,
            lastAngle,
            lastAngle + radians(data[i])
        );
        lastAngle += radians(data[i]);
    }
}