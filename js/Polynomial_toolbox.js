// 簡化得到的根
function combineSqrtProducts(expr) {
    // 找到兩個根號相乘的情況，將它們的數值相乘並合併為一個根號
    return expr.replace(/(\d+)\^\(1\/2\)\*(\d+)\^\(1\/2\)/g, (_, a, b) => {
        return `${parseInt(a) * parseInt(b)}^(1/2)`;
    });
}

// 將包含 √、乘號、次方等的表達式轉換為 LaTeX 格式，供 MathJax 顯示用
function toLatex(expr) {
    return expr
        .replace(/(\d+)\^\(1\/2\)/g, '\\sqrt{$1}')      // 5^(1/2) → \sqrt{5}
        .replace(/([a-zA-Z0-9\)\]])\^([a-zA-Z0-9\+\-\*/\(\)]+)/g, '$1^{ $2 }')
        .replace(/\*\s*([a-zA-Z0-9])/g, ' \\cdot $1');
}

function solve() {
    let input = document.getElementById('polyInput').value;
    input = input.replace(/\s+/g, '').replace(/=0$/, '');
    const resultHTML = document.getElementById('result');

    resultHTML.innerHTML = `
    <div class="d-flex align-items-center gap-2">
        <strong>計算中</strong>
        <div class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></div>
    </div>
    `;

    setTimeout(() => {
        try {
            let symbolic = Algebrite.run(`roots(${input})`);

            if (symbolic.includes('Stop:') || symbolic.includes('Error:')) {
                let numeric = Algebrite.run(`nroots(${input})`);
                if (numeric.includes('Stop:') || numeric.includes('Error:')) {
                    resultHTML.innerHTML = `<span>錯誤：無法求解，請輸入有效多項式</span>`;
                } else {
                    const matches = numeric
                        .replace(/[\[\]]/g, '')
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => !s.includes('i'));

                    const realRoots = matches.map(s => Number(parseFloat(s).toFixed(3)));

                    if (realRoots.length === 0) {
                        resultHTML.innerHTML = `<span>無實數根</span>`;
                    } else {
                        resultHTML.innerHTML = `
                          <h3>根（數值解）：</h3>
                          <div class="container">${realRoots.join(', ')}</div>`;
                    }
                }
            } else {
                let cleaned = symbolic
                    .replace(/[\[\]]/g, '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(expr => {
                        try {
                            let imagValue = parseFloat(Algebrite.run(`float(imag(rectform(${expr})))`));
                            return Math.abs(imagValue) < 1e-10;
                        } catch {
                            return false;
                        }
                    })
                    .map(expr => {
                        const simplified = Algebrite.simplify(expr).toString();
                        const latex = toLatex(combineSqrtProducts(simplified));
                        return `\\(${latex}\\)`;
                    });

                if (cleaned.length === 0) {
                    resultHTML.innerHTML = `<span>無實數符號根</span>`;
                } else {
                    resultHTML.innerHTML = `
                        <h3>根（符號解）：</h3>
                        <div class="container">${cleaned.join('<br>')}</div>`;
                    MathJax.typeset();
                }
            }
        } catch (err) {
            console.error(err);
            resultHTML.innerHTML = `<span>錯誤：請輸入有效的一元多項式，例如 x^3 - 6x^2 + 11x - 6</span>`;
        }
    }, 100);
}

document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (key === 'Escape') {
        document.getElementById('result').innerHTML = '';
        document.getElementById('polyInput').value = '';
    }

    if (key === 'Enter') {
        solve();
    }
});
