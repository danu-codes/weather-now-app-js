const searchButton = document.querySelector("#search-btn");
const printCity = document.querySelector(".city");
const printTemp = document.querySelector(".temp");
const weatherIcon = document.querySelector(".weather-icon");
const daysContainer = document.querySelector(".days-container");
const API_KEY = "867dad60357107a4a41cac26edf0a1a1";

window.addEventListener("DOMContentLoaded", () => {
    getWeather("colombo");
    getForecast("colombo");
});

searchButton.addEventListener("click", () => {
    const city = document.querySelector("#search").value.trim();

    if (city !== "") {
        getWeather(city);
        getForecast(city);
    }
});

async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            alert("City not found ❌");
            return;
        }

        console.log(data.main.temp);

        displayWeather(data, city);
        changeBackground(data.weather[0].main);

    } catch (error) {
        alert("Error fetching data ❌");
    }
}

function displayWeather(data, city) {
    const temp = data.main.temp;
    const condition = data.weather[0].main;

    printCity.textContent = "📍 " + city.toUpperCase() + ", " + data.sys.country;
    printTemp.textContent = "🌡" + temp + "°C";

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    let today = new Date();

    document.querySelector(".date").textContent = "📆 " + days[today.getDay()] + ", " + today.getDate() + " " + months[today.getMonth()];

    document.querySelector(".weather-icon").textContent = getWeatherIcon(condition);

    document.querySelector(".weather-description").textContent =
        data.weather[0].description.toUpperCase();

    document.querySelector(".humidity").textContent =
        "Humidity: " + data.main.humidity + "%";

    document.querySelector(".wind").textContent =
        "Wind: " + data.wind.speed + " km/h";

    document.querySelector(".feels").textContent =
        "Feels: " + data.main.feels_like + "°C";
}

function changeBackground(weather) {
    const card1 = document.querySelector(".current-weather-card");
    const card2 = document.querySelector(".weather-details-container");


    if (weather === "Clear") {
        card1.style.background = "#FFEBAA";
        card2.style.background = "#FFF7D6";

    } else if (weather === "Clouds") {
        card1.style.background = "#C3CDD7";
        card2.style.background = "#E2E7EC";

    } else if (weather === "Rain") {
        card1.style.background = "#A5C9FF";
        card2.style.background = "#D4E4FF";

    } else if (weather === "Snow") {
        card1.style.background = "#E8F4FF";
        card2.style.background = "#F6FBFF";

    } else if (weather === "Thunderstorm") {
        card1.style.background = "#5A6473";
        card2.style.background = "#A5AEBB";

    } else {
        card1.style.background = "#DFF7F7";
        card2.style.background = "#ECFFFF";
    }

}

function getWeatherIcon(condition) {
    const icons = {
        "Clear": "☀️",
        "Clouds": "☁️",
        "Rain": "🌧️",
        "Drizzle": "🌦️",
        "Thunderstorm": "⛈️",
        "Snow": "❄️",
        "Mist": "🌫️",
        "Fog": "🌫️",
        "Haze": "🌫️",
        "Smoke": "🌫️",
        "Dust": "🌫️",
        "Sand": "🌫️",
        "Ash": "🌫️",
        "Squall": "🌪️",
        "Tornado": "🌪️"
    };

    return icons[condition] || "🌈";

}


async function getForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            alert("City not found ❌");
            return;
        }

        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}



function displayForecast(data) {

    daysContainer.innerHTML = "";

    const dailyForecast = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = item.weather[0].main;
        }
    });


    Object.keys(dailyForecast).forEach((date, index) => {
        if (index >= 7) return; // Limit to 7 days if needed
        const weatherMain = dailyForecast[date];

        const dayCard = document.createElement("div");
        dayCard.classList.add("day");

        let icon = "❓";
        if (weatherMain === "Clear") icon = "☀️";
        else if (weatherMain === "Clouds") icon = "☁️";
        else if (weatherMain === "Rain") icon = "🌧️";
        else if (weatherMain === "Snow") icon = "❄️";
        else if (weatherMain === "Thunderstorm") icon = "⛈️";

        dayCard.innerHTML = `
            <div class="day-name">${new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
            <div class="weather-desc">${icon}</div>
        `;

        daysContainer.appendChild(dayCard);
    });
}
