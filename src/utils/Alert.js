import { log } from "@/utils/Logger";
import { Location } from "./Location";

export class Alert {
  constructor() {
    this.location = null;
    this.title = null;
    this.description = null;
    this.regions = null;
    this.severity = null;
    this.timeEffective = null;
    this.timeExpires = null;
  }

  init(data, location) {
    // Check input
    if (data === null) {
      log.error("Cannot initialise Alert, wrong 'data' parameter was passed");
      return;
    }

    if (!(location instanceof Location)) {
      log.error(
        "Cannot initialise Alert, wrong 'location' parameter was passed"
      );
      return;
    }

    this.location = location;
    this.title = data.title;
    this.description = data.description;
    this.regions = data.regions;
    this.severity = new Severity(data.severity);
    this.timeEffective = data.effective_local;
    this.timeExpires = data.expires_local;
  }

  getTimeEffectiveTimestamp() {
    return this.convertDate(this.timeEffective);
  }

  getTimeExpiresTimestamp() {
    return this.convertDate(this.timeExpires);
  }

  convertDate(datetime) {
    try {
      const unixTime = Date.parse(datetime);
      const date = new Date(unixTime);

      return date.toLocaleString("en-GB");
    } catch (error) {
      log.error(error.message);
    }
  }
}

// Enum for handling of severity levels
class Severity {
  static ADVISORY = new Severity("Advisory");
  static WATCH = new Severity("Watch");
  static WARNING = new Severity("Warning");

  constructor(level) {
    this.level = level;
  }

  toString() {
    return this.level;
  }
}
