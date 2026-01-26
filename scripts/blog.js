(function() {
    var config = null;
    var posts = [];
    var includes = {}; // Store linked entries from Contentful
    var currentPostIndex = 0;
    var searchQuery = '';
    var selectedTags = [];
    var allTags = []; // Tags fetched from Contentful

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

    function fetchTags() {
        var url = 'https://cdn.contentful.com/spaces/' + config.spaceId + '/entries' +
            '?access_token=' + config.accessToken +
            '&content_type=tags';

        return fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch tags: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                allTags = (data.items || []).map(function(tag) {
                    return {
                        id: tag.sys.id,
                        name: tag.fields.name || tag.fields.title || ''
                    };
                }).filter(function(tag) {
                    return tag.name;
                });
            })
            .catch(function(error) {
                console.error('Error fetching tags:', error);
                allTags = [];
            });
    }

    function openFilterModal() {
        document.getElementById('blog-filter-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFilterModal() {
        document.getElementById('blog-filter-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateFilterCount() {
        var count = selectedTags.length + (searchQuery ? 1 : 0);
        var countEl = document.getElementById('blog-filter-count');
        countEl.textContent = count > 0 ? count : '';
        countEl.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    function renderFilters() {
        var filtersEl = document.getElementById('blog-filters');
        var hasActiveFilters = searchQuery || selectedTags.length > 0;

        var html = '<input type="text" class="rl-blog-search" id="blog-search" placeholder="Search posts..." value="' + escapeHtml(searchQuery) + '">';

        if (allTags.length > 0) {
            html += '<div class="rl-blog-filter-tags">';
            html += allTags.map(function(tag) {
                var isActive = selectedTags.indexOf(tag.id) !== -1;
                return '<button class="rl-blog-filter-tag' + (isActive ? ' active' : '') + '" data-tag-id="' + tag.id + '">' +
                    escapeHtml(tag.name) + '</button>';
            }).join('');
            html += '</div>';
        }

        if (hasActiveFilters) {
            html += '<button class="rl-blog-clear-filters" id="blog-clear-filters">Clear Filters</button>';
        }

        filtersEl.innerHTML = html;
        attachFilterListeners();
    }

    function getFilteredPosts() {
        return posts.filter(function(post) {
            // Search filter
            if (searchQuery) {
                var query = searchQuery.toLowerCase();
                var title = (post.fields.title || '').toLowerCase();
                var body = '';
                var bodyField = post.fields.blogContent || post.fields.content || post.fields.body;
                if (typeof bodyField === 'string') {
                    body = bodyField.toLowerCase();
                } else if (bodyField && bodyField.content) {
                    body = JSON.stringify(bodyField.content).toLowerCase();
                }
                if (title.indexOf(query) === -1 && body.indexOf(query) === -1) {
                    return false;
                }
            }

            // Tag filter (must have ALL selected tags)
            if (selectedTags.length > 0) {
                var postTagIds = (post.fields.tags || []).map(function(tag) {
                    return tag.sys && tag.sys.id;
                }).filter(Boolean);

                for (var i = 0; i < selectedTags.length; i++) {
                    if (postTagIds.indexOf(selectedTags[i]) === -1) {
                        return false;
                    }
                }
            }

            return true;
        });
    }

    function attachFilterListeners() {
        var searchInput = document.getElementById('blog-search');
        var debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                searchQuery = searchInput.value;
                applyFilters();
            }, 300);
        });

        var tagButtons = document.querySelectorAll('.rl-blog-filter-tag');
        tagButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tagId = this.getAttribute('data-tag-id');
                var index = selectedTags.indexOf(tagId);
                if (index === -1) {
                    selectedTags.push(tagId);
                } else {
                    selectedTags.splice(index, 1);
                }
                applyFilters();
            });
        });

        var clearBtn = document.getElementById('blog-clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchQuery = '';
                selectedTags = [];
                applyFilters();
            });
        }
    }

    function applyFilters() {
        renderFilters();
        updateFilterCount();
        var filtered = getFilteredPosts();
        renderSidebar(filtered);
        if (filtered.length > 0) {
            currentPostIndex = posts.indexOf(filtered[0]);
            renderPost(filtered[0]);
        } else {
            document.getElementById('blog-content').innerHTML =
                '<div class="rl-blog-empty">No posts match your filters.</div>';
        }
    }

    function renderSidebar(filteredPosts) {
        var navList = document.getElementById('blog-nav-list');
        var postsToRender = filteredPosts || posts;

        if (postsToRender.length === 0) {
            navList.innerHTML = '<li class="rl-blog-nav-empty">No posts found.</li>';
            return;
        }

        navList.innerHTML = postsToRender.map(function(post) {
            var index = posts.indexOf(post);
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

        // Build tags HTML if tags exist
        var tags = post.fields.tags || [];
        var tagsHtml = '';
        if (tags.length > 0) {
            tagsHtml = '<div class="rl-blog-post-tags">' +
                tags.map(function(tag) {
                    var tagName = '';
                    if (typeof tag === 'string') {
                        tagName = tag;
                    } else if (tag.sys && tag.sys.id && includes[tag.sys.id]) {
                        // Resolve linked entry from includes
                        var linkedEntry = includes[tag.sys.id];
                        tagName = linkedEntry.fields.name || linkedEntry.fields.title || '';
                    } else if (tag.name) {
                        tagName = tag.name;
                    }
                    return tagName ? '<span class="rl-blog-tag">' + escapeHtml(tagName) + '</span>' : '';
                }).join('') +
            '</div>';
        }

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
                tagsHtml +
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

        return fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                posts = data.items || [];
                // Build lookup map for linked entries (tags, etc.)
                if (data.includes && data.includes.Entry) {
                    data.includes.Entry.forEach(function(entry) {
                        includes[entry.sys.id] = entry;
                    });
                }
            });
    }

    function init() {
        // Load config then fetch tags and posts in parallel
        fetch('data/contentful-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                config = data;
                return Promise.all([fetchTags(), fetchPosts()]);
            })
            .then(function() {
                renderFilters();
                updateFilterCount();
                renderSidebar();
                if (posts.length > 0) {
                    renderPost(posts[0]);
                } else {
                    document.getElementById('blog-content').innerHTML =
                        '<div class="rl-blog-empty">No blog posts yet. Check back soon!</div>';
                }

                // Modal event listeners
                document.getElementById('blog-filter-btn').addEventListener('click', openFilterModal);
                document.getElementById('blog-modal-close').addEventListener('click', closeFilterModal);
                document.getElementById('blog-filter-modal').addEventListener('click', function(e) {
                    if (e.target === this) closeFilterModal();
                });
            })
            .catch(function(error) {
                console.error('Error loading blog:', error);
                document.getElementById('blog-content').innerHTML =
                    '<div class="rl-blog-error">Unable to load blog. Please try again later.</div>';
            });
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
