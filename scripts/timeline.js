(function() {
    const markers = document.querySelectorAll('.rl-timeline-marker');
    const sections = document.querySelectorAll('.rl-timeline-section');

    if (!markers.length || !sections.length) return;

    // Click handler for smooth scroll
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navHeight = 60;
                const timelineHeight = document.querySelector('.rl-timeline-nav').offsetHeight;
                const offset = navHeight + timelineHeight + 20;
                const targetPosition = targetSection.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll-based highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                markers.forEach(marker => {
                    marker.classList.remove('active');
                    if (marker.getAttribute('data-target') === sectionId) {
                        marker.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Set first marker as active by default
    if (markers[0]) {
        markers[0].classList.add('active');
    }

    // Intersection Observer for section animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    });

    sections.forEach(section => {
        animationObserver.observe(section);
    });
})();
