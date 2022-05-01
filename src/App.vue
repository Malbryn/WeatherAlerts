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
              <p class="h1 m-0">Budapest, Hungary</p>
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
                <p id="current-temp-text">20 °C</p>
              </div>
            </div>
          </div>
          <div
            id="weather-detailed"
            class="d-flex align-items-center gap-4 mt-3 fs-6 ps-lg-3"
          >
            <div id="weather-details-1">
              <ul>
                <li>Feels like: 18 °C</li>
                <li>Humidity: 60%</li>
                <li>Pressure: 1019 hPa</li>
              </ul>
            </div>
            <div id="weather-details-2">
              <ul>
                <li>Wind speed: 3 km/h</li>
                <li>Wind direction: NE</li>
                <li>UV index: 2</li>
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
import { log } from "@/utils/Logger";
import Cookies from "js-cookie";

export default {
  name: "App",
  data() {
    return {
      // Default coordinates (London)
      location: {
        lat: 51.507,
        lon: 0.128,
      },
    };
  },
  async mounted() {
    // Get location from cookies
    const locationCookie = this.getLocationCookie();

    if (locationCookie === undefined) {
      // Location is not available in cookies, try geolocation
      try {
        const locationGeoRaw = await this.getGeolocation();
        const locationGeo = {
          lat: parseFloat(locationGeoRaw.coords.latitude.toFixed(3)),
          lon: parseFloat(locationGeoRaw.coords.longitude.toFixed(3)),
        };

        this.location = locationGeo;
        this.saveLocationCookie(locationGeo);
      } catch (error) {
        log.info(
          "Geolocation is not available: " +
            error.message +
            ", using default location instead"
        );

        this.saveLocationCookie(this.location);
      }
    } else {
      this.location = locationCookie;
    }
  },
  methods: {
    saveLocationCookie(coordinates) {
      try {
        if (this.validateCoordinates(coordinates)) {
          // Set value as a cookie
          const coordinatesString = JSON.stringify(coordinates);
          Cookies.set("location", coordinatesString, 365);

          log.info("Location saved: " + coordinatesString);
        }
      } catch (error) {
        log.error("Couldn't save coordinates in cookies: \n" + error);
      }
    },
    getLocationCookie() {
      const coordinatesRaw = Cookies.get("location");
      if (coordinatesRaw === undefined) return undefined;

      try {
        // Parse and validate coordinates
        const location = JSON.parse(coordinatesRaw);

        if (this.validateCoordinates(location)) {
          log.info("Coordinates found: " + coordinatesRaw);

          return location;
        }
      } catch (error) {
        log.warn("Couldn't parse the JSON containing the location: \n" + error);

        return undefined;
      }
    },
    validateCoordinates(coordinates) {
      // Check input type
      if (typeof coordinates !== "object")
        throw new TypeError("'coordinates' is not an object");

      // Check latitude values
      if (
        typeof coordinates.lat !== "number" ||
        coordinates.lat < -90 ||
        90 < coordinates.lat
      )
        throw new Error(`'lat' is out of bounds (value: ${coordinates.lat})`);

      // Check logintude values
      if (
        typeof coordinates.lon !== "number" ||
        coordinates.lon < -180 ||
        180 < coordinates.lon
      )
        throw new Error(`'lon' is out of bounds (value: ${coordinates.lon})`);

      return true;
    },
    getGeolocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
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
