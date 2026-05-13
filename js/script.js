// Portfolio Interactive Features
// Made with Bob

// Update time in menu bar
function updateTime() {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

// Initialize time and update every minute
updateTime();
setInterval(updateTime, 60000);

// Window Management
const windows = document.querySelectorAll('.window');
let activeWindow = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Make windows draggable
windows.forEach(window => {
    const header = window.querySelector('.window-header');
    
    header.addEventListener('mousedown', dragStart);
    
    // Bring window to front on click
    window.addEventListener('mousedown', () => {
        bringToFront(window);
    });
});

function dragStart(e) {
    if (e.target.classList.contains('control')) return;
    
    const window = e.target.closest('.window');
    if (window.classList.contains('maximized')) return;
    
    activeWindow = window;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    const transform = window.style.transform;
    if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        xOffset = matrix.m41;
        yOffset = matrix.m42;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    } else {
        const rect = window.getBoundingClientRect();
        xOffset = rect.left - window.offsetLeft;
        yOffset = rect.top - window.offsetTop;
    }
    
    isDragging = true;
}

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function drag(e) {
    if (isDragging && activeWindow) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        
        setTranslate(currentX, currentY, activeWindow);
    }
}

function dragEnd() {
    if (isDragging && activeWindow) {
        const rect = activeWindow.getBoundingClientRect();
        activeWindow.style.left = rect.left + 'px';
        activeWindow.style.top = rect.top + 'px';
        activeWindow.style.transform = 'none';
    }
    
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

function bringToFront(window) {
    windows.forEach(w => w.style.zIndex = '10');
    window.style.zIndex = '100';
}

// Window Controls
document.querySelectorAll('.control').forEach(control => {
    control.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = control.dataset.action;
        const window = control.closest('.window');
        
        switch(action) {
            case 'close':
                closeWindow(window);
                break;
            case 'minimize':
                minimizeWindow(window);
                break;
            case 'maximize':
                maximizeWindow(window);
                break;
        }
    });
});

function closeWindow(window) {
    window.style.display = 'none';
}

function minimizeWindow(window) {
    window.classList.add('minimized');
    setTimeout(() => {
        window.style.display = 'none';
    }, 300);
}

function maximizeWindow(window) {
    if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
    } else {
        window.classList.add('maximized');
    }
}

// Dock Functionality
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
        const windowId = item.dataset.window + '-window';
        const window = document.getElementById(windowId);
        
        if (window) {
            if (window.style.display === 'none' || window.classList.contains('minimized')) {
                window.style.display = 'block';
                window.classList.remove('minimized');
                bringToFront(window);
            } else {
                bringToFront(window);
            }
        }
    });
});

// Smooth scroll for window content
document.querySelectorAll('.window-content').forEach(content => {
    content.style.scrollBehavior = 'smooth';
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + W to close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWin = document.querySelector('.window[style*="z-index: 100"]');
        if (activeWin) {
            closeWindow(activeWin);
        }
    }
    
    // Cmd/Ctrl + M to minimize active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        const activeWin = document.querySelector('.window[style*="z-index: 100"]');
        if (activeWin) {
            minimizeWindow(activeWin);
        }
    }
});

// Initialize - show About window by default
window.addEventListener('load', () => {
    const aboutWindow = document.getElementById('about-window');
    if (aboutWindow) {
        bringToFront(aboutWindow);
    }
});

console.log('Portfolio loaded successfully! 🚀');
