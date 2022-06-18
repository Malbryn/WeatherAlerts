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
                  :src="
                    this.weather !== null
                      ? currentWeatherIconPath
                      : './assets/sun-1.svg'
                  "
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
          <ul class="d-grid gap-2">
            <li
              v-for="(alert, index) in weather.alerts"
              :key="alert"
              data-bs-toggle="modal"
              :data-bs-target="`#weather-alert-modal-${index}`"
            >
              <button
                :class="{
                  'alert-severity-advisory': alert.severity == 'Advisory',
                  'alert-severity-watch': alert.severity == 'Watch',
                  'alert-severity-warning': alert.severity == 'Warning',
                }"
                class="btn alert-listitem"
                type="button"
              >
                {{ alert.severity + " - " + alert.title }}
              </button>
              <div :id="`weather-alert-modal-${index}`" class="modal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5>{{ alert.title }}</h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div id="alert-severity">
                        <p>
                          Severity: <br />
                          {{ alert.severity }}
                        </p>
                      </div>
                      <div id="alert-issued">
                        <p>
                          Issued: <br />
                          {{ alert.getTimeEffectiveTimestamp() }}
                        </p>
                      </div>
                      <div id="alert-expires">
                        <p>
                          Expires: <br />
                          {{ alert.getTimeExpiresTimestamp() }}
                        </p>
                      </div>
                      <div id="alert-regions">
                        <p>
                          Regions: <br />
                          {{ alert.regions }}
                        </p>
                      </div>
                      <div id="alert-descri">
                        <p>
                          Description: <br />
                          {{ alert.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
    <footer class="row fixed-bottom">
      <p class="text-center">
        <!-- Disclaimer: the data presented in this app might not be 100% accurate -->
      </p>
    </footer>
  </div>
</template>

<script>
import { Location } from "@/utils/lib/Location";
import { Weather } from "@/utils/lib/Weather";

export default {
  name: "App",
  data() {
    return {
      location: new Location(),
      weather: new Weather(),
    };
  },
  computed: {
    currentWeatherIconPath() {
      const icon = this.weather.getWeatherIconFileName();
      return require(`./assets/${icon === "" ? "sun-1" : icon}.svg`);
    },
  },
  async mounted() {
    // Initialise location
    await this.location.initLocation();

    // Initialise weather
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

footer > p {
  font-size: 0.85rem;
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

.container {
  height: 100vh;
}

.alert-listitem {
  color: var(--palette-12);
  text-decoration: none !important;
  font-weight: 600 !important;
}

.alert-severity-advisory {
  background-color: var(--palette-6) !important;
}

.alert-severity-watch {
  background-color: var(--palette-7) !important;
}

.alert-severity-warning {
  background-color: var(--palette-9) !important;
}

.modal-content {
  background-color: var(--palette-12);
  color: var(--palette-1);
}
</style>
