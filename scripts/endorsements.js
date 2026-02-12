(function() {
    'use strict';

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderEndorsements(endorsements) {
        var listEl = document.getElementById('endorsements-list');

        if (!endorsements || endorsements.length === 0) {
            listEl.innerHTML = '<div class="rl-endorsements-empty">No endorsements yet. Check back soon!</div>';
            return;
        }

        listEl.innerHTML = endorsements.map(function(item) {
            var roleText = escapeHtml(item.role);
            if (item.company) {
                roleText += ' at ' + escapeHtml(item.company);
            }

            return '<article class="rl-endorsement-card">' +
                '<p class="rl-endorsement-quote">' + escapeHtml(item.quote) + '</p>' +
                '<div class="rl-endorsement-attribution">' +
                    '<span class="rl-endorsement-name">' + escapeHtml(item.name) + '</span>' +
                    '<span class="rl-endorsement-role">&mdash; ' + roleText + '</span>' +
                '</div>' +
                '</article>';
        }).join('');
    }

    function init() {
        fetch('data/endorsements.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch endorsements: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                renderEndorsements(data);
            })
            .catch(function(error) {
                console.error('Error loading endorsements:', error);
                document.getElementById('endorsements-list').innerHTML =
                    '<div class="rl-endorsements-error">Unable to load endorsements. Please try again later.</div>';
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
