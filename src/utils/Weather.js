import { log } from "@/utils/Logger";
import { Location } from "./Location";

// API URL
const URL_BASE = "https://api.openweathermap.org/data/2.5";

export class Weather {
  constructor() {
    this.temperature = null;
    this.feelsLike = null;
    this.humidity = null;
    this.pressure = null;
    this.windSpeed = null;
    this.windDirection = null;
    this.uvIndex = null;
    this.alerts = null;
  }

  async initWeather(location) {
    // Check input location
    if (!(location instanceof Location)) {
      log.error("Cannot initialise Weather, wrong parameter was passed");
      return;
    }

    const url = `${URL_BASE}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.VUE_APP_API_KEY_OW}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.temperature = Math.round(data.main.temp);
        this.feelsLike = Math.round(data.main.feels_like);
        this.humidity = Math.round(data.main.humidity);
        this.pressure = Math.round(data.main.pressure);
        this.windSpeed = Math.round(data.wind.speed);
        this.windDirection = this.convertWindDirection(data.wind.deg);

        console.log(data);
        console.log(this);
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
