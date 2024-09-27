
document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏触摸滑动功能
    const sidebar = document.querySelector('.sidebar');
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 100; // 添加滑动阈值

    // 触摸开始事件
    sidebar.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    // 触摸结束事件
    sidebar.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    // 处理滑动
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
            if (swipeDistance < 0) {
                sidebar.style.left = '-180px'; // 向左滑动，收起侧边栏
            } else {
                sidebar.style.left = '0px'; // 向右滑动，展开侧边栏
            }
        }
    }

    // 搜索相关变量
    let currentSearchIndex = -1;
    let searchResults = [];
    let searchTerm = '';

    // 搜索功能
    function searchNotes() {
        searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const searchableElements = document.querySelectorAll('.code-note, .question-link');
        
        // 如果搜索词为空，显示所有内容并退出函数
        if (searchTerm === '') {
            searchableElements.forEach(element => {
                element.style.display = 'block';
                removeHighlight(element);
            });
            document.getElementById('searchNavigation').style.display = 'none';
            return;
        }
        
        searchResults = [];
        currentSearchIndex = -1;

        searchableElements.forEach((element) => {
            const text = element.innerHTML.toLowerCase();
            if (text.includes(searchTerm)) {
                searchResults.push(element);
                element.style.display = 'block';
                highlightSearchTerm(element, searchTerm);
            } else {
                element.style.display = 'none';
            }
        });

        updateSearchNavigation();
    }

    // 高亮搜索词
    function highlightSearchTerm(element, term) {
        const regex = new RegExp(term, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    // 移除高亮
    function removeHighlight(element) {
        element.innerHTML = element.innerHTML.replace(/<span class="highlight">|<\/span>/gi, '');
    }

    // 更新搜索导航
    function updateSearchNavigation() {
        const searchNav = document.getElementById('searchNavigation');
        const resultCount = document.getElementById('searchResultCount');
        const currentIndex = document.getElementById('currentResultIndex');

        if (searchResults.length > 0) {
            searchNav.style.display = 'flex';
            resultCount.textContent = `找到 ${searchResults.length} 个结果`;
            navigateSearch('next'); // 自动跳转到第一个结果
        } else {
            searchNav.style.display = 'none';
            alert('未找到匹配的结果');
        }
    }

    // 导航搜索结果
    function navigateSearch(direction) {
        if (searchResults.length === 0) return;

        if (direction === 'next') {
            currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
        } else {
            currentSearchIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        }

        const targetElement = searchResults[currentSearchIndex];
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightCurrentResult();
        updateCurrentIndex();
    }

    // 高亮当前搜索结果
    function highlightCurrentResult() {
        searchResults.forEach((element, index) => {
            element.style.border = index === currentSearchIndex 
                ? '2px solid #3498db' 
                : '1px solid #e9ecef';
        });
    }

    // 更新当前结果索引显示
    function updateCurrentIndex() {
        const currentIndex = document.getElementById('currentResultIndex');
        currentIndex.textContent = `${currentSearchIndex + 1} / ${searchResults.length}`;
    }

    // 关闭搜索
    function closeSearch() {
        document.getElementById('searchNavigation').style.display = 'none';
        const searchableElements = document.querySelectorAll('.code-note, .question-link');
        searchableElements.forEach(element => {
            element.style.display = 'block';
            element.style.border = '1px solid #e9ecef';
            removeHighlight(element);
        });
        document.getElementById('searchInput').value = '';
    }

    // 绑定事件监听器
    document.querySelector('button').addEventListener('click', searchNotes);

    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchNotes();
        }
    });

    document.getElementById('prevResult').addEventListener('click', () => navigateSearch('prev'));
    document.getElementById('nextResult').addEventListener('click', () => navigateSearch('next'));
    document.getElementById('closeSearch').addEventListener('click', closeSearch);

    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // 题库展开/收起功能
    const levelItems = document.querySelectorAll('.level-item');
    let expandedByClick = new Set();

    levelItems.forEach(item => {
        const title = item.querySelector('.level-title');
        
        title.addEventListener('click', () => {
            item.classList.toggle('expanded');
            if (item.classList.contains('expanded')) {
                expandedByClick.add(item);
            } else {
                expandedByClick.delete(item);
            }
        });

        item.addEventListener('mouseenter', () => {
            if (!expandedByClick.has(item)) {
                item.classList.add('expanded');
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!expandedByClick.has(item)) {
                item.classList.remove('expanded');
            }
        });
    });
});
