// Mobile menu toggle functionality
document.querySelector('.menu-toggle').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '10px';
        navLinks.style.width = '200px';
    }
});

const logo = document.getElementById('logo');
const defaultLogo = 'asset 8.png';
const hoverLogo = 'logo-hover.png';

logo.addEventListener('mouseenter', () => {
    logo.src = hoverLogo;
    logo.classList.remove('default');
    logo.classList.add('hover');
});

logo.addEventListener('mouseleave', () => {
    logo.src = defaultLogo;
    logo.classList.remove('hover');
    logo.classList.add('default');
});