var startCount = function() {
    return setTimeout(function () {
        window.location.href = 'http://marisakaupert.com/muttboard.html';
    }, 60000000);
}

startCount();

window.addEventListener('click', function () {
    clearTimeout(startCount);
    startCount();
});
