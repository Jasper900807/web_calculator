// 切換黑暗模式
const themeToggle = document.getElementById('themeToggle');

if (localStorage.getItem('bsTheme') === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    themeToggle.checked = true;
}
else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
}

themeToggle.addEventListener('change', function (){
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('bsTheme', newTheme);
});