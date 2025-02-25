let i = 0;
const t = 100;
let boxes = [];
let lock = null;
let timer = null;
let started = false;

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
        box.onclick = e => update(i);
        boxes.push(box);
        container.appendChild(box);
    }
};

document.querySelector('#shuffle').onclick = e => {
    let { numbers } = get('numbers', {numbers: []});
    numbers = shuffle(numbers);
    document.querySelector('.container').innerHTML = '';
    i = 0;
    display(numbers);
    set('numbers', {numbers});
};

const clearTimer = e => {
    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }
};

const speak = (num, box) => {
    const utter = new SpeechSynthesisUtterance(num);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
    box.classList.add('shake');
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    utter.onend = () => box.classList.remove('shake');
};

const play = e => {
    let { total } = get('total', {total: t});
    let { numbers } = get('numbers', {numbers: []});
    speak(numbers[i], boxes[i]);
    i = i < total - 1 ? ++i : 0;
    timer = setTimeout(play, 2500);
};

const start = e => {
    play();
    requestLock();
};

const stop = e => {
    clearTimer();
    releaseLock();
};

const update = n => {
    stop();
    i = n;
    start();
};

const control = e => {
    started = !started;
    if (started === true) {
        start();
        document.querySelector('#control').textContent = 'Stop';
    } else {
        stop();
        document.querySelector('#control').textContent = 'Start';
    }
};

const requestLock = async e => lock = await navigator.wakeLock.request('screen');

const releaseLock = e => {
    if (lock !== null) {
        lock.release();
        lock = null;
    }
};

document.addEventListener('visibilitychange', e => {
    if (document.visibilityState === 'hidden') {
        stop();
    } else {
        start();
    }
});

document.querySelector('#control').addEventListener('click', control);

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