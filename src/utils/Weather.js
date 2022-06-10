import { log } from "@/utils/Logger";
import { Location } from "./Location";
import { Alert } from "./Alert";

// API URL
const URL_BASE_OPENWEATHER = "https://api.openweathermap.org/data/2.5";
const URL_BASE_WEATHERBIT = "https://api.weatherbit.io/v2.0";

export class Weather {
  constructor() {
    this.location = null;
    this.temperature = null;
    this.feelsLike = null;
    this.humidity = null;
    this.pressure = null;
    this.windSpeed = null;
    this.windDirection = null;
    this.uvIndex = null;
    this.alerts = [];
  }

  async initWeather(location) {
    // Check input location
    if (!(location instanceof Location)) {
      log.error("Cannot initialise Weather, wrong parameter was passed");
      return;
    } else {
      this.location = location;
    }

    // Fetch current weather
    const url_weather = `${URL_BASE_OPENWEATHER}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.VUE_APP_API_KEY_OPENWEATHER}&units=metric`;

    fetch(url_weather)
      .then((response) => response.json())
      .then((data) => {
        this.temperature = Math.round(data.main.temp);
        this.feelsLike = Math.round(data.main.feels_like);
        this.humidity = Math.round(data.main.humidity);
        this.pressure = Math.round(data.main.pressure);
        this.windSpeed = Math.round(data.wind.speed);
        this.windDirection = this.convertWindDirection(data.wind.deg);
      });

    // Fetch current alerts
    const url_alerts = `${URL_BASE_WEATHERBIT}/alerts?lat=${location.latitude}&lon=${location.longitude}&key=${process.env.VUE_APP_API_KEY_WEATHERBIT}`;

    fetch(url_alerts)
      .then((response) => response.json())
      .then((data) => {
        const alerts = data.alerts;

        alerts.forEach((element) => {
          const alert = new Alert();
          alert.init(element, location);

          this.alerts.push(alert);
        });
      });
  }

  convertWindDirection(bearing) {
    if (typeof bearing !== "number" || bearing < 0 || 360 < bearing) {
      log.error(
        "Cannot convert wind direction, invalid bearing (expected 0-360, got: " +
          bearing +
          ")"
      );

      return "UNKNOWN";
    }

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    return directions[Math.round(bearing / 45) % 8];
  }
}
