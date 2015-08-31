/*TODO
 * TODO interface (restart game/difficulties/other)
 * TODO game difficulties
 * TODO redo winning/losing*/


// Global variables
var xSize = 16,
    ySize = 16,
    minesCount = 40,
    flagCount = 40,
    revealedCells = 0,
    time = 0,
    minedCells = [];

$(document).ready(function () {
    init();
});

function init() {
    generateBoard(xSize, ySize);
    refreshFlagCount();
}

function renderBoard() {
    minedCells = seedMines(xSize, ySize, minesCount, this);
    renderNumbers();
    updateTimer();
    $(".cell").unbind("click", renderBoard);
}

function generateBoard(xSize, ySize) {
    var board = document.createElement("div");
    $(board).addClass("board");
    $(".minesweeper").append(board);
    for (var y = 0; y < ySize; y++) {
        for (var x = 0; x < xSize; x++) {
            var cell = document.createElement("div");
            $(cell).addClass("cell unrevealed");
            $(cell).attr("data-y", y).attr("data-x", x);
            $(cell).on("click", renderBoard)
                .on("click", function () {
                    revealCellByClick(this);
                }).on("contextmenu", function () {
                    toggleFlag(this);
                    return false;
                }).on("dblclick", function () {
                    checkNumberSurrByDblClick(this);
                });
            $(board).append(cell);
        }
    }
}

function seedMines(xSize, ySize, minesCount, firstCell) {
    var mineCollection = [],
        i = 0;
    while (i != minesCount) {
        var duplicate = false,
            yCoord = Math.floor(Math.random() * ySize),
            xCoord = Math.floor(Math.random() * xSize),
            newMinedCell = getCellByCoordinates(yCoord, xCoord);
        mineCollection.forEach(function (item) {
            if (item == newMinedCell) duplicate = true;
        });
        if ((newMinedCell == firstCell) || duplicate) continue;
        $(newMinedCell).data("mined", -1);
        mineCollection.push(newMinedCell);
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

function revealCellByClick(cell) {
    if ($(cell).hasClass("flag") || !($(cell).hasClass("unrevealed"))) {
        return 0;
    }
    switch ($(cell).data("mined")) {
        case -1:
            $(cell).addClass("mine").removeClass("unrevealed");
            $(cell).css("background-color", "red");
            showMines();
            alert("You lost =(");
            location.reload();
            break;
        case 0:
            if ($(cell).hasClass("unrevealed")) {
                $(cell).addClass("blank").removeClass("unrevealed");
                revealedCells++;
                revealCellSurrounding(cell);
            }
            break;
        case 1:
            $(cell).addClass("number one").removeClass("unrevealed");
            revealedCells++;
            break;
        case 2:
            $(cell).addClass("number two").removeClass("unrevealed");
            revealedCells++;
            break;
        case 3:
            $(cell).addClass("number three").removeClass("unrevealed");
            revealedCells++;
            break;
        case 4:
            $(cell).addClass("number four").removeClass("unrevealed");
            revealedCells++;
            break;
        case 5:
            $(cell).addClass("number five").removeClass("unrevealed");
            revealedCells++;
            break;
        case 6:
            $(cell).addClass("number six").removeClass("unrevealed");
            revealedCells++;
            break;
        case 7:
            $(cell).addClass("number seven").removeClass("unrevealed");
            revealedCells++;
            break;
        case 8:
            $(cell).addClass("number eight").removeClass("unrevealed");
            revealedCells++;
            break;
        default:
            break;
    }
    if ((xSize * ySize) - revealedCells == minesCount) {
        alert("You won =)");
        location.reload();
    }
}

function revealCellSurrounding(cell) {
    var y = parseInt($(cell).attr("data-y")),
        x = parseInt($(cell).attr("data-x")),
        delta = [-1, 0, 1];
    for (var i = 0; i < delta.length; i++) {
        for (var j = 0; j < delta.length; j++) {
            if (delta[i] == 0 && delta[j] == 0) continue;
            revealCellByClick(getCellByCoordinates(y + delta[i], x + delta[j]));
        }
    }
}

function showMines() {
    minedCells.forEach(function (item) {
        $(item).addClass("mine").removeClass("unrevealed");
    })
}

function toggleFlag(cell) {
    if ($(cell).hasClass("unrevealed")) {
        if ($(cell).hasClass("flag")) {
            $(cell).toggleClass("flag", false);
            flagCount++;
            refreshFlagCount()
        } else {
            $(cell).toggleClass("flag", true);
            flagCount--;
            refreshFlagCount()
        }
    }
}
function refreshFlagCount() {
    $(".mines-counter span").html(flagCount);
}

function checkNumberSurrByDblClick(cell) {
    if ($(cell).hasClass("number")) {
        var y = parseInt($(cell).attr("data-y")),
            x = parseInt($(cell).attr("data-x")),
            flagCount = 0,
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
            if ($(surrounding[n]).hasClass("flag")) {
                flagCount++;
            }
        }
        if (flagCount == $(cell).data("mined")) {
            revealCellSurrounding(cell);
        }
    }
}

function updateTimer() {
    setInterval(function () {
        $(".timer span").html(time++);
    }, 1000);
}
