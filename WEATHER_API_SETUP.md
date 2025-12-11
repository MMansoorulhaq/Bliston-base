# Weather API Configuration

## Setting Up OpenWeatherMap API

To enable live weather data for Bliston, UK, follow these steps:

### 1. Get Your Free API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" to create a free account
3. After signing in, go to "API keys" section
4. Copy your API key

### 2. Add API Key to Your Project

Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key from OpenWeatherMap.

### 3. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

### Current Configuration

- **Location**: Bliston, UK (Walsall area)
- **Coordinates**: Latitude 52.5833, Longitude -2.0833
- **Update Interval**: Every 10 minutes
- **Units**: Metric (Celsius)

### Fallback Data

If no API key is configured, the app will display mock weather data:
- Temperature: 31°C
- Humidity: 8%
- Condition: Clear
- Icon: ☀️

### Free Tier Limits

OpenWeatherMap free tier includes:
- 1,000 API calls per day
- 60 calls per minute
- Current weather data
- 5-day forecast

This is more than sufficient for this application (approximately 144 calls per day with 10-minute intervals).

### Alternative: Keep Mock Data

If you prefer to use static/mock weather data instead of live data, you can simply skip the API key setup. The application will continue to work with the fallback data defined in `src/lib/weatherApi.ts`.
