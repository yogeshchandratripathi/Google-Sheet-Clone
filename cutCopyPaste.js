let ctrlKey = false;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
});

// Selectors for copy, cut, and paste buttons
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

// Loop through all cells and attach click listeners
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

// Storage for the selected cell range
let rangeStorage = [];

// Function to handle selected cells
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        // select cells range work
        if (!ctrlKey) return;

        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI: Highlight the selected cell
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);

    });
}

// Function to reset the UI for selected cells
function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

// Storage for copied data
let copyData = [];

// Event listener for the Copy button
copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            // Deep copy cell properties and add to copyData
            let cellProp = JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

// Event listener for the Cut button
cutBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            // Deep copy cell properties and add to copyData
            let cellPropCopy = JSON.parse(JSON.stringify(sheetDB[i][j]));
            let cellProp = sheetDB[i][j];

            copyRow.push(cellPropCopy);
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // Reset cell properties
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = "16px";
            cellProp.fontFamily = "Times New Roman";
            cellProp.BGColor = "#000000";
            cellProp.alignment = "left";

            // Simulate a click on the cell to update the UI
            cell.click();

        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

// Event listener for the Paste button
pasteBtn.addEventListener("click", (e) => {
    // Paste Cells Data work
    if (rangeStorage.length < 2) return;

    // Calculate the difference in rows and columns between source and destination
    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // Get the address of the active cell
    let address = addressBar.value;
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);

    // Loop through the selected range and paste data into cells
    for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
        for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;

            // Get data from copyData
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            // Update cell properties with copied data
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;
            cellProp.fontColor = data.fontColor;

            // Simulate a click on the cell to update the UI
            cell.click();
        }
    }
});