(function() {
    var config = null;
    var posts = [];
    var currentPostIndex = 0;

    // Rich Text renderer for Contentful
    function renderRichText(richText) {
        if (!richText || !richText.content) {
            return '<p>No content available.</p>';
        }

        return richText.content.map(function(node) {
            return renderNode(node);
        }).join('');
    }

    function renderNode(node) {
        switch (node.nodeType) {
            case 'paragraph':
                return '<p>' + renderChildren(node) + '</p>';
            case 'heading-1':
                return '<h1>' + renderChildren(node) + '</h1>';
            case 'heading-2':
                return '<h2>' + renderChildren(node) + '</h2>';
            case 'heading-3':
                return '<h3>' + renderChildren(node) + '</h3>';
            case 'heading-4':
                return '<h4>' + renderChildren(node) + '</h4>';
            case 'heading-5':
                return '<h5>' + renderChildren(node) + '</h5>';
            case 'heading-6':
                return '<h6>' + renderChildren(node) + '</h6>';
            case 'unordered-list':
                return '<ul>' + renderChildren(node) + '</ul>';
            case 'ordered-list':
                return '<ol>' + renderChildren(node) + '</ol>';
            case 'list-item':
                return '<li>' + renderChildren(node) + '</li>';
            case 'blockquote':
                return '<blockquote>' + renderChildren(node) + '</blockquote>';
            case 'hr':
                return '<hr>';
            case 'hyperlink':
                var url = node.data && node.data.uri ? node.data.uri : '#';
                return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + renderChildren(node) + '</a>';
            case 'text':
                return renderTextNode(node);
            default:
                if (node.content) {
                    return renderChildren(node);
                }
                return '';
        }
    }

    function renderChildren(node) {
        if (!node.content) return '';
        return node.content.map(function(child) {
            return renderNode(child);
        }).join('');
    }

    function renderTextNode(node) {
        var text = escapeHtml(node.value || '');

        if (node.marks && node.marks.length > 0) {
            node.marks.forEach(function(mark) {
                switch (mark.type) {
                    case 'bold':
                        text = '<strong>' + text + '</strong>';
                        break;
                    case 'italic':
                        text = '<em>' + text + '</em>';
                        break;
                    case 'underline':
                        text = '<u>' + text + '</u>';
                        break;
                    case 'code':
                        text = '<code>' + text + '</code>';
                        break;
                }
            });
        }

        return text;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function renderSidebar() {
        var navList = document.getElementById('blog-nav-list');

        if (posts.length === 0) {
            navList.innerHTML = '<li class="rl-blog-nav-empty">No posts found.</li>';
            return;
        }

        navList.innerHTML = posts.map(function(post, index) {
            var activeClass = index === currentPostIndex ? ' active' : '';
            var title = post.fields.title || 'Untitled';
            return '<li class="rl-blog-nav-item' + activeClass + '" data-index="' + index + '">' +
                escapeHtml(title) +
                '</li>';
        }).join('');

        // Add click handlers
        var items = navList.querySelectorAll('.rl-blog-nav-item');
        items.forEach(function(item) {
            item.addEventListener('click', function() {
                var index = parseInt(this.getAttribute('data-index'), 10);
                selectPost(index);
            });
        });
    }

    function renderPost(post) {
        var contentEl = document.getElementById('blog-content');

        if (!post) {
            contentEl.innerHTML = '<div class="rl-blog-error">Post not found.</div>';
            return;
        }

        var title = post.fields.title || 'Untitled';
        var date = formatDate(post.fields.publishedDate || post.sys.createdAt);
        var bodyContent = '';

        // Try different field names for the body content
        var bodyField = post.fields.blogContent || post.fields.content || post.fields.body;

        if (bodyField) {
            if (typeof bodyField === 'string') {
                // Plain text or markdown
                bodyContent = '<p>' + escapeHtml(bodyField).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
            } else if (bodyField.nodeType === 'document') {
                // Rich text
                bodyContent = renderRichText(bodyField);
            } else {
                bodyContent = '<p>Unable to render content.</p>';
            }
        } else {
            bodyContent = '<p>No content available.</p>';
        }

        contentEl.innerHTML =
            '<header class="rl-blog-post-header">' +
                '<h1 class="rl-blog-post-title">' + escapeHtml(title) + '</h1>' +
                '<time class="rl-blog-post-date">' + date + '</time>' +
            '</header>' +
            '<div class="rl-blog-post-body">' + bodyContent + '</div>';
    }

    function selectPost(index) {
        currentPostIndex = index;

        // Update active state in sidebar
        var items = document.querySelectorAll('.rl-blog-nav-item');
        items.forEach(function(item, i) {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Render the selected post
        renderPost(posts[index]);
    }

    function fetchPosts() {
        var url = 'https://cdn.contentful.com/spaces/' + config.spaceId + '/entries' +
            '?access_token=' + config.accessToken +
            '&content_type=' + config.contentType +
            '&order=-fields.blogDate,-sys.createdAt';

        fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                posts = data.items || [];
                renderSidebar();

                if (posts.length > 0) {
                    renderPost(posts[0]);
                } else {
                    document.getElementById('blog-content').innerHTML =
                        '<div class="rl-blog-empty">No blog posts yet. Check back soon!</div>';
                }
            })
            .catch(function(error) {
                console.error('Error fetching blog posts:', error);
                document.getElementById('blog-nav-list').innerHTML =
                    '<li class="rl-blog-nav-error">Failed to load posts.</li>';
                document.getElementById('blog-content').innerHTML =
                    '<div class="rl-blog-error">Unable to load blog posts. Please try again later.</div>';
            });
    }

    function init() {
        // Load config then fetch posts
        fetch('data/contentful-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                config = data;
                fetchPosts();
            })
            .catch(function(error) {
                console.error('Error loading config:', error);
                document.getElementById('blog-content').innerHTML =
                    '<div class="rl-blog-error">Configuration error. Please check setup.</div>';
            });
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
