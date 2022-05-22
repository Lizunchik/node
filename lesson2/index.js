const EventEmitter = require("events");

const eventEmitter = new EventEmitter();
function getRest(duration) {
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    var days = parseInt(duration / (1000 * 60 * 60 * 24));
    if (!days && !hours && !minutes && !seconds) return false;
    return `Осталось ${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`;
}
eventEmitter.on('timer', (timer, index) => {
    const args = timer.split('-');
    const hour = args[0];
    const day = args[1];
    const month = args[2] - 1;
    const year = args[3];
    const timerDate = new Date(year, month, day, hour);
    
    let currentDate = new Date();
    let timeDiff = timerDate.getTime() - currentDate.getTime();

    if (timeDiff <= 0) {
        console.log(`время таймера №${index} меньше текущего`);
        return;
    }
    const id = setInterval(() => {
        currentDate = new Date();
        timeDiff = timerDate.getTime() - currentDate.getTime();

        const result = getRest(timeDiff);

        if (result) {
            console.log(`Таймер №${index} ${result}`);
        }
        else {
            console.log(`Таймер №${index} закончился`);
            clearInterval(id);
        }
    }, 1000);
});

const timers = process.argv.slice(2);
timers.forEach((timer, index) => {
    eventEmitter.emit('timer', timer, index + 1);
});

