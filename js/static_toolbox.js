const numbers = {};


function calculate(ID) {
    const input = document.getElementById(`dataInput${ID}`).value;
    // 將數字分開並過濾掉非數字
    numbers[ID] = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (numbers[ID].length === 0) {
        alert("請輸入有效數字");
        return;
    }

    // 總數、總和、平均、最大值、最小值
    const count = numbers[ID].length;
    const sum = numbers[ID].reduce((a,b) => a+b, 0);
    const mean = sum/count;
    const max = Math.max(...numbers[ID]);
    const min = Math.min(...numbers[ID]);

    // 中位數
    const sorted = [...numbers[ID]].sort((a, b) => a-b)
    const median = count%2 === 0 ? 
                (sorted[count/2 -1] + sorted[count/2])/2 : sorted[Math.floor(count/2)];

    // 眾數
    const freqMap = {};
    numbers[ID].forEach(n => freqMap[n] = (freqMap[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freqMap));
    const mode = Object.keys(freqMap).filter(k => freqMap[k] === maxFreq).map(Number);
    const modeDisplay = (mode.length == count) ? "無明顯眾數" : mode.join(", ");

    // 變異數、標準差
    const variance = numbers[ID].reduce((a, b) => a + Math.pow(b-mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    // 清空原資料
    document.getElementById(`count${ID}`).textContent = "";
    document.getElementById(`sum${ID}`).textContent = "";
    document.getElementById(`mean${ID}`).textContent = "";
    document.getElementById(`max${ID}`).textContent = "";
    document.getElementById(`min${ID}`).textContent = "";
    document.getElementById(`median${ID}`).textContent = "";
    document.getElementById(`mode${ID}`).textContent = "";
    document.getElementById(`variance${ID}`).textContent = "";
    document.getElementById(`stdDev${ID}`).textContent = "";
    
    // 匯入統計資料
    document.getElementById(`count${ID}`).textContent += count;
    document.getElementById(`sum${ID}`).textContent += sum;
    document.getElementById(`mean${ID}`).textContent += mean.toFixed(2);
    document.getElementById(`max${ID}`).textContent += max;
    document.getElementById(`min${ID}`).textContent += min;
    document.getElementById(`median${ID}`).textContent += median;
    document.getElementById(`mode${ID}`).textContent += modeDisplay;
    document.getElementById(`variance${ID}`).textContent += variance.toFixed(2);
    document.getElementById(`stdDev${ID}`).textContent += stdDev.toFixed(2);

    drawChart(numbers, ID);
}

if (!window.charts) {
    window.charts = {
        hist: {},
        line: {}
    };
}

function drawChart(numbers, ID) {
    const chartsDiv = document.querySelector('.charts')
    chartsDiv.style.display = 'block';

    // === 直方圖 ===
    const freq = {};
    numbers[ID].forEach(n => freq[n] = (freq[n] || 0) + 1);
    const histLabels = Object.keys(freq).sort((a, b) => a - b);
    const histData = histLabels.map(k => freq[k]);

    // 銷毀舊的圖表
    if (window.charts.hist[ID] instanceof Chart) {
        window.charts.hist[ID].destroy();
    }
    adjustHistogramWidth(numbers);

    const ctx1 = document.getElementById(`histogramChart${ID}`).getContext('2d');
    const maxValue = Math.max(...histData);
    const suggestedMax = maxValue * 1.2;

    window.charts.hist[ID] = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: histLabels,
            datasets: [{
                label: '頻率',
                data: histData,
                backgroundColor: 'lightgray',
                categoryPercentage: 0.6,
                barPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `資料 ${ID}`,
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: suggestedMax
                }
            }
        }
    });

    // === 折線圖：畫 X、Y 資料（只要有一筆就畫） ===

    const xData = numbers["X"] || [];
    const yData = numbers["Y"] || [];

    // 如果兩筆都空，直接跳出不畫
    if (xData.length === 0 && yData.length === 0) return;

    if (window.charts.line["XY"] instanceof Chart) {
        window.charts.line["XY"].destroy();
    }

    const ctx2 = document.getElementById('lineChart').getContext('2d');

    const allValues = [...xData, ...yData];
    const lineMin = Math.min(...allValues);
    const lineMax = Math.max(...allValues);
    const yPadding = (lineMax - lineMin) * 0.1 || 1;
    const suggestedMin = Math.floor(lineMin - yPadding);
    const suggestedMaxLine = Math.ceil(lineMax + yPadding);
    const maxLength = Math.max(xData.length, yData.length);

    const datasets = [];
    if (xData.length > 0) {
        datasets.push({
            label: '資料 X',
            data: xData,
            fill: false,
            borderColor: 'blue',
            tension: 0.1
        });
    }
    if (yData.length > 0) {
        datasets.push({
            label: '資料 Y',
            data: yData,
            fill: false,
            borderColor: 'green',
            tension: 0.1
        });
    }

    window.charts.line["XY"] = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: Array.from({ length: maxLength }, (_, i) => i + 1),
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'X vs Y 折線圖'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: suggestedMin,
                    max: suggestedMaxLine
                }
            }
        }
    });
}


function adjustHistogramWidth(numbers) {
    const hasX = Array.isArray(numbers["X"]) && numbers["X"].length > 0;
    const hasY = Array.isArray(numbers["Y"]) && numbers["Y"].length > 0;

    const containerX = document.querySelector('#histogramChartX').parentElement;
    const containerY = document.querySelector('#histogramChartY').parentElement;

    if (hasX && !hasY) {
        containerX.classList.add('full-width');
        containerY.classList.remove('full-width');
        containerX.style.display = 'block';
        containerY.style.display = 'none';
    } else if (!hasX && hasY) {
        containerY.classList.add('full-width');
        containerX.classList.remove('full-width');
        containerY.style.display = 'block';
        containerX.style.display = 'none';
    } else if (hasX && hasY) {
        containerX.classList.remove('full-width');
        containerY.classList.remove('full-width');
        containerX.style.display = 'block';
        containerY.style.display = 'block';
    } else {
        containerX.style.display = 'none';
        containerY.style.display = 'none';
    }
}


// 新增摺疊功能：點擊標題展開/收合圖表
document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.toggle-chart');

    toggles.forEach(h2 => {
        h2.addEventListener('click', () => {
            const nextSection = h2.nextElementSibling;
            if (!nextSection) return;

            nextSection.classList.toggle('hidden');

            const isHidden = nextSection.classList.contains('hidden');
            h2.textContent = h2.textContent.replace(isHidden ? '▼' : '►', isHidden ? '►' : '▼');

            // 當打開時，強制讓所有圖表重新調整大小
            if (!isHidden) {
                setTimeout(() => {
                    Object.values(window.charts.hist).forEach(chart => chart?.resize());
                    Object.values(window.charts.line).forEach(chart => chart?.resize());
                }, 100); // 等 DOM 展開完畢後再 resize（延遲必要）
            }
        });
    });
});
