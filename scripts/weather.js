(function() {
    const weatherCodes = {
        0: 'Clear',
        1: 'Mostly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Icy Fog',
        51: 'Light Drizzle',
        53: 'Drizzle',
        55: 'Heavy Drizzle',
        61: 'Light Rain',
        63: 'Rain',
        65: 'Heavy Rain',
        66: 'Freezing Rain',
        67: 'Heavy Freezing Rain',
        71: 'Light Snow',
        73: 'Snow',
        75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Light Showers',
        81: 'Showers',
        82: 'Heavy Showers',
        85: 'Light Snow Showers',
        86: 'Snow Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm w/ Hail',
        99: 'Thunderstorm w/ Heavy Hail'
    };

    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.4516&longitude=-80.4925&current_weather=true')
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            const condition = weatherCodes[code] || 'Unknown';

            document.getElementById('weather-temp').textContent = temp + '°C';
            document.getElementById('weather-condition').textContent = condition;
        })
        .catch(() => {
            document.getElementById('weather-condition').textContent = 'Unavailable';
        });
})();
