$(document).ready(function () {
    init(16, 16, 40);
});

function Minesweeper(xSize, ySize, minesCount) {
    this.xSize = typeof xSize !== "undefined" ? xSize : 16;
    this.ySize = typeof ySize !== "undefined" ? ySize : 16;
    this.minesCount = typeof minesCount !== "undefined" ? minesCount : 40;
    this.flagCount = minesCount;
    this.revealedCells = 0;
    this.timer = {};
    this.time = 0;
    this.minedCells = [];
}

function init(xSize, ySize, minesCount) {
    ms = new Minesweeper(xSize, ySize, minesCount);
    generateBoard(ms.xSize, ms.ySize);
    refreshFlagCount();
}

function renderBoard() {
    ms.minedCells = seedMines(ms.xSize, ms.ySize, ms.minesCount, this);
    renderNumbers();
    updateTimer();
    $(".cell").unbind("click", renderBoard);
}

function generateBoard(xSize, ySize) {
    var board = document.createElement("div");
    $(board).addClass("board");
    $(board).css( "width", xSize * 20);
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
            overlay("lose");
            break;
        case 0:
            if ($(cell).hasClass("unrevealed")) {
                $(cell).addClass("blank").removeClass("unrevealed");
                ms.revealedCells++;
                revealCellSurrounding(cell);
            }
            break;
        case 1:
            $(cell).addClass("number one").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 2:
            $(cell).addClass("number two").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 3:
            $(cell).addClass("number three").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 4:
            $(cell).addClass("number four").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 5:
            $(cell).addClass("number five").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 6:
            $(cell).addClass("number six").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 7:
            $(cell).addClass("number seven").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        case 8:
            $(cell).addClass("number eight").removeClass("unrevealed");
            ms.revealedCells++;
            break;
        default:
            break;
    }
    if ((ms.xSize * ms.ySize) - ms.revealedCells == ms.minesCount) {
        overlay("win");
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
    ms.minedCells.forEach(function (item) {
        $(item).addClass("mine").removeClass("unrevealed");
    })
}

function toggleFlag(cell) {
    if ($(cell).hasClass("unrevealed")) {
        if ($(cell).hasClass("flag")) {
            $(cell).toggleClass("flag", false);
            ms.flagCount++;
            refreshFlagCount()
        } else {
            $(cell).toggleClass("flag", true);
            ms.flagCount--;
            refreshFlagCount()
        }
    }
}
function refreshFlagCount() {
    $(".mines-counter span").html(ms.flagCount);
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
        else{
            surrounding.forEach(function(item){
                if ($(item).hasClass("unrevealed")){
                    $(item).fadeToggle("fast").fadeToggle("fast").
                        fadeToggle("fast").fadeToggle("fast");
                }
            });
        }
    }
}

function updateTimer() {
    ms.timer = setInterval(function () {
        $(".timer span").html(ms.time++);
    }, 1000);
}

function stopTimer() {
    clearInterval(ms.timer);
}

function clearTimer() {
    $(".timer span").html("0");
}

function selectHandler(){
        var value = $("select option:selected").text(),
            rows = $("input[name = 'rows']"),
            cols = $("input[name = 'cols']"),
            mines = $("input[name = 'mines']");

        switch (value){
            case "Beginner":
                rows.val(9).attr("disabled", true);
                cols.val(9).attr("disabled", true);
                mines.val(10).attr("disabled", true);
                break;
            case "Intermediate":
                rows.val(16).attr("disabled", true);
                cols.val(16).attr("disabled", true);
                mines.val(40).attr("disabled", true);
                break;
            case "Advanced":
                rows.val(30).attr("disabled", true);
                cols.val(16).attr("disabled", true);
                mines.val(99).attr("disabled", true);
                break;
            case "Custom":
                rows.attr("disabled", false);
                cols.attr("disabled", false);
                mines.attr("disabled", false);
                break;
        }
}

function startNewGame() {
    $(".board").remove();
    stopTimer();
    clearTimer();
    ms = {};
    var rowsNumber = parseInt($("input[name = 'rows']").val()),
        colsNumber = parseInt($("input[name = 'cols']").val()),
        minesNumber = parseInt($("input[name = 'mines']").val());
    init(rowsNumber, colsNumber, minesNumber);
}

function overlay(state) {
    $(".cell").off();
    stopTimer();
    if (state == "lose"){
        $(".massage-overlay h1").html("Game over!");
        $(".massage-overlay h2").html("You lost");
    }
    if (state == "win"){
        $(".massage-overlay h1").html("Congratulations!");
        $(".massage-overlay h2").html("You win with time: " + ms.time);
    }
    var overlay = $(".massage-overlay");
    overlay.click(function(e) {
        var clicked = $(e.target);
        if (clicked.is('.massage')) {
        } else {
            $('.massage-overlay').fadeOut("fast");
        }
    });
    overlay.fadeIn("fast");
}
