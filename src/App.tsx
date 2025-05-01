
import React, { useState, useEffect } from "react";
import { API_KEY } from "./config";
import Lottie from "lottie-react";
import sunnyAnim from "./assets/lottie/sunny.json";
import rainyAnim from "./assets/lottie/rainy.json";
import cloudyAnim from "./assets/lottie/cloudy.json";
import snowyAnim from "./assets/lottie/snowy.json";

const App: React.FC = () => {
  const [city, setCity] = useState("Islamabad");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightweight, setLightweight] = useState(false);
  const [bgImage, setBgImage] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
      );
      const data = await response.json();
      setWeather(data);
      setForecast(data.forecast.forecastday);
      const condition = data.current.condition.text.toLowerCase();
      if (condition.includes("sun")) {
        setBgImage("/backgrounds/sunny.jpg");
      } else if (condition.includes("rain")) {
        setBgImage("/backgrounds/rainy.jpg");
      } else if (condition.includes("cloud")) {
        setBgImage("/backgrounds/cloudy.jpg");
      } else if (condition.includes("snow")) {
        setBgImage("/backgrounds/snowy.jpg");
      } else {
        setBgImage("/backgrounds/default.jpg");
      }
    } catch (err) {
      setError("Failed to load weather.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getAnimation = () => {
    if (!weather) return null;
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("sun")) return sunnyAnim;
    if (condition.includes("rain")) return rainyAnim;
    if (condition.includes("cloud")) return cloudyAnim;
    if (condition.includes("snow")) return snowyAnim;
    return null;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage || "/backgrounds/card-bg.png"})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}
    >
      <div className="bg-transparent rounded-xl shadow-xl p-6 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">WeatherMate</h1>
        <div className="flex justify-center gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-2/3"
            placeholder="Enter city"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get
          </button>
        </div>
        <label className="block text-sm mb-4">
          <input
            type="checkbox"
            checked={lightweight}
            onChange={() => setLightweight(!lightweight)}
            className="mr-2"
          />
          Lightweight mode
        </label>
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : weather ? (
          <>
            <h2 className="text-xl font-semibold">{weather.location.name}, {weather.location.country}</h2>
            <p className="text-4xl font-bold">{weather.current.temp_c}°C</p>
            <p className="capitalize text-lg">{weather.current.condition.text}</p>
            {!lightweight && getAnimation() && (
              <div className="w-full flex justify-center mb-2">
                <div className="w-[120px] h-[120px]">
                  <Lottie animationData={getAnimation()} loop autoplay style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            )}
            <img className="mx-auto mt-2" src={weather.current.condition.icon} alt="icon" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {forecast.map((day, i) => (
                <div key={i} className="bg-blue-500 bg-opacity-30 text-white rounded p-2">
                  <p className="font-semibold">{new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <img src={day.day.condition.icon} className="mx-auto" alt="icon" />
                  <p>{day.day.avgtemp_c}°C</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Enter a city to see weather</p>
        )}
      </div>
    </div>
  );
};

export default App;
