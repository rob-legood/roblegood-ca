(function() {
    'use strict';

    var hamburger = document.querySelector('.rl-nav-hamburger');
    var navLinks = document.querySelector('.rl-nav-links');
    var nav = document.querySelector('nav');

    if (!hamburger || !navLinks || !nav) {
        return;
    }

    function openMenu() {
        nav.classList.add('rl-nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        nav.classList.remove('rl-nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
        if (nav.classList.contains('rl-nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside nav
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('rl-nav-open') && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('rl-nav-open')) {
            closeMenu();
            hamburger.focus();
        }
    });

    // Close menu when a nav link is clicked
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Close menu on window resize to desktop width
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('rl-nav-open')) {
            closeMenu();
        }
    });
})();
