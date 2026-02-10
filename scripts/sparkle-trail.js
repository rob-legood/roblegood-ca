(function() {
    var particles = [];
    var maxParticles = 30;
    var symbols = ['\u2726', '\u2727', '\u2728', '\u2729', '\u272A', '\u2736', '\u2737', '\u2738', '\u2605'];
    var colors = ['#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff0000', '#00ff00', '#ffd700'];

    function createParticle(x, y) {
        var el = document.createElement('span');
        el.className = 'sp-sparkle-particle';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        el.style.fontSize = (8 + Math.random() * 14) + 'px';
        document.body.appendChild(el);

        var particle = {
            el: el,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 + 1,
            life: 1,
            decay: 0.015 + Math.random() * 0.02
        };
        particles.push(particle);

        if (particles.length > maxParticles) {
            var old = particles.shift();
            if (old.el.parentNode) {
                old.el.parentNode.removeChild(old.el);
            }
        }
    }

    function update() {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.life -= p.decay;
            p.x += p.vx;
            p.y += p.vy;
            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
            p.el.style.opacity = p.life;
            p.el.style.transform = 'scale(' + p.life + ') rotate(' + (p.life * 360) + 'deg)';

            if (p.life <= 0) {
                if (p.el.parentNode) {
                    p.el.parentNode.removeChild(p.el);
                }
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(update);
    }

    var throttle = 0;
    document.addEventListener('mousemove', function(e) {
        var now = Date.now();
        if (now - throttle > 50) {
            throttle = now;
            createParticle(e.pageX, e.pageY);
        }
    });

    update();
})();
