function preload() {
    table = loadTable("data/VideoGames.csv", "csv", "header");
}

// Data format
// Name,Platform,Year_of_Release,Genre,Publisher,NA_Sales,EU_Sales,JP_Sales,Other_Sales,Global_Sales,Critic_Score,Critic_Count,User_Score,User_Count,Developer,Rating

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(200);

    print(table);
    let names = table.getColumn("Name");
    let platforms = table.getColumn("Platform");
    let releaseYear = table.getColumn("Year_of_Release");
    let globalSales = table.getColumn("Global_Sales");
    let developer = table.getColumn("Developer");

    // Example of data
    print(names[500], ", release year: " + releaseYear[500], " has global sales of " + globalSales[500]);
}

function draw() {
}
