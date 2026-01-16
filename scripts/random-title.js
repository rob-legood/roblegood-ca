(function() {
    var DEFAULT_TITLE = 'Director of Software Development';

    var TITLES = [
        'Director of Software Development',
        'Code Whisperer',
        'Bug Exterminator',
        'Keyboard Enthusiast',
        'Professional Googler',
        'Cardboard Connoisseur',
        'Meeple Wrangler',
        'Semicolon Advocate',
        'Stack Overflow Contributor',
        'Meeting Survivor',
        'Agile Apologist',
        'Scrum Master of Ceremonies',
        'Merge Conflict Mediator',
        'Technical Debt Collector',
        'Rubber Duck Whisperer',
        'Caffeine-Powered Developer',
        'Git Blame Detective',
        'Syntax Error Survivor',
        'Deployment Day Optimist',
        'Legacy Code Archaeologist',
        'Pull Request Philosopher',
        'Variable Naming Expert',
        'Console.log Connoisseur',
        'Imposter Syndrome Defeater',
        'Feature Creep Fighter',
        'Documentation Dreamer',
        'API Whisperer',
        'Database Wrangler',
        'Cloud Shepherd',
        'Container Enthusiast',
        'Pipeline Plumber',
        'Backlog Tamer',
        'Sprint Planning Survivor',
        'Standup Meeting Champion',
        'Refactoring Advocate',
        'Code Review Diplomat',
        'Hotfix Hero',
        'Production Firefighter',
        'Dependency Manager',
        'NPM Install Enthusiast',
        'Dark Mode Advocate',
        'Mechanical Keyboard Collector',
        'Second Monitor Maximalist',
        'Tab vs Spaces Neutral',
        'Vim Escape Artist',
        'Regex Wizard',
        'JSON Formatter',
        'YAML Indentation Expert',
        'Environment Variable Collector',
        'Docker Compose Poet',
        'Kubernetes Whisperer',
        'Serverless Evangelist',
        'Microservices Architect',
        'Monolith Defender',
        'Cache Invalidation Solver',
        'Off-By-One Error Finder',
        'Null Pointer Preventer',
        'Race Condition Referee',
        'Memory Leak Hunter',
        'Performance Optimizer',
        'Accessibility Advocate',
        'Cross-Browser Compatibility Wizard',
        'Mobile-First Thinker',
        'Responsive Design Enthusiast',
        'User Experience Defender'
    ];

    function getRandomTitle() {
        try {
            var index = Math.floor(Math.random() * TITLES.length);
            return TITLES[index];
        } catch (e) {
            return DEFAULT_TITLE;
        }
    }

    function setTitle() {
        var titleElement = document.querySelector('.rl-nav-title');
        if (titleElement) {
            titleElement.textContent = '| ' + getRandomTitle();
        }
    }

    setTitle();
})();
