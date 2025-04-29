const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "src")));

app.get("/cities", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "Введите название города" });
  }

  try {
    const geoResponse = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: city,
          limit: 5,
          appid: process.env.API_KEY,
        },
      }
    );

    const cities = geoResponse.data;

    if (cities.length === 0) {
      return res.json([]);
    }

    const weatherDataPromises = cities.map((cityData) =>
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: cityData.lat,
          lon: cityData.lon,
          appid: process.env.API_KEY,
          units: "metric",
          lang: "ru",
        },
      })
    );

    const weatherResponses = await Promise.all(weatherDataPromises);

    const weatherData = weatherResponses.map((weatherResponse, index) => {
      const w = weatherResponse.data;
      const c = cities[index];
      return {
        name: c.name,
        state: c.state || null,
        country: c.country,
        temp: w.main.temp,
        feelsLike: w.main.feels_like,
        weather: w.weather[0].description,
        humidity: w.main.humidity,
        pressure: w.main.pressure,
        wind: w.wind.speed,
      };
    });

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки данных" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
