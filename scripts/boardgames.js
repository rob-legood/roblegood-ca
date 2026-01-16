(function() {
    function renderGameCard(game) {
        return `
            <article class="rl-game-card">
                <div class="rl-game-image">
                    <img src="${game.image}" alt="${game.name} board game">
                </div>
                <div class="rl-game-content">
                    <h3>${game.rank}. ${game.name}</h3>
                    <p class="rl-game-description">${game.description}</p>
                    <div class="rl-game-thoughts">
                        <h4>My Thoughts</h4>
                        <p>${game.thoughts}</p>
                    </div>
                </div>
            </article>
        `;
    }

    fetch('data/boardgames.json')
        .then(response => response.json())
        .then(games => {
            const container = document.getElementById('game-list');
            container.innerHTML = games.map(renderGameCard).join('');
        })
        .catch(error => {
            console.error('Failed to load boardgames:', error);
            document.getElementById('game-list').innerHTML =
                '<p>Unable to load games. Please try again later.</p>';
        });
})();
