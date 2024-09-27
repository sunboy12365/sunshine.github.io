document.addEventListener('DOMContentLoaded', () => {
    const life = document.getElementById('life');
    const work = document.getElementById('work');

    life.addEventListener('click', () => {
        window.location.href = 'life.html';
    });

    work.addEventListener('click', () => {
        window.location.href = 'work.html';
    });
});