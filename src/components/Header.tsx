'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherData, WeatherData } from '../lib/weatherApi';

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadWeather = async () => {
            const data = await fetchWeatherData();
            setWeather(data);
        };
        loadWeather();
        const weatherTimer = setInterval(loadWeather, 300000); // 5 minutes
        return () => clearInterval(weatherTimer);
    }, []);

    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/London',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(currentTime);

        return {
            month: parts.find(p => p.type === 'month')?.value,
            day: parts.find(p => p.type === 'day')?.value,
            weekday: parts.find(p => p.type === 'weekday')?.value,
        };
    };

    const formatTime = () => {
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/London',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(currentTime);
    };

    const { month, day, weekday } = formatDate();
    const timeString = formatTime();

    const ordinalFor = (d?: string | number) => {
        if (!d) return 'th';
        const n = typeof d === 'string' ? parseInt(d, 10) : d;
        if (!n) return 'th';
        if (n % 100 >= 11 && n % 100 <= 13) return 'th';
        switch (n % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    return (
        <header className="header-container">
            <div className="header-content">
                {/* LEFT ZONE - Year + Date Cluster */}
                <div className="left-zone">
                    <div className="year-vertical rotate-90">2025</div>
                    <div className="date-cluster">
                        <div className="date-text-group">
                            <div className="date-month">{month}</div>
                            <div className="date-weekday">{weekday}</div>
                        </div>
                        <div className="date-day-large">
                            {day}
                            <span className="date-ordinal">{ordinalFor(day)}</span>
                        </div>
                    </div>
                </div>

                {/* CENTER ZONE - Time + Micro Indicators */}
                <div className="center-zone">
                    <div className="time-box">
                        <div className="time-display">
                            <span className="time-main">{timeString}</span>
                        </div>

                        {/* No micro indicators inside the time box per design */}
                    </div>
                </div>

                {/* RIGHT ZONE - Location + Current Temperature */}
                <div className="right-zone">
                    {weather ? (
                        <>

                            <div className="location-stack">
                                <div className="temp-aux-row">
                                    <div className="aux-high-stack">
                                        <div className="aux-item aux-high">
                                            <span className="micro-icon up-arrow" aria-hidden="true">⬆</span>
                                            <span className="aux-value">{weather.highTemp ?? '—'}</span>
                                        </div>
                                        <div className="aux-item aux-humidity">
                                            <span className="micro-icon drop-icon" aria-hidden="true">💧</span>
                                            <span className="aux-value">{weather.humidity ?? '—'}%</span>
                                        </div>
                                    </div>

                                    <div className="aux-low-stack">
                                        <div className="aux-item aux-low">
                                            <span className="micro-icon down-arrow" aria-hidden="true">⬇</span>
                                            <span className="aux-value">{weather.lowTemp ?? '—'}</span>
                                        </div>
                                        <div className="location-name">{weather.location}</div>
                                    </div>

                                    <div className="current-temp">{weather.temperature}°</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="loading"></div>
                    )}
                </div>
            </div>
        </header>
    );
}
