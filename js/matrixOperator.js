// 創建矩陣，同時盡量保留之前輸出的資料
function createMatrix(matrixContainer, ID) {
// 先讀出舊尺寸
let oldRows = parseInt(document.getElementById(`rows-${ID}`).value);
let oldCols = parseInt(document.getElementById(`cols-${ID}`).value);

// 儲存舊資料
let oldData = [];
for (let i = 0; i < oldRows; i++) {
    let row = [];
    for (let j = 0; j < oldCols; j++) {
        const cell = document.getElementById(`cell${ID}-${i}-${j}`);
        row.push(cell ? parseFloat(cell.value) || 0 : 0);
    }
    oldData.push(row);
}

// 取得新尺寸
const rows = parseInt(document.getElementById(`rows-${ID}`).value);
const cols = parseInt(document.getElementById(`cols-${ID}`).value);
const container = document.getElementById(matrixContainer);

// 建立新矩陣
let table = "<table class='matrix-table'>";
for (let i = 0; i < rows; i++) {
    table += "<tr>";
    for (let j = 0; j < cols; j++) {
        let value = (oldData[i] && oldData[i][j] !== undefined) ? oldData[i][j] : 0;
        table += `<td><input type="number" class="matrix-input" id="cell${ID}-${i}-${j}" value="${value}"/></td>`;
    }
    table += "</tr>";
}
table += "</table>";
container.innerHTML = table;

// 清空輸出
document.getElementById("matrix-output").innerHTML = "";
}

// 顯示矩陣
function displayMatrix(matrix, op){
    let resultHtml = `<math>`;

    // 獲取矩陣A和B
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');

    resultHtml += `<mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrixA.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrixA[i].length; j++) {
            resultHtml += `<mtd>${matrixA[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo>`;

    resultHtml += `<mo>${op}</mo>`
    
    resultHtml += `<mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrixB.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrixB[i].length; j++) {
            resultHtml += `<mtd>${matrixB[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo>`;

    resultHtml += `<mo>=</mo>`

    resultHtml += `<mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo>`;

    resultHtml += `</math>`
    document.getElementById("matrix-output").innerHTML = resultHtml;
}

// 獲取矩陣數據
function getMatrix(ID) {
    const rows = parseInt(document.getElementById(`rows-${ID}`).value);
    const cols = parseInt(document.getElementById(`cols-${ID}`).value);
    let matrix = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`cell${ID}-${i}-${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

// A和B矩陣互換
function swapMatrices() {

    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');
    // 交換矩陣A和B的容器內容
    createMatrix(`matrixContainerA`, `B`);
    createMatrix(`matrixContainerB`, `A`);
    let tempRows = document.getElementById(`rows-A`).value;
    let tempCols = document.getElementById(`cols-A`).value;
    document.getElementById(`rows-A`).value = document.getElementById(`rows-B`).value;
    document.getElementById(`cols-A`).value = document.getElementById(`cols-B`).value;
    document.getElementById(`rows-B`).value = tempRows;
    document.getElementById(`cols-B`).value = tempCols;
    // 將B矩陣放入A
    let tableA = "<table class='matrix-table'>";
    for (let i = 0; i < matrixB.length; i++) {
        tableA += "<tr>";
        for (let j = 0; j < matrixB[i].length; j++) {
            tableA += `<td><input type="number" class="matrix-input" id="cellA-${i}-${j}" value="${matrixB[i][j]}" /></td>`;
        }
        tableA += "</tr>";
    }
    tableA += "</table>";
    document.getElementById("matrixContainerA").innerHTML = tableA;
    // 將A矩陣放入B
    let tableB = "<table class='matrix-table'>";
    for (let i = 0; i < matrixA.length; i++) {
        tableB += "<tr>";
        for (let j = 0; j < matrixA[i].length; j++) {
            tableB += `<td><input type="number" class="matrix-input" id="cellB-${i}-${j}" value="${matrixA[i][j]}" /></td>`;
        }
        tableB += "</tr>";
    }
    tableB += "</table>";
    document.getElementById("matrixContainerB").innerHTML = tableB;
}

// A和B矩陣相加
function addMatrice() {
    // 獲取矩陣A和B
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');

    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        alert("矩陣維度不匹配，無法相加！");
        return;
    }

    const result = math.add(matrixA, matrixB);
    displayMatrix(result, "+");
}

// A和B矩陣相減
function subtractMatrices() {
    // 獲取矩陣A和B
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');

    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        alert("矩陣維度不匹配，無法相減！");
        return;
    }

    const result = math.subtract(matrixA, matrixB);
    displayMatrix(result, "-");
}

// A和B矩陣相乘
function multiplyMatrices() {
    // 獲取矩陣A和B
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');

    if (matrixA[0].length !== matrixB.length) {
        // console.log(matrixA.length[0], )matrixB.le
        alert("矩陣維度不匹配，無法相乘！");
        return;
    }

    const result = math.multiply(matrixA, matrixB);
    displayMatrix(result, "×")
}

