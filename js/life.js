document.addEventListener('DOMContentLoaded', () => {
    // 初始化地图
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2
    });

    // 照片放大功能
    const gallery = document.querySelectorAll('.gallery img');
    gallery.forEach(img => {
        img.addEventListener('click', () => {
            // 创建模态框并显示大图
        });
    });

    // 旅行相册滑动
    const travelAlbum = document.getElementById('travel-album');
    let isDown = false;
    let startX;
    let scrollLeft;

    travelAlbum.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - travelAlbum.offsetLeft;
        scrollLeft = travelAlbum.scrollLeft;
    });

    travelAlbum.addEventListener('mouseleave', () => {
        isDown = false;
    });

    travelAlbum.addEventListener('mouseup', () => {
        isDown = false;
    });

    travelAlbum.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - travelAlbum.offsetLeft;
        const walk = (x - startX) * 3;
        travelAlbum.scrollLeft = scrollLeft - walk;
    });

    // 这里可以添加更多交互功能
});