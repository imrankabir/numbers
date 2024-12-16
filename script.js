const container = document.querySelector('.container');

const get = (k, d) => JSON.parse(localStorage.getItem(`numbers-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`numbers-${k}`, JSON.stringify(v));

const speak = n => {
    const utter = new SpeechSynthesisUtterance(n);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
};

const shuffle = numbers => {
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
};

const display = numbers => {
    for (const i of numbers) {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = i;
        box.onclick = e => speak(i);
        container.appendChild(box);
    }
};

document.querySelector('#shuffle').addEventListener('click', e => {
    let { numbers } = get('numbers', {numbers: []});
    numbers = shuffle(numbers);
    container.innerHTML = '';
    display(numbers);
    set('numbers', {numbers});
});

document.addEventListener('DOMContentLoaded', e => {
    let { numbers } = get('numbers', {numbers: []});

    if (numbers.length === 0) {
        for (let i = 1; i <= 100; i++) {
            numbers.push(i);
        }
        numbers = shuffle(numbers);
        set('numbers', {numbers});
    }

    display(numbers);
});