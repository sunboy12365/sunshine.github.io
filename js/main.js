document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('#background-video video');
    const backgroundVideo = document.getElementById('background-video');
    const backgroundImage = document.getElementById('background-image');

    video.addEventListener('canplaythrough', function() {
        backgroundVideo.style.display = 'block';
        backgroundImage.style.display = 'none';
    });

    video.addEventListener('error', function() {
        console.error('视频加载失败');
        backgroundImage.style.display = 'block';
    });
});