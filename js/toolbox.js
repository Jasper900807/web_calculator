function append(value) {
    document.getElementById("display").value += value;
}

function backSpace() {
    document.getElementById("display").value = document.getElementById("display").value.slice(0,-1);
}

function clearDisplay() {
    document.getElementById("display").value = "";
    document.getElementById("result").value = "";
}

function calculate() {
    try {
        document.getElementById("result").value =
        // eval()用於計算字串內之數字
            "=" + math.evaluate(document.getElementById("display").value);
    } catch {
        document.getElementById("result").value = "Error"
    }
}