const form = document.getElementById("travel-form");
const resultSection = document.getElementById("results");
const loader = document.getElementById("loader");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user inputs
  const input = document.getElementById("destination-input").value.trim();
  const duration = document.getElementById("duration").value;
  const travelType = document.getElementById("travel-type").value;

  if (!input) return;

  resultSection.style.display = "block";
  loader.style.display = "block";

  try {
    // 1️⃣ Fetch weather data from OpenWeather
    const weatherApiKey = "1f1a9ad5df06a35ab6239e4b0146075d";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${weatherApiKey}`;
    console.log("Fetching weather from:", weatherUrl);

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    console.log("Weather API response:", weatherData);

    let weatherSummary = "Weather data not available";
    let temp = null;

    if (weatherData.cod === 200) { // Check if API returned success
      temp = weatherData.main.temp;
      const conditions = weatherData.weather[0].description;
      weatherSummary = `Temperature: ${temp}°C, Conditions: ${conditions}`;
    } else {
      console.error("Weather API Error:", weatherData.message);
    }

    // 2️⃣ Decide if destination is suitable
    let suitability = "";
    if (temp !== null) {
      if (temp < 10) {
        suitability = "❄️ It's quite cold, pack warm clothes!";
      } else if (temp < 20) {
        suitability = "🧥 Mild weather, might be chilly for outdoor activities.";
      } else if (temp < 30) {
        suitability = "☀️ Great weather for visiting!";
      } else {
        suitability = "🔥 It's hot! Stay hydrated and avoid mid-day sun.";
      }
    }

    // 3️⃣ Fetch image from Unsplash
    const unsplashAccessKey = "4GFKZ4l06E6raZ8KPWon9kh4Lvam1xu47cpIligRRoc";
    const imgUrl = await fetch(`https://api.unsplash.com/photos/random?query=${input}&client_id=${unsplashAccessKey}&orientation=landscape`)
      .then(res => res.json())
      .then(data => {
        console.log("Unsplash API response:", data);
        return data.urls ? data.urls.regular : "";
      });

    // 4️⃣ Suggest how to reach there
    const travelSuggestion = `You can reach ${input} by plane, train, or bus depending on your location. Consider checking local travel websites for options.`;

    // 5️⃣ Generate travel tips
    let tips = suitability;
    if (travelType === "romantic") tips += " ❤️ Perfect for a romantic getaway!";
    if (travelType === "family") tips += " 👨‍👩‍👧 Enjoy family-friendly attractions.";
    if (travelType === "friends") tips += " 👫 Fun activities for friends!";
    if (travelType === "solo") tips += " 🧍 Ideal for solo exploration.";

    // 6️⃣ Update DOM
    document.getElementById("result-img").src = imgUrl;
    document.getElementById("result-title").innerText = `${input} Trip (${duration})`;
    document.getElementById("result-weather").innerText = weatherSummary;
    document.getElementById("result-travel").innerText = travelSuggestion;
    document.querySelector(".tip").innerText = tips;

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error fetching data. Check console for details.");
  } finally {
    loader.style.display = "none";
  }
});
