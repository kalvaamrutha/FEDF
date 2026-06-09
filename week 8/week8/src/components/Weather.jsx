import { useState, useEffect, useRef } from 'react';

// --- MOCK WEATHER DATABASE FOR POPULAR CITIES ---
const MOCK_CITIES = {
  "london": {
    name: "London",
    country: "GB",
    condition: "rainy",
    temp: 14,
    feelsLike: 12,
    tempMin: 11,
    tempMax: 16,
    humidity: 85,
    windSpeed: 18,
    pressure: 1012,
    uvIndex: 2,
    visibility: 10,
    description: "Light rain and drizzle",
    hourly: [
      { time: "09:00", temp: 12, condition: "rainy" },
      { time: "12:00", temp: 14, condition: "rainy" },
      { time: "15:00", temp: 15, condition: "cloudy" },
      { time: "18:00", temp: 13, condition: "rainy" },
      { time: "21:00", temp: 12, condition: "cloudy" },
      { time: "00:00", temp: 11, condition: "clear-night" }
    ],
    daily: [
      { day: "Today", tempMin: 11, tempMax: 16, condition: "rainy", desc: "Light Rain" },
      { day: "Tue", tempMin: 10, tempMax: 15, condition: "cloudy", desc: "Mostly Cloudy" },
      { day: "Wed", tempMin: 12, tempMax: 17, condition: "clear-day", desc: "Sunny Intervals" },
      { day: "Thu", tempMin: 13, tempMax: 19, condition: "clear-day", desc: "Sunny" },
      { day: "Fri", tempMin: 11, tempMax: 15, condition: "rainy", desc: "Showers" }
    ]
  },
  "new york": {
    name: "New York",
    country: "US",
    condition: "clear-day",
    temp: 24,
    feelsLike: 23,
    tempMin: 18,
    tempMax: 27,
    humidity: 50,
    windSpeed: 12,
    pressure: 1018,
    uvIndex: 8,
    visibility: 16,
    description: "Clear and sunny",
    hourly: [
      { time: "09:00", temp: 20, condition: "clear-day" },
      { time: "12:00", temp: 24, condition: "clear-day" },
      { time: "15:00", temp: 26, condition: "clear-day" },
      { time: "18:00", temp: 23, condition: "clear-day" },
      { time: "21:00", temp: 20, condition: "clear-night" },
      { time: "00:00", temp: 18, condition: "clear-night" }
    ],
    daily: [
      { day: "Today", tempMin: 18, tempMax: 27, condition: "clear-day", desc: "Sunny" },
      { day: "Tue", tempMin: 17, tempMax: 26, condition: "clear-day", desc: "Clear" },
      { day: "Wed", tempMin: 19, tempMax: 28, condition: "cloudy", desc: "Scattered Clouds" },
      { day: "Thu", tempMin: 18, tempMax: 25, condition: "thunderstorm", desc: "Scattered T-Storms" },
      { day: "Fri", tempMin: 16, tempMax: 23, condition: "clear-day", desc: "Clear Skies" }
    ]
  },
  "tokyo": {
    name: "Tokyo",
    country: "JP",
    condition: "cloudy",
    temp: 20,
    feelsLike: 19,
    tempMin: 16,
    tempMax: 22,
    humidity: 68,
    windSpeed: 10,
    pressure: 1015,
    uvIndex: 4,
    visibility: 12,
    description: "Mostly cloudy with light breeze",
    hourly: [
      { time: "09:00", temp: 18, condition: "cloudy" },
      { time: "12:00", temp: 20, condition: "cloudy" },
      { time: "15:00", temp: 21, condition: "cloudy" },
      { time: "18:00", temp: 19, condition: "rainy" },
      { time: "21:00", temp: 17, condition: "rainy" },
      { time: "00:00", temp: 16, condition: "clear-night" }
    ],
    daily: [
      { day: "Today", tempMin: 16, tempMax: 22, condition: "cloudy", desc: "Mostly Cloudy" },
      { day: "Tue", tempMin: 15, tempMax: 20, condition: "rainy", desc: "Light Rain" },
      { day: "Wed", tempMin: 16, tempMax: 23, condition: "clear-day", desc: "Sunny" },
      { day: "Thu", tempMin: 17, tempMax: 24, condition: "clear-day", desc: "Sunny" },
      { day: "Fri", tempMin: 15, tempMax: 21, condition: "cloudy", desc: "Overcast" }
    ]
  },
  "sydney": {
    name: "Sydney",
    country: "AU",
    condition: "clear-day",
    temp: 21,
    feelsLike: 21,
    tempMin: 15,
    tempMax: 23,
    humidity: 58,
    windSpeed: 15,
    pressure: 1020,
    uvIndex: 6,
    visibility: 16,
    description: "Perfect sunny day",
    hourly: [
      { time: "09:00", temp: 17, condition: "clear-day" },
      { time: "12:00", temp: 21, condition: "clear-day" },
      { time: "15:00", temp: 22, condition: "clear-day" },
      { time: "18:00", temp: 19, condition: "clear-day" },
      { time: "21:00", temp: 17, condition: "clear-night" },
      { time: "00:00", temp: 15, condition: "clear-night" }
    ],
    daily: [
      { day: "Today", tempMin: 15, tempMax: 23, condition: "clear-day", desc: "Sunny" },
      { day: "Tue", tempMin: 14, tempMax: 22, condition: "clear-day", desc: "Clear" },
      { day: "Wed", tempMin: 13, tempMax: 21, condition: "cloudy", desc: "Partly Cloudy" },
      { day: "Thu", tempMin: 15, tempMax: 24, condition: "clear-day", desc: "Sunny" },
      { day: "Fri", tempMin: 16, tempMax: 25, condition: "clear-day", desc: "Sunny" }
    ]
  },
  "mumbai": {
    name: "Mumbai",
    country: "IN",
    condition: "thunderstorm",
    temp: 30,
    feelsLike: 36,
    tempMin: 27,
    tempMax: 32,
    humidity: 90,
    windSpeed: 24,
    pressure: 1005,
    uvIndex: 9,
    visibility: 8,
    description: "Thunderstorms and heavy rains",
    hourly: [
      { time: "09:00", temp: 28, condition: "rainy" },
      { time: "12:00", temp: 30, condition: "thunderstorm" },
      { time: "15:00", temp: 31, condition: "thunderstorm" },
      { time: "18:00", temp: 29, condition: "rainy" },
      { time: "21:00", temp: 28, condition: "rainy" },
      { time: "00:00", temp: 27, condition: "cloudy" }
    ],
    daily: [
      { day: "Today", tempMin: 27, tempMax: 32, condition: "thunderstorm", desc: "Heavy T-Storms" },
      { day: "Tue", tempMin: 26, tempMax: 31, condition: "rainy", desc: "Monsoon Rains" },
      { day: "Wed", tempMin: 26, tempMax: 31, condition: "rainy", desc: "Moderate Rain" },
      { day: "Thu", tempMin: 27, tempMax: 32, condition: "thunderstorm", desc: "Isolated Storms" },
      { day: "Fri", tempMin: 28, tempMax: 33, condition: "cloudy", desc: "Intermittent Rains" }
    ]
  },
  "reykjavik": {
    name: "Reykjavik",
    country: "IS",
    condition: "snowy",
    temp: -2,
    feelsLike: -7,
    tempMin: -5,
    tempMax: 1,
    humidity: 78,
    windSpeed: 28,
    pressure: 1002,
    uvIndex: 1,
    visibility: 9,
    description: "Light snow flurries and strong winds",
    hourly: [
      { time: "09:00", temp: -4, condition: "snowy" },
      { time: "12:00", temp: -2, condition: "snowy" },
      { time: "15:00", temp: -1, condition: "snowy" },
      { time: "18:00", temp: -3, condition: "snowy" },
      { time: "21:00", temp: -4, condition: "snowy" },
      { time: "00:00", temp: -5, condition: "clear-night" }
    ],
    daily: [
      { day: "Today", tempMin: -5, tempMax: 1, condition: "snowy", desc: "Light Snow" },
      { day: "Tue", tempMin: -6, tempMax: -1, condition: "snowy", desc: "Snow Showers" },
      { day: "Wed", tempMin: -4, tempMax: 2, condition: "cloudy", desc: "Overcast" },
      { day: "Thu", tempMin: -3, tempMax: 1, condition: "snowy", desc: "Sleet / Snow" },
      { day: "Fri", tempMin: -5, tempMax: 0, condition: "clear-day", desc: "Cold and Clear" }
    ]
  }
};

// Helper to capitalize words
const capitalize = (str) => str.replace(/\b\w/g, c => c.toUpperCase());

// --- WEATHER ICON COMPONENT (ANIMATED SVGS) ---
const WeatherIcon = ({ type, size = 64 }) => {
  const getIcon = () => {
    switch (type) {
      case "clear-day":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-spin-slow">
            <circle cx="32" cy="32" r="12" fill="#eab308" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <line
                key={idx}
                x1="32"
                y1="8"
                x2="32"
                y2="16"
                stroke="#eab308"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${angle} 32 32)`}
              />
            ))}
          </svg>
        );
      case "clear-night":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-pulse-soft">
            <path
              d="M24 16C24 28 34 38 46 38C48.5 38 50.8 37.5 53 36.6C50 45.4 41.5 51.6 31.5 51.6C19.6 51.6 10 42 10 30C10 18.5 19 9 30.2 8C26.3 10.1 24 12.8 24 16Z"
              fill="#c084fc"
            />
            <circle cx="48" cy="14" r="1.5" fill="#fff" />
            <circle cx="40" cy="22" r="2.5" fill="#fff" className="animate-bounce-slow" />
            <circle cx="18" cy="22" r="1" fill="#fff" />
          </svg>
        );
      case "cloudy":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-float">
            <path
              d="M44 26C44 21.6 40.4 18 36 18C34.3 18 32.7 18.7 31.6 19.8C29.6 16.3 25.8 14 21.5 14C15.2 14 10 19.2 10 25.5C10 25.7 10 25.8 10 26C6.6 27.2 4 30.4 4 34.2C4 39.1 8 43 12.8 43H43.2C48.1 43 52 39.1 52 34.2C52 30 48.4 26.6 44 26Z"
              fill="#cbd5e1"
            />
            <path
              d="M48.5 32C48.5 28.7 45.8 26 42.5 26C41.2 26 40 26.5 39.2 27.3C37.7 24.7 34.9 23 31.7 23C27 23 23.1 26.9 23.1 31.6C23.1 31.7 23.1 31.9 23.1 32C20.6 32.9 18.6 35.3 18.6 38.2C18.6 41.9 21.6 44.9 25.2 44.9H47.9C51.6 44.9 54.6 41.9 54.6 38.2C54.6 35 52 32.5 48.5 32Z"
              fill="#94a3b8"
              opacity="0.85"
            />
          </svg>
        );
      case "rainy":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-float">
            <path
              d="M44 24C44 19.6 40.4 16 36 16C34.3 16 32.7 16.7 31.6 17.8C29.6 14.3 25.8 12 21.5 12C15.2 12 10 17.2 10 23.5C10 23.7 10 23.8 10 24C6.6 25.2 4 28.4 4 32.2C4 37.1 8 41 12.8 41H43.2C48.1 41 52 37.1 52 32.2C52 28 48.4 24.6 44 24Z"
              fill="#475569"
            />
            {/* Falling rain drops */}
            {[
              { x: 16, y1: 44, y2: 52, delay: "0s" },
              { x: 26, y1: 46, y2: 54, delay: "0.2s" },
              { x: 36, y1: 44, y2: 52, delay: "0.4s" },
              { x: 44, y1: 47, y2: 55, delay: "0.1s" }
            ].map((drop, idx) => (
              <line
                key={idx}
                x1={drop.x}
                y1={drop.y1}
                x2={drop.x - 2}
                y2={drop.y2}
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.85"
                style={{
                  animation: `bounce-slow 1.2s ease-in-out infinite`,
                  animationDelay: drop.delay
                }}
              />
            ))}
          </svg>
        );
      case "snowy":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-float">
            <path
              d="M44 24C44 19.6 40.4 16 36 16C34.3 16 32.7 16.7 31.6 17.8C29.6 14.3 25.8 12 21.5 12C15.2 12 10 17.2 10 23.5C10 23.7 10 23.8 10 24C6.6 25.2 4 28.4 4 32.2C4 37.1 8 41 12.8 41H43.2C48.1 41 52 37.1 52 32.2C52 28 48.4 24.6 44 24Z"
              fill="#64748b"
            />
            {/* Falling/Spinning Snowflakes */}
            {[
              { x: 18, y: 46, delay: "0s" },
              { x: 28, y: 49, delay: "0.3s" },
              { x: 38, y: 45, delay: "0.6s" }
            ].map((snow, idx) => (
              <g
                key={idx}
                transform={`translate(${snow.x} ${snow.y})`}
                style={{
                  animation: `bounce-slow 2s ease-in-out infinite`,
                  animationDelay: snow.delay
                }}
              >
                <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
                <path d="M-4 0 H4 M0 -4 V4" stroke="#f8fafc" strokeWidth="1" />
              </g>
            ))}
          </svg>
        );
      case "thunderstorm":
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="animate-float">
            <path
              d="M44 24C44 19.6 40.4 16 36 16C34.3 16 32.7 16.7 31.6 17.8C29.6 14.3 25.8 12 21.5 12C15.2 12 10 17.2 10 23.5C10 23.7 10 23.8 10 24C6.6 25.2 4 28.4 4 32.2C4 37.1 8 41 12.8 41H43.2C48.1 41 52 37.1 52 32.2C52 28 48.4 24.6 44 24Z"
              fill="#27272a"
            />
            {/* Lightning bolt */}
            <path
              d="M26 38 L34 46 L29 47 L36 56 L34 57 L28 49 L32 48 Z"
              fill="#eab308"
              style={{
                animation: `pulse-soft 1s steps(2, start) infinite`
              }}
            />
            {/* Raindrops */}
            <line x1="16" y1="44" x2="14" y2="50" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="44" x2="40" y2="50" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="12" fill="#eab308" />
          </svg>
        );
    }
  };

  return <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>{getIcon()}</div>;
};

// --- PROCEDURAL WEATHER GENERATOR (FALLBACK) ---
const generateProceduralWeather = (cityName) => {
  const cleanName = cityName.trim().toLowerCase();
  
  // Calculate a simple deterministic hash code from city name
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Determine weather condition index based on hash value
  const conditions = ["clear-day", "clear-day", "cloudy", "rainy", "snowy", "thunderstorm", "cloudy", "rainy"];
  const condition = conditions[hash % conditions.length];

  // Set temperatures dynamically based on condition
  let tempBase = 15;
  let tempRange = 10;
  if (condition === "clear-day") { tempBase = 26; tempRange = 12; }
  else if (condition === "snowy") { tempBase = -2; tempRange = 8; }
  else if (condition === "thunderstorm") { tempBase = 28; tempRange = 6; }
  
  const temp = Math.round(tempBase + (hash % tempRange) - (tempRange / 2));
  const tempMin = Math.round(temp - 3 - (hash % 4));
  const tempMax = Math.round(temp + 4 + (hash % 5));
  const feelsLike = Math.round(temp + (condition === "thunderstorm" ? 4 : -1));
  const humidity = 40 + (hash % 55);
  const windSpeed = 5 + (hash % 30);
  const pressure = 990 + (hash % 35);
  const uvIndex = condition === "clear-day" ? Math.max(1, 10 - (hash % 4)) : Math.max(1, 4 - (hash % 3));
  const visibility = condition === "rainy" || condition === "snowy" ? 6 + (hash % 4) : 12 + (hash % 5);

  const descMap = {
    "clear-day": ["Sunny Skies", "Clear and Sunny", "Mostly Sunny"],
    "clear-night": ["Clear Night", "Crisp Night Air", "Starlit Sky"],
    "cloudy": ["Partly Cloudy", "Overcast Skies", "Scattered Clouds"],
    "rainy": ["Light Passing Showers", "Overcast with Rain", "Steady Drizzle"],
    "snowy": ["Moderate Snowfall", "Light Snow Flurries", "Powder Snow"],
    "thunderstorm": ["Thunderstorms Nearby", "Severe T-Storms", "Heavy Rain with Thunder"]
  };
  const descriptionList = descMap[condition] || ["Overcast"];
  const description = descriptionList[hash % descriptionList.length];

  // Hourly trend generator
  const hourList = ["09:00", "12:00", "15:00", "18:00", "21:00", "00:00"];
  const hourly = hourList.map((time, idx) => {
    // Temp peak around 15:00
    const offset = idx === 0 ? -2 : idx === 1 ? 1 : idx === 2 ? 3 : idx === 3 ? 1 : idx === 4 ? -2 : -4;
    return {
      time,
      temp: temp + offset,
      condition: idx >= 4 ? (condition === "clear-day" ? "clear-night" : condition) : condition
    };
  });

  // Daily forecast generator
  const days = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daily = Array.from({ length: 5 }).map((_, idx) => {
    const dName = days[idx];
    const dCond = conditions[(hash + idx) % conditions.length];
    const dTemp = temp + (idx % 3) - 1;
    return {
      day: dName,
      tempMin: dTemp - 4,
      tempMax: dTemp + 3,
      condition: dCond,
      desc: capitalize(dCond.replace("-", " "))
    };
  });

  return {
    name: capitalize(cityName),
    country: "LOC",
    condition,
    temp,
    feelsLike,
    tempMin,
    tempMax,
    humidity,
    windSpeed,
    pressure,
    uvIndex,
    visibility,
    description,
    hourly,
    daily
  };
};

// Map WMO Weather Codes to Visual Conditions
const mapWmoToCondition = (code, isDay = true) => {
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) return "rainy";
  if ([66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "cloudy";
};

// Map WMO Weather Codes to Description Text
const mapWmoToDescription = (code) => {
  const mapping = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Severe Thunderstorm with Hail"
  };
  return mapping[code] || "Overcast";
};

export default function Weather() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("new york");
  const [weatherData, setWeatherData] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const storedHistory = localStorage.getItem("weather_recent_searches");
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    const defaultHistory = ["New York", "London", "Tokyo", "Sydney"];
    localStorage.setItem("weather_recent_searches", JSON.stringify(defaultHistory));
    return defaultHistory;
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("weather_api_key") || "";
  });
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);

  // Convert Celsius to Fahrenheit
  const formatTemp = (celsius) => {
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  // Add search term to history (max 5)
  const addToHistory = (cityName) => {
    const formatted = capitalize(cityName.trim());
    let history = [...recentSearches];
    history = history.filter(item => item.toLowerCase() !== formatted.toLowerCase());
    history.unshift(formatted);
    history = history.slice(0, 5);
    setRecentSearches(history);
    localStorage.setItem("weather_recent_searches", JSON.stringify(history));
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("weather_recent_searches");
  };

  // Autocomplete Suggestions logic
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const allCities = Object.keys(MOCK_CITIES).map(key => MOCK_CITIES[key].name);
      const filtered = allCities.filter(city =>
        city.toLowerCase().startsWith(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Save API key
  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("weather_api_key", key);
    isApiSettingsOpen && setIsApiSettingsOpen(false);
  };

  // Clear API key
  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem("weather_api_key");
  };

  // Sync background gradient class on <body> depending on current weather condition
  useEffect(() => {
    if (!weatherData) return;
    
    // Reset any previous condition classes
    document.body.className = "";
    
    const condition = weatherData.condition;
    if (condition === "clear-day") {
      document.body.classList.add("clear-day");
    } else if (condition === "clear-night") {
      document.body.classList.add("clear-night");
    } else if (condition === "cloudy") {
      document.body.classList.add("cloudy");
    } else if (condition === "rainy") {
      document.body.classList.add("rainy");
    } else if (condition === "snowy") {
      document.body.classList.add("snowy");
    } else if (condition === "thunderstorm") {
      document.body.classList.add("thunderstorm");
    }
  }, [weatherData]);

  // Fetch weather data (Real API OR Simulated fallbacks)
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    const query = city.trim().toLowerCase();

    try {
      if (apiKey) {
        // Fetch from OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error("City not found or invalid API Key");
        }

        const data = await response.json();
        
        // Fetch forecast data too
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();

        // Map condition mapping to our simple types
        const weatherId = data.weather[0].id;
        let mappedCondition = "cloudy";
        if (weatherId === 800) {
          // Check if night
          const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;
          mappedCondition = isNight ? "clear-night" : "clear-day";
        } else if (weatherId >= 200 && weatherId < 300) {
          mappedCondition = "thunderstorm";
        } else if (weatherId >= 300 && weatherId < 600) {
          mappedCondition = "rainy";
        } else if (weatherId >= 600 && weatherId < 700) {
          mappedCondition = "snowy";
        }

        // Parse hourly forecast (first 6 periods of 3 hours)
        const hourly = forecastData.list.slice(0, 6).map((item) => {
          const date = new Date(item.dt * 1000);
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const hourlyWeatherId = item.weather[0].id;
          let hCondition = "cloudy";
          if (hourlyWeatherId === 800) hCondition = "clear-day";
          else if (hourlyWeatherId >= 200 && hourlyWeatherId < 300) hCondition = "thunderstorm";
          else if (hourlyWeatherId >= 300 && hourlyWeatherId < 600) hCondition = "rainy";
          else if (hourlyWeatherId >= 600 && hourlyWeatherId < 700) hCondition = "snowy";

          return {
            time,
            temp: Math.round(item.main.temp),
            condition: hCondition
          };
        });

        // Parse daily forecast (every 8th item representing ~24h intervals)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daily = forecastData.list.filter((_, idx) => idx % 8 === 0).slice(0, 5).map((item, index) => {
          const date = new Date(item.dt * 1000);
          const day = index === 0 ? "Today" : days[date.getDay()];
          const dailyWeatherId = item.weather[0].id;
          let dCondition = "cloudy";
          if (dailyWeatherId === 800) dCondition = "clear-day";
          else if (dailyWeatherId >= 200 && dailyWeatherId < 300) dCondition = "thunderstorm";
          else if (dailyWeatherId >= 300 && dailyWeatherId < 600) dCondition = "rainy";
          else if (dailyWeatherId >= 600 && dailyWeatherId < 700) dCondition = "snowy";

          return {
            day,
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
            condition: dCondition,
            desc: capitalize(item.weather[0].description)
          };
        });

        setWeatherData({
          name: data.name,
          country: data.sys.country,
          condition: mappedCondition,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          tempMin: Math.round(data.main.temp_min),
          tempMax: Math.round(data.main.temp_max),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          pressure: data.main.pressure,
          uvIndex: 5, // OpenWeatherMap default current doesn't always have UV index on basic API tier
          visibility: Math.round(data.visibility / 1000), // Convert m to km
          description: capitalize(data.weather[0].description),
          hourly,
          daily
        });
      } else {
        // Fetch from Open-Meteo free keyless API
        // 1. Geocoding coordinates lookup
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
        );
        if (!geoResponse.ok) {
          throw new Error("Geocoding lookup failed");
        }
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("City not found");
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const name = location.name;
        const country = location.country_code || "LOC";

        // 2. Query forecast & metrics
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
        const weatherResponse = await fetch(forecastUrl);
        if (!weatherResponse.ok) {
          throw new Error("Weather forecast lookup failed");
        }
        const wData = await weatherResponse.json();

        // 3. Map API results
        const currentData = wData.current;
        const isDay = currentData.is_day === 1;
        const mappedCondition = mapWmoToCondition(currentData.weather_code, isDay);
        const description = mapWmoToDescription(currentData.weather_code);

        // Find nearest hour for current visibility lookup
        const now = new Date();
        const hourlyTimes = wData.hourly.time;
        let startIndex = 0;
        let minDiff = Infinity;
        for (let idx = 0; idx < hourlyTimes.length; idx++) {
          const diff = Math.abs(new Date(hourlyTimes[idx]) - now);
          if (diff < minDiff) {
            minDiff = diff;
            startIndex = idx;
          }
        }

        // Map hourly (next 6 periods separated by 3 hours)
        const hourly = [];
        for (let i = 0; i < 6; i++) {
          const targetIdx = startIndex + i * 3;
          if (targetIdx < hourlyTimes.length) {
            const hTimeStr = hourlyTimes[targetIdx];
            const dateObj = new Date(hTimeStr);
            const timeLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const hHour = dateObj.getHours();
            const hIsDay = hHour >= 6 && hHour < 19;
            hourly.push({
              time: timeLabel,
              temp: Math.round(wData.hourly.temperature_2m[targetIdx]),
              condition: mapWmoToCondition(wData.hourly.weather_code[targetIdx], hIsDay)
            });
          }
        }

        // Map daily (5 days)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daily = [];
        for (let i = 0; i < 5; i++) {
          const dTimeStr = wData.daily.time[i];
          const dateObj = new Date(dTimeStr);
          const dayLabel = i === 0 ? "Today" : days[dateObj.getDay()];
          daily.push({
            day: dayLabel,
            tempMin: Math.round(wData.daily.temperature_2m_min[i]),
            tempMax: Math.round(wData.daily.temperature_2m_max[i]),
            condition: mapWmoToCondition(wData.daily.weather_code[i], true),
            desc: mapWmoToDescription(wData.daily.weather_code[i])
          });
        }

        const visibilityRaw = wData.hourly.visibility ? wData.hourly.visibility[startIndex] : 10000;
        const uvIndexRaw = wData.daily.uv_index_max ? wData.daily.uv_index_max[0] : 4;

        setWeatherData({
          name,
          country,
          condition: mappedCondition,
          temp: Math.round(currentData.temperature_2m),
          feelsLike: Math.round(currentData.apparent_temperature),
          tempMin: Math.round(wData.daily.temperature_2m_min[0]),
          tempMax: Math.round(wData.daily.temperature_2m_max[0]),
          humidity: currentData.relative_humidity_2m,
          windSpeed: Math.round(currentData.wind_speed_10m),
          pressure: Math.round(currentData.pressure_msl),
          uvIndex: Math.round(uvIndexRaw),
          visibility: Math.round(visibilityRaw / 1000), // Convert m to km
          description,
          hourly,
          daily
        });
      }
      
      setCurrentCity(query);
      addToHistory(capitalize(city));
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch live weather (${err.message}). Fallback to offline simulator.`);
      // Fall back to simulation instantly
      setWeatherData(MOCK_CITIES[query] || generateProceduralWeather(query));
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWeather(currentCity);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- DRAW HOURLY TREND LINE CHART ON CANVAS ---
  useEffect(() => {
    if (!weatherData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Make crisp on HighDPI/Retina screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    const hourly = weatherData.hourly;
    const pointsCount = hourly.length;

    // Calculate chart positions
    const paddingX = 40;
    const paddingY = 35;
    const graphWidth = width - paddingX * 2;
    const graphHeight = height - paddingY * 2;

    const temps = hourly.map(h => isFahrenheit ? (h.temp * 9)/5 + 32 : h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = (maxTemp - minTemp) || 1; // Avoid divide by 0 if all temps match

    const points = hourly.map((item, idx) => {
      const val = isFahrenheit ? (item.temp * 9)/5 + 32 : item.temp;
      const x = paddingX + (idx / (pointsCount - 1)) * graphWidth;
      const y = paddingY + graphHeight - ((val - minTemp) / tempRange) * graphHeight;
      return { x, y, val: Math.round(val), label: item.time };
    });

    // 1. Draw gradient background below the line
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#38bdf8';
    const fillGradient = ctx.createLinearGradient(0, paddingY, 0, height - paddingY);
    fillGradient.addColorStop(0, accentColor + '40'); // 25% opacity
    fillGradient.addColorStop(1, accentColor + '00'); // Transparent

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - paddingY);
    ctx.lineTo(points[0].x, height - paddingY);
    ctx.closePath();
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // 2. Draw smooth Bezier line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3. Draw points, temperature labels, and time labels
    points.forEach((point) => {
      // Draw point circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw temp text (above point)
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 13px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(`${point.val}°`, point.x, point.y - 10);

      // Draw time label (below graph)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '400 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, point.x, height - 8);
    });

  }, [weatherData, isFahrenheit]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER WIDGET */}
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'inherit', letterSpacing: '-0.8px' }}>
            AeroCast
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.75 }}>Premium Weather Dashboard</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Unit Toggle Button */}
          <button
            onClick={() => setIsFahrenheit(!isFahrenheit)}
            className="glass-card"
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--glass-border)',
              borderRadius: '14px',
              color: 'inherit'
            }}
          >
            {isFahrenheit ? "°C" : "°F"}
          </button>

          {/* Settings trigger */}
          <button
            onClick={() => setIsApiSettingsOpen(!isApiSettingsOpen)}
            className="glass-card"
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              color: 'inherit'
            }}
            aria-label="API Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* API KEY DRAWER PANEL */}
      {isApiSettingsOpen && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>API Provider Settings</h3>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Configure an OpenWeatherMap API Key to fetch live real-time conditions. Leave empty to use local simulated data.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="password"
              placeholder="Paste OpenWeatherMap API Key..."
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0, 0, 0, 0.15)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {apiKey && (
              <button
                onClick={clearApiKey}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset Key
              </button>
            )}
          </div>
        </div>
      )}

      {/* SEARCH AND SUGGESTION AUTOCOMPLETE */}
      <section style={{ position: 'relative' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              fetchWeather(searchQuery);
              setSearchQuery("");
              setSuggestions([]);
            }
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for cities (e.g. London, Mumbai, Tokyo...)"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                paddingLeft: '48px',
                borderRadius: '18px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'inherit',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.6
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <button
            type="submit"
            className="glass-card"
            style={{
              padding: '0 24px',
              borderRadius: '18px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '15px',
              border: '1px solid var(--glass-border)',
              color: 'inherit'
            }}
          >
            Search
          </button>
        </form>

        {/* Suggestion dropdown box */}
        {suggestions.length > 0 && (
          <ul
            className="glass-card"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              zIndex: 50,
              listStyle: 'none',
              padding: '8px',
              margin: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            {suggestions.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => {
                    fetchWeather(item);
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    color: 'inherit',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.15)')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* RECENT SEARCH PILLS */}
      {recentSearches.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', opacity: 0.65 }}>Recents:</span>
          {recentSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => fetchWeather(item)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {item}
            </button>
          ))}
          <button
            onClick={clearHistory}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              opacity: 0.5,
              fontSize: '12px',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            Clear History
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="animate-spin-slow" style={{ fontSize: '32px', display: 'inline-block', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>Retrieving latest reports...</p>
        </div>
      )}

      {/* ERROR MESSAGE NOTIFICATION */}
      {error && !loading && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#ffffff'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* WEATHER DASHBOARD CONTENT */}
      {weatherData && !loading && (
        <main style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* TOP SECTION: CURRENT STATS & FORECAST CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* CURRENT WEATHER LARGE HERO CARD */}
            <div className="glass-card animate-pulse-soft" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '42px', fontWeight: 700, margin: 0, color: 'inherit' }}>
                    {weatherData.name}
                  </h2>
                  <span style={{ fontSize: '14px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {weatherData.country}
                  </span>
                </div>
                <WeatherIcon type={weatherData.condition} size={72} />
              </div>

              <div style={{ margin: '24px 0' }}>
                <span style={{ fontSize: '80px', fontWeight: 300, lineHeight: 1, letterSpacing: '-3px' }}>
                  {formatTemp(weatherData.temp)}
                </span>
                <p style={{ fontSize: '18px', fontWeight: 500, margin: '8px 0 0' }}>
                  {weatherData.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', fontSize: '14px', opacity: 0.85 }}>
                <div>Feels Like: <strong>{formatTemp(weatherData.feelsLike)}</strong></div>
                <div>Low: <strong>{formatTemp(weatherData.tempMin)}</strong></div>
                <div>High: <strong>{formatTemp(weatherData.tempMax)}</strong></div>
              </div>
            </div>

            {/* 5-DAY WEATHER FORECAST LIST */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                5-Day Forecast
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
                {weatherData.daily.map((dayItem, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '15px' }}>
                    <span style={{ width: '80px', fontWeight: 500 }}>{dayItem.day}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
                      <WeatherIcon type={dayItem.condition} size={28} />
                      <span style={{ fontSize: '13px', opacity: 0.7, display: 'inline-block', width: '110px', textAlign: 'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {dayItem.desc}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', width: '80px', justifyContent: 'flex-end', fontWeight: 600 }}>
                      <span style={{ opacity: 0.6 }}>{formatTemp(dayItem.tempMin)}</span>
                      <span>{formatTemp(dayItem.tempMax)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: HOURLY CHART CARD */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Hourly Temperature Trend</h3>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>24-Hour Forecast</span>
            </div>
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          </div>

          {/* BOTTOM SECTION: METRICS MATRIX GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            
            {/* Humidity */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
                💧 <span>Humidity</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{weatherData.humidity}%</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>The dew point is 12° right now.</div>
            </div>

            {/* Wind speed */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
                💨 <span>Wind</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{weatherData.windSpeed} km/h</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>Moderate gusts blowing north.</div>
            </div>

            {/* Pressure */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🧭 <span>Pressure</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{weatherData.pressure} hPa</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>Standard atmospheric range.</div>
            </div>

            {/* UV Index */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ☀️ <span>UV Index</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{weatherData.uvIndex}</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>
                {weatherData.uvIndex <= 2 ? "Low danger level." : weatherData.uvIndex <= 5 ? "Moderate levels." : "High UV levels."}
              </div>
            </div>

            {/* Visibility */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
                👁️ <span>Visibility</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{weatherData.visibility} km</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>Perfect clear distance horizon.</div>
            </div>
            
          </div>

        </main>
      )}
    </div>
  );
}
