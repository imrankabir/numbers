let i = 0;
const t = 100;
let boxes = [];
let timer = null;

const get = (k, d) => JSON.parse(localStorage.getItem(`numbers-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`numbers-${k}`, JSON.stringify(v));

const shuffle = numbers => {
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
};

const display = numbers => {
    boxes = [];
    const container = document.querySelector('.container');
    for (const i in numbers) {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = numbers[i];
        box.onclick = e => start(i);
        boxes.push(box);
        container.appendChild(box);
    }
};

const speak = (n, e) => {
    const utter = new SpeechSynthesisUtterance(n);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
    e.classList.add('shake');
    utter.onend = () => e.classList.remove('shake');
};

const start = n => {
    i = n;
    clearTimeout(timer);
    play();
};

const play = e => {
    let { total } = get('total', {total: t});
    let { numbers } = get('numbers', {numbers: []});
    speak(numbers[i], boxes[i]);
    i = i < total - 1 ? ++i : 0;
    setTimeout(play, 2500);
};

document.querySelector('#shuffle').onclick = e => {
    let { numbers } = get('numbers', {numbers: []});
    numbers = shuffle(numbers);
    document.querySelector('.container').innerHTML = '';
    i = 0;
    display(numbers);
    set('numbers', {numbers});
};

document.addEventListener('DOMContentLoaded', e => {
    let { numbers } = get('numbers', {numbers: []});
    let { total } = get('total', {total: t});
    if (numbers.length === 0) {
        for (let i = 1; i <= total; i++) {
            numbers.push(i);
        }
        numbers = shuffle(numbers);
        set('numbers', {numbers});
        set('total', {total});
    }
    display(numbers);
});