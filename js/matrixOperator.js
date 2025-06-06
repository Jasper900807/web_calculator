// 創建矩陣，同時盡量保留之前輸出的資料
function createMatrix(matrixContainer, ID) {
    console.log("create", matrixContainer, ID);
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
    // document.getElementById("matrix-output").innerHTML = "";
}

// 顯示矩陣
function displayMatrix(result, op){
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
    for (let i=0; i<result.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<result[i].length; j++) {
            resultHtml += `<mtd>${result[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo>`;
    resultHtml += `</math>`

    resultHtml += insertButton(result); 
    resultHtml += `<hr>`;
    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 新增匯入按鈕
function insertButton(result) {
    let newHtml = ` <span class="d-flex justify-content-end">
                        <button onclick='insertMatrix(${JSON.stringify(result)}, "A")' class="resultButton">匯入到A</button>
                        <button onclick='insertMatrix(${JSON.stringify(result)}, "B")' class="resultButton">匯入到B</button>
                    </span>`;
    return newHtml;
}

// 匯入矩陣
function insertMatrix(matrix, ID) {
    console.log("start", matrix, ID);
    createMatrix(`matrixContainer${ID}`, ID);
    document.getElementById(`rows-${ID}`).value = matrix.length;
    document.getElementById(`cols-${ID}`).value = matrix[0].length;

    let table = "<table class='matrix-table'>";
    for (let i = 0; i < matrix.length; i++) {
        table += "<tr>";
        for (let j = 0; j < matrix[i].length; j++) {
            table += `<td><input type="number" class="matrix-input" id="cell${ID}-${i}-${j}" value="${matrix[i][j]}" /></td>`;
        }
        table += "</tr>";
    }
    table += "</table>";
    document.getElementById(`matrixContainer${ID}`).innerHTML = table;
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
        alert("矩陣維度不匹配，無法相乘！");
        return;
    }

    const result = math.multiply(matrixA, matrixB);
    displayMatrix(result, "×")
}

// 行列式
function detMatrix(ID) {
    const matrix = getMatrix(ID);
    const result = math.det(matrix);
    let resultHtml = `<math>`

    resultHtml += `<mrow><mo>|</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>|</mo></mrow>`;

    resultHtml += `<mo>=</mo>`
    resultHtml += `<mtext>${result}</mtext><hr>`

    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 逆矩陣
function invMatrix(ID) {
    const matrix = getMatrix(ID);
    if (math.det(matrix) == 0){
        alert("行列式為零，不存在逆矩陣！")
        return;
    }

    const result = math.inv(matrix);

    let resultHtml = `<math>`
    // 原矩陣
    resultHtml += `<msup><mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow><mn>-1</mn></msup>`;

    resultHtml += `<mo>=</mo>`
    // 結果矩陣
    resultHtml += `<mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<result.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<result[i].length; j++) {
            resultHtml += `<mtd>${result[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;

    resultHtml += `</math>`

    resultHtml += insertButton(result);
    resultHtml +=`<hr>`

    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 轉置矩陣
function transposeMatrix(ID) {
    const matrix = getMatrix(ID);
    const result = math.transpose(matrix);

    let resultHtml = `<math>`
    // 原矩陣
    resultHtml += `<msup><mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow><mn>T</mn></msup>`;

    resultHtml += `<mo>=</mo>`
    // 結果矩陣
    resultHtml += `<mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<result.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<result[i].length; j++) {
            resultHtml += `<mtd>${result[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;

    resultHtml += `</math>`

    resultHtml += insertButton(result);
    resultHtml +=`<hr>`

    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 乘自己
function multiplySelf(ID) {
    // 獲取矩陣A和B
    const matrix = getMatrix(ID);
    const value = document.getElementById(`multiplyValue${ID}`).value;

    const result = math.multiply(value, matrix);


    //將結果輸出
    let resultHtml = `<math>`
    // 原矩陣
    resultHtml += `<mrow><mo>${value}×</mo><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;

    resultHtml += `<mo>=</mo>`
    // 結果矩陣
    resultHtml += `<mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<result.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<result[i].length; j++) {
            resultHtml += `<mtd>${result[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;

    resultHtml += `</math>`

    resultHtml += insertButton(result);
    resultHtml +=`<hr>`
    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 幂法(power)
function powMatrix(ID) {
    const matrix = getMatrix(ID);
    const value = document.getElementById(`powValue${ID}`).value;

    if (matrix.length !== matrix[0].length) {
        alert("矩陣不是方陣，無法進行幂法！");
        return;
    }

    const result = math.pow(matrix, value);

    //將結果輸出
    let resultHtml = `<math>`
    // 原矩陣
    resultHtml += `<msup><mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow><mn>${value}</mn></msup>`;

    resultHtml += `<mo>=</mo>`
    // 結果矩陣
    resultHtml += `<mrow><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<result.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<result[i].length; j++) {
            resultHtml += `<mtd>${result[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;

    resultHtml += `</math>`

    resultHtml += insertButton(result);
    resultHtml +=`<hr>`
    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// 取得特徵值&特徵向量 *施工中
function eigenMatrix(ID) {
    const matrix = getMatrix(ID);
    const eigen = numeric.eig(matrix)

    console.log(eigen.lambda.x)
    console.log(eigen.E.x)

    let resultHtml = `<math>`
    // 原矩陣
    resultHtml += `<mrow><mi>${ID}</mi><mo>=</mo><mo>(</mo><mtable class='matrix-table'>`
    for (let i=0; i<matrix.length; i++) {
        resultHtml += "<mtr>";
        for (let j=0; j<matrix[i].length; j++) {
            resultHtml += `<mtd>${matrix[i][j]}</mtd>`;
        }
        resultHtml += "</mtr>";
    }
    resultHtml += `</mtable><mo>)</mo></mrow>`;



    resultHtml += `</math><hr>`

    document.getElementById("matrix-output").innerHTML = resultHtml + document.getElementById("matrix-output").innerHTML;
}

// LU分解 *施工中
function luDecomposition(ID) {
    const matrix = getMatrix(ID);
    const len = matrix.length;

}

// 對角矩陣 *施工中


