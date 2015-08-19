// Global variables
var xSize = 16,
    ySize = 16,
    minesCount = 40,
    minedCells = [];

$(document).ready(function () {
    init();
});

function init() {
    generateBoard(xSize, ySize);
    minedCells = seedMines(xSize, ySize, minesCount);
    renderNumbers();
    //revealAll();
    //showMines();
}

function generateBoard(xSize, ySize) {
    var board = document.createElement("div");
    $(board).addClass("board");
    $("#minesweeper").append(board);
    for (var y = 0; y < ySize; y++) {
        for (var x = 0; x < xSize; x++) {
            var cell = document.createElement("div");
            $(cell).addClass("cell");
            $(cell).attr("data-y", y);
            $(cell).attr("data-x", x);
            $(cell).on("click", function () {
                revealCellByClick(this);
            });
            $(board).append(cell);
        }
    }
}

function seedMines(xSize, ySize, minesCount) {
    var mineCollection = [];
    var i = 0;
    while (i != minesCount) {
        var duplicate = false;
        var yCoord = Math.floor(Math.random() * ySize);
        var xCoord = Math.floor(Math.random() * xSize);
        var minedCell = getCellByCoordinates(yCoord, xCoord);
        mineCollection.forEach(function (item) {
            if ($(item).attr("data-y") == yCoord &&
                $(item).attr("data-x") == xCoord) {
                duplicate = true; //mine already exist in this cell
                //console.log("DUBLICATE!!!!!!!!! x: " + xCoord + " y: " + yCoord);
            }
        });
        if (duplicate) continue;
        $(minedCell).data("mined", -1);
        mineCollection.push(minedCell);
        //console.log(i + "- x:" + xCoord + " " + "y:" + yCoord + " pushed!");
        i++;
    }
    return mineCollection;
}

function renderNumbers() {
    var cells = $(".cell");
    for (var i = 0; i < cells.length; i++) {
        if ($(cells[i]).data("mined") != -1) {
            $(cells[i]).data("mined", checkSurrounding(cells[i]));
        }
    }
}

function checkSurrounding(cell) {
    var y = parseInt($(cell).attr("data-y")),
        x = parseInt($(cell).attr("data-x")),
        mineCount = 0,
        surrounding = [],
        delta = [-1, 0, 1],
        index = 0;
    for (var i = 0; i < delta.length; i++) {
        for (var j = 0; j < delta.length; j++) {
            if (delta[i] == 0 && delta[j] == 0) continue;
            surrounding[index] = getCellByCoordinates(y + delta[i], x + delta[j]);
            index++;
        }
    }
    for (var n = 0; n < surrounding.length; n++) {
        if ($(surrounding[n]).data("mined") == -1) {
            mineCount++;
        }
    }
    return mineCount;
}

function getCellByCoordinates(y, x) {
    return $("[data-y='" + y + "'][data-x='" + x + "']")[0];
}

function revealCell(cell) {
    switch ($(cell).data("mined")) {
        case -1:
            $(cell).addClass("mine");
            break;
        case 0:
            $(cell).addClass("blank");
            break;
        case 1:
            $(cell).addClass("number one");
            break;
        case 2:
            $(cell).addClass("number two");
            break;
        case 3:
            $(cell).addClass("number three");
            break;
        case 4:
            $(cell).addClass("number four");
            break;
        case 5:
            $(cell).addClass("number five");
            break;
        case 6:
            $(cell).addClass("number six");
            break;
        case 7:
            $(cell).addClass("number seven");
            break;
        case 8:
            $(cell).addClass("number eight");
            break;
        default:
            break;
    }
}

function revealCellByClick(cell) {
    switch ($(cell).data("mined")) {
        case -1:
            $(cell).addClass("mine");
            alert("You lost =(");
            location.reload();
            break;
        case 0:
            if ($(cell).attr("class") == "cell") {
                $(cell).addClass("blank");
                revealBlankCellSurrounding(cell);
            }
            break;
        case 1:
            $(cell).addClass("number one");
            break;
        case 2:
            $(cell).addClass("number two");
            break;
        case 3:
            $(cell).addClass("number three");
            break;
        case 4:
            $(cell).addClass("number four");
            break;
        case 5:
            $(cell).addClass("number five");
            break;
        case 6:
            $(cell).addClass("number six");
            break;
        case 7:
            $(cell).addClass("number seven");
            break;
        case 8:
            $(cell).addClass("number eight");
            break;
        default:
            break;
    }
}

function revealBlankCellSurrounding(cell) {
    var y = parseInt($(cell).attr("data-y")),
        x = parseInt($(cell).attr("data-x")),
        delta = [-1, 0, 1],
        index = 0;
    for (var i = 0; i < delta.length; i++) {
        for (var j = 0; j < delta.length; j++) {
            if (delta[i] == 0 && delta[j] == 0) continue;
            revealCellByClick(getCellByCoordinates(y + delta[i], x + delta[j]));
            index++;
        }
    }
}

function showMines() {
    minedCells.forEach(function (item) {
        $(item).addClass("mine");
    })
}
function revealAll() {
    var cells = $(".cell");
    for (var i = 0; i < cells.length; i++) {
        revealCell(cells[i]);
    }
}