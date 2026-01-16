(function() {
    var STORAGE_KEY = 'geocities-mode';
    var stylesheet = null;
    var marquee = null;
    var extras = null;

    function createMarquee() {
        var div = document.createElement('div');
        div.className = 'rl-geocities-marquee';
        div.innerHTML = '<span>★☆★ WELCOME TO ROB\'S CYBER SPACE ★☆★ You have entered the INFORMATION SUPERHIGHWAY ★☆★ This site is UNDER CONSTRUCTION ★☆★ Sign my GUESTBOOK ★☆★ Best viewed with Netscape Navigator 4.0 ★☆★</span>';
        return div;
    }

    function createExtras() {
        var visitorCount = Math.floor(Math.random() * 50000) + 10000;
        var div = document.createElement('div');
        div.className = 'rl-geocities-extras';
        div.innerHTML =
            '<div class="rl-geocities-construction">🚧 UNDER CONSTRUCTION 🚧</div>' +
            '<hr class="rl-geocities-hr">' +
            '<div class="rl-geocities-counter">You are visitor #' + visitorCount.toString().padStart(8, '0') + '</div>' +
            '<div class="rl-geocities-badges">' +
                '<div class="rl-geocities-badge">🌐 Netscape NOW!</div>' +
                '<div class="rl-geocities-badge">💻 Best viewed 800x600</div>' +
                '<div class="rl-geocities-badge">🏆 GeoCities Award Winner</div>' +
            '</div>' +
            '<div class="rl-geocities-guestbook">' +
                '<span class="rl-geocities-spin">📧</span> ' +
                '<a href="https://www.linkedin.com/in/rob-legood/">Sign my Guestbook!</a> ' +
                '<span class="rl-geocities-spin">📧</span>' +
            '</div>';
        return div;
    }

    function loadStylesheet() {
        if (!stylesheet) {
            stylesheet = document.createElement('link');
            stylesheet.rel = 'stylesheet';
            stylesheet.href = 'styles/geocities.css';
            document.head.appendChild(stylesheet);
        }
    }

    function removeStylesheet() {
        if (stylesheet && stylesheet.parentNode) {
            stylesheet.parentNode.removeChild(stylesheet);
            stylesheet = null;
        }
    }

    function enableGeocities() {
        loadStylesheet();
        document.body.classList.add('rl-geocities-mode');

        if (!marquee) {
            marquee = createMarquee();
            document.body.insertBefore(marquee, document.body.firstChild);
        }

        if (!extras) {
            extras = createExtras();
            document.body.appendChild(extras);
        }

        localStorage.setItem(STORAGE_KEY, 'enabled');

        // Update the toggle icon
        var icon = document.getElementById('geocities-toggle');
        if (icon) {
            icon.title = 'Return to the future (disable 90s mode)';
        }
    }

    function disableGeocities() {
        document.body.classList.remove('rl-geocities-mode');
        removeStylesheet();

        if (marquee && marquee.parentNode) {
            marquee.parentNode.removeChild(marquee);
            marquee = null;
        }

        if (extras && extras.parentNode) {
            extras.parentNode.removeChild(extras);
            extras = null;
        }

        localStorage.removeItem(STORAGE_KEY);

        // Update the toggle icon
        var icon = document.getElementById('geocities-toggle');
        if (icon) {
            icon.title = 'Travel back to the 90s';
        }
    }

    function toggleGeocities() {
        if (document.body.classList.contains('rl-geocities-mode')) {
            disableGeocities();
        } else {
            enableGeocities();
        }
    }

    // Initialize on load
    function init() {
        // Set up click handler for the toggle icon
        var icon = document.getElementById('geocities-toggle');
        if (icon) {
            icon.addEventListener('click', toggleGeocities);
        }

        // Check if geocities mode was previously enabled
        if (localStorage.getItem(STORAGE_KEY) === 'enabled') {
            enableGeocities();
        }
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
