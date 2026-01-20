(function() {
    var config = null;

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderRecommendations(items) {
        var listEl = document.getElementById('recommendations-list');

        if (!items || items.length === 0) {
            listEl.innerHTML = '<div class="rl-recommendations-empty">No recommendations yet. Check back soon!</div>';
            return;
        }

        listEl.innerHTML = items.map(function(item) {
            var fields = item.fields;
            var title = fields.title || 'Untitled';
            var description = fields.description || '';
            var link = fields.link || '';

            var titleHtml;
            if (link) {
                titleHtml = '<h2 class="rl-recommendation-title"><a href="' + escapeHtml(link) + '" target="_blank" rel="noopener">' + escapeHtml(title) + '</a></h2>';
            } else {
                titleHtml = '<h2 class="rl-recommendation-title">' + escapeHtml(title) + '</h2>';
            }

            return '<article class="rl-recommendation-item">' +
                titleHtml +
                '<p class="rl-recommendation-description">' + escapeHtml(description) + '</p>' +
                '</article>';
        }).join('');
    }

    function fetchRecommendations() {
        var url = 'https://cdn.contentful.com/spaces/' + config.spaceId + '/entries' +
            '?access_token=' + config.accessToken +
            '&content_type=recommendations' +
            '&order=-fields.publishedDate' +
            '&limit=10';

        fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                renderRecommendations(data.items || []);
            })
            .catch(function(error) {
                console.error('Error fetching recommendations:', error);
                document.getElementById('recommendations-list').innerHTML =
                    '<div class="rl-recommendations-error">Unable to load recommendations. Please try again later.</div>';
            });
    }

    function init() {
        fetch('data/contentful-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                config = data;
                fetchRecommendations();
            })
            .catch(function(error) {
                console.error('Error loading config:', error);
                document.getElementById('recommendations-list').innerHTML =
                    '<div class="rl-recommendations-error">Configuration error. Please check setup.</div>';
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
