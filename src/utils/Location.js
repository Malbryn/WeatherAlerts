import { log } from "@/utils/Logger";
import Cookies from "js-cookie";

// Default coordinates (London)
const DEFAULT_LATITUDE = 51.507;
const DEFAULT_LONGITUDE = 0.128;
const DEFAULT_CITY = "London";
const DEFAULT_COUNTRY = "GB";

// API URL
const URL_BASE = "http://api.openweathermap.org/geo/1.0";

export class Location {
  constructor() {
    this.latitude = DEFAULT_LATITUDE;
    this.longitude = DEFAULT_LONGITUDE;
    this.city = DEFAULT_CITY;
    this.country = DEFAULT_COUNTRY;
  }

  async initLocation() {
    // Get the location from cookies
    const locationCookie = this.getlocationCookie();

    if (locationCookie === undefined) {
      // Location is not available in cookies, try geolocation
      try {
        const locationGeoRaw = await this.getGeolocation();

        // Parse the coordinates
        this.latitude = parseFloat(locationGeoRaw.coords.latitude.toFixed(3));
        this.longitude = parseFloat(locationGeoRaw.coords.longitude.toFixed(3));

        const locationGeo = {
          latitude: this.latitude,
          longitude: this.longitude,
        };

        this.saveLocationCookie(locationGeo);
      } catch (error) {
        log.info(
          "Geolocation is not available: " +
            error.message +
            ", using default location instead"
        );

        this.saveLocationCookie(this);
      }
    } else {
      this.latitude = locationCookie.latitude;
      this.longitude = locationCookie.longitude;
    }

    await this.getCityByCoordinates();
  }

  getlocationCookie() {
    const coordinatesRaw = Cookies.get("location");

    if (coordinatesRaw === undefined) return undefined;

    try {
      // Parse and validate the coordinates
      const location = JSON.parse(coordinatesRaw);

      if (this.validateCoordinates(location)) {
        log.info("Location found: " + coordinatesRaw);

        return location;
      }
    } catch (error) {
      log.warn("Couldn't parse the JSON containing the location: \n" + error);

      return undefined;
    }
  }

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
  }

  validateCoordinates(coordinates) {
    // Check the input type
    if (typeof coordinates !== "object")
      throw new TypeError("'coordinates' is not an object");

    // Check latitude values
    if (
      typeof coordinates.latitude !== "number" ||
      coordinates.latitude < -90 ||
      90 < coordinates.latitude
    )
      throw new Error(`'lat' is out of bounds (value: ${coordinates.lat})`);

    // Check longitude values
    if (
      typeof coordinates.longitude !== "number" ||
      coordinates.longitude < -180 ||
      180 < coordinates.longitude
    )
      throw new Error(`'lon' is out of bounds (value: ${coordinates.lon})`);

    return true;
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async getCityByCoordinates() {
    const url = `${URL_BASE}/reverse?lat=${this.latitude}&lon=${this.longitude}&limit=1&appid=${process.env.VUE_APP_API_KEY_OW}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length !== 0) {
          this.country = data[0].country;
          this.city = data[0].name;
        }
      });
  }
}
