import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "411c325bc3f51054aaacb338e1f36af3";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    fetchWeatherByLocation();
    updateDateTime();
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    setDateTime(now.toLocaleString());
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setError("Could not get location");
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  };

  const fetchCurrentWeatherByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (res.ok) {
        setCurrentLocationWeather(data);
        setError("");
      } else {
        setError("Unable to fetch current location weather");
      }
    } catch (err) {
      setError("Error fetching weather data");
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (res.ok) {
        setWeather(data);
        setError("");
      } else {
        setError("City not found!");
      }
    } catch (err) {
      setError("Error fetching weather data");
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Weather App 🌤️</h1>
        {currentLocationWeather && (
          <div className="current-location">
            📍 {currentLocationWeather.name}, {currentLocationWeather.sys.country} | 🌡️{" "}
            {currentLocationWeather.main.temp}°C
          </div>
        )}
      </div>

      <p className="datetime">{dateTime}</p>

      <div className="search">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeatherByCity}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            📍 {weather.name}, {weather.sys?.country}
          </h2>
          <p>🌡️ Temp: {weather.main.temp} °C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
          <p>☁️ Description: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
