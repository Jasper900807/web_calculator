function solve() {
    let input = document.getElementById('polyInput').value;
    input = input.replace(/\s+/g, '').replace(/=0$/, '');
    const resultHTML = document.getElementById('result');

    // 顯示計算中
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
                    resultHTML.innerHTML = `<span >錯誤：無法求解，請輸入有效多項式</span>`;
                } else {
                    // 手動解析實數根
                    const matches = numeric
                      .replace(/[\[\]]/g, '') // 移除中括號
                      .split(',')
                      .map(s => s.trim())
                      .filter(s => !s.includes('i')); // 過濾掉含有 i 的複數

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
                // 過濾掉包含虛數的符號解
                let cleaned = symbolic
                    .replace(/[\[\]]/g, '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => !s.includes('i'));

                if (cleaned.length === 0) {
                    resultHTML.innerHTML = `<span>無實數符號根</span>`;
                } else {
                    resultHTML.innerHTML = `
                        <h3>根（符號解）：</h3>
                        <div class="container">${cleaned.join(', ')}</div>`;
                }
            }
        } catch (err) {
            console.error(err);
            resultHTML.innerHTML = `<span>錯誤：請輸入有效的一元多項式，例如 x^3 - 6x^2 + 11x - 6</span>`;
        }
    }, 100);
}


document.addEventListener('keydown', function (event){
    const key = event.key;
    
    if (key === 'Escape') {
        document.getElementById('result').innerHTML = ''
        document.getElementById('polyInput').value = ''

    }
    
    if (key === 'Enter') {
        solve();
    }
});