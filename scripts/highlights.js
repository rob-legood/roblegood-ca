(function() {
    // Extract plain text from Contentful rich text document
    function extractPlainText(richText) {
        if (!richText || !richText.content) {
            return '';
        }

        function extractFromNode(node) {
            if (node.nodeType === 'text') {
                return node.value || '';
            }
            if (node.content) {
                return node.content.map(extractFromNode).join('');
            }
            return '';
        }

        return richText.content.map(extractFromNode).join(' ');
    }

    // Truncate text to specified number of words
    function truncateWords(text, wordCount) {
        var words = text.trim().split(/\s+/);
        if (words.length <= wordCount) {
            return text;
        }
        return words.slice(0, wordCount).join(' ') + '...';
    }

    // Truncate text to specified number of characters
    function truncateChars(text, charCount) {
        if (text.length <= charCount) {
            return text;
        }
        return text.substring(0, charCount) + '...';
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Render the blog card with fetched data
    function renderBlogCard(post) {
        var container = document.getElementById('highlight-blog');
        if (!container) return;

        var title = post.fields.title || 'Untitled';
        var date = formatDate(post.fields.blogDate || post.fields.publishedDate || post.sys.createdAt);

        // Extract excerpt from body content
        var bodyField = post.fields.blogContent || post.fields.content || post.fields.body;
        var excerpt = '';

        if (bodyField) {
            if (typeof bodyField === 'string') {
                excerpt = truncateWords(bodyField, 30);
            } else if (bodyField.nodeType === 'document') {
                excerpt = truncateWords(extractPlainText(bodyField), 30);
            }
        }

        container.classList.remove('rl-highlight-loading');
        container.innerHTML =
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p class="rl-highlight-date">' + date + '</p>' +
            '<p>' + escapeHtml(excerpt) + '</p>' +
            '<a href="blog.html" class="rl-highlight-link">Read more</a>';
    }

    // Render error state for blog card
    function renderBlogError() {
        var container = document.getElementById('highlight-blog');
        if (!container) return;

        container.classList.remove('rl-highlight-loading');
        container.innerHTML =
            '<h3>Latest Blog</h3>' +
            '<p>Unable to load blog post. Check back later!</p>' +
            '<a href="blog.html" class="rl-highlight-link">View blog</a>';
    }

    // Render the boardgame card with fetched data
    function renderBoardgameCard(game) {
        var container = document.getElementById('highlight-boardgame');
        if (!container) return;

        container.classList.remove('rl-highlight-loading');
        container.innerHTML =
            '<h3>Current Fav: ' + escapeHtml(game.name) + '</h3>' +
            '<p>' + escapeHtml(game.thoughts) + '</p>' +
            '<a href="boardgames.html" class="rl-highlight-link">See all rankings</a>';
    }

    // Render error state for boardgame card
    function renderBoardgameError() {
        var container = document.getElementById('highlight-boardgame');
        if (!container) return;

        container.classList.remove('rl-highlight-loading');
        container.innerHTML =
            '<h3>Top Boardgame</h3>' +
            '<p>Unable to load boardgame. Check back later!</p>' +
            '<a href="boardgames.html" class="rl-highlight-link">View rankings</a>';
    }

    // Render the recommendation card with fetched data
    function renderRecommendationCard(recommendation) {
        var container = document.getElementById('highlight-recommendation');
        if (!container) return;

        var title = recommendation.fields.title || 'Untitled';
        var description = recommendation.fields.description || '';
        var link = recommendation.fields.link || '';

        var truncatedDescription = truncateWords(description, 50);

        container.classList.remove('rl-highlight-loading');
        var html = '<h3>' + escapeHtml(title) + '</h3>' +
            '<p>' + escapeHtml(truncatedDescription) + '</p>';

        if (link) {
            html += '<a href="' + escapeHtml(link) + '" class="rl-highlight-link" target="_blank" rel="noopener noreferrer">Check it out</a>';
        }

        html += '<a href="recommendations.html" class="rl-highlight-link">More recommendations</a>';

        container.innerHTML = html;
    }

    // Render error state for recommendation card
    function renderRecommendationError() {
        var container = document.getElementById('highlight-recommendation');
        if (!container) return;

        container.classList.remove('rl-highlight-loading');
        container.innerHTML =
            '<h3>Latest Recommendation</h3>' +
            '<p>Unable to load recommendation. Check back later!</p>' +
            '<a href="recommendations.html" class="rl-highlight-link">View recommendations</a>';
    }

    // Fetch latest blog post from Contentful
    function fetchLatestBlogPost() {
        fetch('data/contentful-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(config) {
                var url = 'https://cdn.contentful.com/spaces/' + config.spaceId + '/entries' +
                    '?access_token=' + config.accessToken +
                    '&content_type=' + config.contentType +
                    '&order=-fields.blogDate,-sys.createdAt' +
                    '&limit=1';

                return fetch(url);
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch blog post');
                }
                return response.json();
            })
            .then(function(data) {
                if (data.items && data.items.length > 0) {
                    renderBlogCard(data.items[0]);
                } else {
                    renderBlogError();
                }
            })
            .catch(function(error) {
                console.error('Error fetching blog post:', error);
                renderBlogError();
            });
    }

    // Fetch top boardgame from JSON
    function fetchTopBoardgame() {
        fetch('data/boardgames.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(games) {
                var topGame = games.find(function(game) {
                    return game.rank === 1;
                });

                if (topGame) {
                    renderBoardgameCard(topGame);
                } else {
                    renderBoardgameError();
                }
            })
            .catch(function(error) {
                console.error('Error fetching boardgame:', error);
                renderBoardgameError();
            });
    }

    // Fetch latest recommendation from Contentful
    function fetchLatestRecommendation() {
        fetch('data/contentful-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(config) {
                var url = 'https://cdn.contentful.com/spaces/' + config.spaceId + '/entries' +
                    '?access_token=' + config.accessToken +
                    '&content_type=recommendations' +
                    '&order=-fields.publishedDate' +
                    '&limit=1';

                return fetch(url);
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendation');
                }
                return response.json();
            })
            .then(function(data) {
                if (data.items && data.items.length > 0) {
                    renderRecommendationCard(data.items[0]);
                } else {
                    renderRecommendationError();
                }
            })
            .catch(function(error) {
                console.error('Error fetching recommendation:', error);
                renderRecommendationError();
            });
    }

    // Initialize highlights
    function init() {
        fetchLatestBlogPost();
        fetchTopBoardgame();
        fetchLatestRecommendation();
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
