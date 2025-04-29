function removeLeadingSpaces(input) {
  input.value = input.value.replace(/^\s+/, "");
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (city === "") {
    resultDiv.innerHTML = "Введите название города!";
    return;
  }

  fetch(`/cities?city=${encodeURIComponent(city)}`)
    .then((response) => response.json())
    .then((cities) => {
      if (cities.length === 0) {
        resultDiv.innerHTML = "<div class='error-message'>Город не найден</div>";
        return;
      }

      resultDiv.innerHTML = "";

      cities.forEach((data) => {
        resultDiv.innerHTML += `
          <div class="weather-card">
            <h2>${data.name}${data.state ? `, ${data.state}` : ""} (${
          data.country
        })</h2>
            <p><strong>Температура:</strong> ${data.temp}°C (ощущается как ${
          data.feelsLike
        }°C)</p>
            <p><strong>Погода:</strong> ${data.weather}</p>
            <p><strong>Влажность:</strong> ${data.humidity}%</p>
            <p><strong>Давление:</strong> ${data.pressure} мм рт.ст.</p>
            <p><strong>Ветер:</strong> ${data.wind} м/с</p>
          </div>
        `;
      });
    })
    .catch(() => {
      resultDiv.innerHTML = "<div class='error-message'>Ошибка при загрузке данных</div>";
    });
}
