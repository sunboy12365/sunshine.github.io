document.addEventListener('DOMContentLoaded', function() {
    const languageSelects = document.querySelectorAll('.language-select');
    const languageTitle = document.getElementById('language-title');
    const pythonContent = document.getElementById('python-content');
    const cppContent = document.getElementById('cpp-content');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    let currentLanguage = 'python';
    let searchResults = [];
    let currentResultIndex = -1;

    languageSelects.forEach(select => {
        select.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            if (window.innerWidth <= 768) {
                closeSidebar();
                sidebarLocked = false;
            }
        });
    });

    function switchLanguage(lang) {
        currentLanguage = lang;
        if (lang === 'python') {
            languageTitle.textContent = 'Python 学习笔记';
            pythonContent.style.display = 'block';
            cppContent.style.display = 'none';
        } else if (lang === 'cpp') {
            languageTitle.textContent = 'C++ 学习笔记';
            pythonContent.style.display = 'none';
            cppContent.style.display = 'block';
        }
        clearSearch();
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === '') {
            alert('请输入搜索关键词');
            return;
        }

        const content = currentLanguage === 'python' ? pythonContent : cppContent;
        searchResults = [];
        currentResultIndex = -1;

        const textNodes = getTextNodes(content);
        textNodes.forEach(node => {
            const text = node.textContent.toLowerCase();
            let index = text.indexOf(searchTerm);
            while (index !== -1) {
                searchResults.push({ node, index });
                index = text.indexOf(searchTerm, index + 1);
            }
        });

        if (searchResults.length === 0) {
            alert('未找到相关内容');
        } else {
            createSearchNavigation();
            highlightNext();
        }
    }

    function getTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                textNodes = textNodes.concat(getTextNodes(children[i]));
            }
        }
        return textNodes;
    }

    function highlightText(node, term, start) {
        const text = node.textContent;
        const before = text.slice(0, start);
        const match = text.slice(start, start + term.length);
        const after = text.slice(start + term.length);
        const highlightedNode = document.createElement('span');
        highlightedNode.innerHTML = `${before}<mark class="current-highlight">${match}</mark>${after}`;
        node.parentNode.replaceChild(highlightedNode, node);
    }

    function createSearchNavigation() {
        let navContainer = document.getElementById('search-navigation');
        if (!navContainer) {
            navContainer = document.createElement('div');
            navContainer.id = 'search-navigation';
            navContainer.innerHTML = `
                <span id="search-count"></span>
                <button id="prev-result">上一个</button>
                <button id="next-result">下一个</button>
                <button id="exit-search">退出搜索</button>
            `;
            document.querySelector('.search-container').appendChild(navContainer);

            document.getElementById('prev-result').addEventListener('click', highlightPrevious);
            document.getElementById('next-result').addEventListener('click', highlightNext);
            document.getElementById('exit-search').addEventListener('click', clearSearch);
        }
        updateSearchCount();
    }

    function updateSearchCount() {
        const countElement = document.getElementById('search-count');
        if (searchResults.length > 0) {
            countElement.textContent = `${currentResultIndex + 1} / ${searchResults.length}`;
        } else {
            countElement.textContent = '0 / 0';
        }
    }

    function highlightNext() {
        if (searchResults.length === 0) return;
        clearCurrentHighlight();
        currentResultIndex = (currentResultIndex + 1) % searchResults.length;
        highlightCurrent();
    }

    function highlightPrevious() {
        if (searchResults.length === 0) return;
        clearCurrentHighlight();
        currentResultIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
        highlightCurrent();
    }

    function highlightCurrent() {
        const result = searchResults[currentResultIndex];
        highlightText(result.node, searchInput.value.trim(), result.index);
        scrollToHighlight();
        updateSearchCount();
    }

    function clearCurrentHighlight() {
        const currentHighlight = document.querySelector('.current-highlight');
        if (currentHighlight) {
            const parent = currentHighlight.parentNode;
            parent.replaceWith(document.createTextNode(parent.textContent));
        }
    }

    function scrollToHighlight() {
        const highlight = document.querySelector('.current-highlight');
        if (highlight) {
            highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function clearSearch() {
        const content = currentLanguage === 'python' ? pythonContent : cppContent;
        content.innerHTML = content.innerHTML.replace(/<mark class="current-highlight">(.*?)<\/mark>/g, '$1');
        
        const navContainer = document.getElementById('search-navigation');
        if (navContainer) {
            navContainer.remove();
        }

        searchInput.value = '';
        searchResults = [];
        currentResultIndex = -1;
    }

    // 添加侧边栏切换功能
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const main = document.querySelector('main');
    let sidebarLocked = false;

    function openSidebar() {
        sidebar.classList.add('active');
        main.classList.add('sidebar-active');
        sidebarToggle.style.left = '220px';
    }

    function closeSidebar() {
        if (!sidebarLocked) {
            sidebar.classList.remove('active');
            main.classList.remove('sidebar-active');
            sidebarToggle.style.left = '20px';
        }
    }

    sidebarToggle.addEventListener('click', function() {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
            sidebarLocked = false;
        } else {
            openSidebar();
            sidebarLocked = true;
        }
    });

    sidebar.addEventListener('mouseenter', openSidebar);
    sidebar.addEventListener('mouseleave', closeSidebar);

    main.addEventListener('click', function(e) {
        if (e.target !== sidebarToggle && sidebar.classList.contains('active')) {
            closeSidebar();
            sidebarLocked = false;
        }
    });

    // 语言选择功能
    languageSelects.forEach(select => {
        select.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            if (window.innerWidth <= 768) {
                closeSidebar();
                sidebarLocked = false;
            }
        });
    });

    // 其他功能保持不变
});