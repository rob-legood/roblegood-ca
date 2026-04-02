(function() {
    'use strict';

    var NAV_HTML =
        '<div class="rl-nav-brand">' +
            '<a href="index.html" class="rl-nav-logo">Rob LeGood</a>' +
            '<span class="rl-nav-title"></span>' +
        '</div>' +
        '<button class="rl-nav-hamburger" aria-label="Toggle navigation menu" aria-expanded="false">' +
            '<span class="rl-nav-hamburger-line"></span>' +
            '<span class="rl-nav-hamburger-line"></span>' +
            '<span class="rl-nav-hamburger-line"></span>' +
        '</button>' +
        '<div class="rl-nav-links">' +
            '<a href="about.html">About Me</a>' +
            '<a href="sandbox.html">Sandbox</a>' +
            '<a href="boardgames.html">Boardgames</a>' +
            '<a href="blog.html">Blog</a>' +
            '<a href="recommendations.html">Recommendations</a>' +
        '</div>';

    var nav = document.querySelector('nav');
    if (!nav) return;

    nav.innerHTML = NAV_HTML;

    // Mark the current page's link as active.
    // Strip .html to handle both clean URLs (Cloudflare Pages) and direct file access.
    var rawPage = window.location.pathname.split('/').pop() || 'index.html';
    var currentPage = rawPage.replace(/\.html$/, '') || 'index';
    var links = nav.querySelectorAll('.rl-nav-links a');
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href').replace(/\.html$/, '');
        if (href === currentPage) {
            links[i].classList.add('active');
            break;
        }
    }

    // Mobile nav behaviour (previously mobile-nav.js)
    var hamburger = nav.querySelector('.rl-nav-hamburger');
    var navLinks = nav.querySelector('.rl-nav-links');

    function openMenu() {
        nav.classList.add('rl-nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        nav.classList.remove('rl-nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (nav.classList.contains('rl-nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.addEventListener('click', function(e) {
        if (nav.classList.contains('rl-nav-open') && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('rl-nav-open')) {
            closeMenu();
            hamburger.focus();
        }
    });

    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav.classList.contains('rl-nav-open')) {
            closeMenu();
        }
    });
})();
