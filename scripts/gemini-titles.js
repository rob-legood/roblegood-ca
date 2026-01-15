(function() {
    var DEFAULT_TITLE = 'Rob LeGood | Director of Software Development';

    function generateTitle() {
        fetch('scripts/gemini-config.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(config) {
                var apiKey = config.apiKey;
                var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

                var prompt = 'Generate a short, witty, humorous title (under 60 characters) for a software developer named Rob LeGood\'s personal website. Be creative and funny but keep it professional enough for a portfolio site. Return only the title text, nothing else.';

                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    var title = data.candidates[0].content.parts[0].text.trim();
                    if (title) {
                        document.title = title;
                    }
                }
            })
            .catch(function(error) {
                console.log('Gemini title generation failed, using default title');
            });
    }

    generateTitle();
})();
