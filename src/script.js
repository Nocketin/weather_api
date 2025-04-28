const apiKey = "dbff882a531c01c5ad91a6287cfe68f1";

function removeLeadingSpaces(input) {
  input.value = input.value.replace(/^\s+/, "");
}


function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("weatherResult");

  if (city.trim() === "") {
    resultDiv.innerHTML = `<div class="emptyInput"><h2>Введите название города!</h2></div>`;
    return;
  }

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city.trim()
    )}&limit=5&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при поиске города");
      }
      return response.json();
    })
    .then((cities) => {
      if (cities.length === 0) {
        resultDiv.innerHTML = `<div class="error-message">Город не найден</div>`;
        return;
      }

      resultDiv.innerHTML = ""; // очищаем перед новым выводом

      cities.forEach((cityData) => {
        const { lat, lon, name, country, state } = cityData;

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`
        )
          .then((response) => response.json())
          .then((data) => {
            const temp = data.main.temp;
            const weather = data.weather[0].description;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const wind = data.wind.speed;
            const feelsLike = data.main.feels_like;

            resultDiv.innerHTML += `
          <div class="weather-card">
            <h2>${name}${state ? `, ${state}` : ""} (${country})</h2>
            <p><strong>Температура:</strong> ${temp}°C (ощущается как ${feelsLike}°C)</p>
            <p><strong>Погода:</strong> ${weather}</p>
            <p><strong>Влажность:</strong> ${humidity}%</p>
            <p><strong>Давление:</strong> ${pressure} мм рт.ст.</p>
            <p><strong>Ветер:</strong> ${wind} м/с</p>
          </div>
        `;
          });
      });
    })
    .catch((error) => {
      resultDiv.innerHTML = `<div class="error-message">Ошибка: ${error.message}</div>`;
    });
}
