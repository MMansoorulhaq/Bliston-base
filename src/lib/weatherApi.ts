// Weather API utility for Walsall, UK using Open-Meteo (Free, no API key required)
import axios from 'axios';

export interface WeatherData {
    temperature: number;
    humidity: number;
    highTemp?: number;
    lowTemp?: number;
    description: string;
    icon: string;
    location: string;
}

// Walsall, UK coordinates
const WALSALL_LAT = 52.5833;
const WALSALL_LON = -2.0833;

export async function fetchWeatherData(): Promise<WeatherData> {
    try {
        // Using Open-Meteo API - completely free, no API key required!
        // API Documentation: https://open-meteo.com/en/docs
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${WALSALL_LAT}&longitude=${WALSALL_LON}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/London&forecast_days=1`
        );

        const current = response.data.current;
        const daily = response.data.daily;

        return {
            temperature: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            highTemp: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : undefined,
            lowTemp: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : undefined,
            description: getWeatherDescription(current.weather_code),
            icon: getWeatherIcon(current.weather_code),
            location: 'Walsall',
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return fallback data
        return {
            temperature: 31,
            humidity: 8,
            highTemp: 39,
            lowTemp: 28,
            description: 'Clear',
            icon: '☀️',
            location: 'Walsall',
        };
    }
}

// Open-Meteo weather codes to icons
// Reference: https://open-meteo.com/en/docs
function getWeatherIcon(weatherCode: number): string {
    const iconMap: { [key: number]: string } = {
        0: '☀️',   // Clear sky
        1: '🌤️',   // Mainly clear
        2: '⛅',   // Partly cloudy
        3: '☁️',   // Overcast
        45: '🌫️',  // Fog
        48: '🌫️',  // Depositing rime fog
        51: '🌦️',  // Light drizzle
        53: '🌦️',  // Moderate drizzle
        55: '🌧️',  // Dense drizzle
        61: '🌧️',  // Slight rain
        63: '🌧️',  // Moderate rain
        65: '🌧️',  // Heavy rain
        71: '❄️',  // Slight snow
        73: '❄️',  // Moderate snow
        75: '❄️',  // Heavy snow
        77: '❄️',  // Snow grains
        80: '🌦️',  // Slight rain showers
        81: '🌧️',  // Moderate rain showers
        82: '🌧️',  // Violent rain showers
        85: '❄️',  // Slight snow showers
        86: '❄️',  // Heavy snow showers
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with slight hail
        99: '⛈️',  // Thunderstorm with heavy hail
    };

    return iconMap[weatherCode] || '☀️';
}

// Open-Meteo weather codes to descriptions
function getWeatherDescription(weatherCode: number): string {
    const descriptionMap: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light showers',
        81: 'Showers',
        82: 'Heavy showers',
        85: 'Light snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Heavy thunderstorm',
    };

    return descriptionMap[weatherCode] || 'Clear';
}
