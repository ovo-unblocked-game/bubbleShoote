var startCount = function() {
    return setTimeout(function () {
        window.location.href = '#';
    }, 60000000);
}

startCount();

window.addEventListener('click', function () {
    clearTimeout(startCount);
    startCount();
});
