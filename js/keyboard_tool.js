document.addEventListener('keydown', function (event){
    const key = event.key;
    
    if (/^[0-9.]$/.test(key)) {
        append(key);
    }
    
    if (['+','-','*','/','(',')'].includes(key)) {
        append(key);
    }
    
    if (key === '^') {
        append('^');
    }
    
    if (key === 'Backspace') {
        backSpace();
    }
    
    if (key === 'Escape') {
        clearDisplay();
    }
    
    if (key === 'Enter') {
        calculate();
    }
});

const keyMap = {
    '1':'key-1', '2':'key-2', '3':'key-3',
    '4':'key-4', '5':'key-5', '6':'key-6',
    '7':'key-7', '8':'key-8', '9':'key-9',
    '0':'key-0', '+':'key-plus', '-':'key-minus',
    '*':'key-multiply', '/':'key-divide', '.':'key-dot',
    '^':'key-power', 'Backspace':'key-backSpace', 
    'Escape':'key-Escape', 'Enter':'key-enter',
    '(':'key-(', ')':'key-)'
}

// 按鍵變色
document.addEventListener('keydown', function (event) {
    const id = keyMap[event.key];
    const keyElement = id && document.getElementById(id);
    if (keyElement) {
        keyElement.classList.add('hover-effect');
    }
});

document.addEventListener('keyup', function (event) {
    const id = keyMap[event.key];
    // 過濾未定義的按鍵
    const keyElement = id && document.getElementById(id);
    if (keyElement) {
        keyElement.classList.remove('hover-effect');
    }
});