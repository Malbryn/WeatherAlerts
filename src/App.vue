<template>
  <div class="container">
    <header class="row">
      <div id="info"></div>
    </header>
    <main class="row mt-3">
      <div class="col d-flex flex-column align-items-center">
        <!-- Current location -->
        <div id="location-wrapper" class="row m-2">
          <div class="d-flex flex-row align-items-center gap-2">
            <div id="location-icon">
              <img
                src="./assets/location.svg"
                alt="location"
                id="location-icon"
                class="img-fluid"
              />
            </div>
            <div id="location-text">
              <p class="h1 m-0">
                {{
                  location !== null
                    ? location.city + ", " + location.country
                    : "UNKNOWN"
                }}
              </p>
            </div>
          </div>
        </div>
        <!-- Current weather -->
        <div
          id="weather-wrapper"
          class="d-flex align-items-center flex-column flex-lg-row m-4 gap-4"
        >
          <div id="weather-basic">
            <div class="d-flex align-items-center gap-4 pe-lg-3">
              <div>
                <img
                  src="./assets/heavy-rain-1.svg"
                  alt="weather icon"
                  id="current-icon"
                  class="img-fluid"
                />
              </div>
              <div id="current-temp">
                <p id="current-temp-text">
                  {{ weather !== null ? weather.temperature : "-" }} °C
                </p>
              </div>
            </div>
          </div>
          <div
            id="weather-detailed"
            class="d-flex align-items-center gap-4 mt-3 fs-6 ps-lg-3"
          >
            <div id="weather-details-1">
              <ul>
                <li>
                  Feels like:
                  {{ weather !== null ? weather.feelsLike : "-" }} °C
                </li>
                <li>
                  Humidity:
                  {{ weather !== null ? weather.humidity : "-" }}%
                </li>
                <li>
                  Pressure:
                  {{ weather !== null ? weather.pressure : "-" }} hPa
                </li>
              </ul>
            </div>
            <div id="weather-details-2">
              <ul>
                <li>
                  Wind speed:
                  {{ weather !== null ? weather.windSpeed : "-" }} km/h
                </li>
                <li>
                  Wind gust:
                  {{ weather !== null ? weather.windGust : "-" }} km/h
                </li>
                <li>
                  Wind direction:
                  {{ weather !== null ? weather.windDirection : "-" }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Current alerts -->
        <div id="alerts-wrapper" class="row m-3">
          <ul class="d-flex flex-row">
            <li>Alert 1</li>
            <li>Alert 2</li>
            <li>Alert 3</li>
            <li>Alert 4</li>
          </ul>
        </div>
      </div>
    </main>
    <footer class="row">
      <p></p>
    </footer>
  </div>
</template>

<script>
import { Location } from "@/utils/Location";
import { Weather } from "@/utils/Weather";

export default {
  name: "App",
  data() {
    return {
      location: null,
      weather: null,
    };
  },
  async mounted() {
    // Initialise location
    this.location = new Location();
    await this.location.initLocation();

    // Initialise weather
    this.weather = new Weather();
    await this.weather.initWeather(this.location);
  },
};
</script>

<style>
:root {
  /* Colours */
  --palette-1: #00121a;
  --palette-2: #005f73;
  --palette-3: #0a9396;
  --palette-4: #94d2bd;
  --palette-5: #e9d8a6;
  --palette-6: #ee9b00;
  --palette-7: #ca6702;
  --palette-8: #bb3e03;
  --palette-9: #ae2012;
  --palette-10: #9b2226;
  --palette-11: #0f0f0f;
  --palette-12: #f3f3f3;
}

body {
  color: var(--palette-12) !important;
  background-color: var(--palette-1) !important;
}

ul {
  list-style-type: none;
  padding-left: 0 !important;
}

.container {
  height: 100vh;
}

#current-icon {
  width: 100%;
  max-width: 120px;
  height: auto;
}

#current-temp-text {
  font-size: 3.5rem;
  font-weight: bolder;
}

#location-icon {
  max-height: 25px;
  max-width: 25px;
  vertical-align: baseline;
}
</style>
