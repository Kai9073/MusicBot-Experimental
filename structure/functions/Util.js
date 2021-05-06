const ytsr = require("youtube-sr");
const soundcloud = require("soundcloud-scraper");

class Util {
  static splitCode(message, str, code = "none") {
    if (!message) return;
    try {
      const splitRegex = code == "none" ? /[\s\S]{1,1960}/g : /[\s\S]{1,1940}/g;
      const sendarr = str.match(splitRegex);
      let i;
      for (i = 0; i < sendarr.length; i++) {
        if (code === "none") message.channel.send(sendarr[i]);
        else message.channel.send(sendarr[i], { code: code });
      }
    } catch (e) {
      message.channel.send(e, { code: "xl" });
    }
  }

  static resolveQuery(query) {
    const youtubeVid = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const spotifytrack = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
    const spotifyplaylist = /(https?:\/\/open.spotify.com\/playlist\/[a-zA-Z0-9])/;

    if (youtubeVid.test(query)) {
      return "ytvid";
    } else if (spotifytrack.test(query)) {
      return "spotifyurl";
    } else if (spotifyplaylist.test(query)) {
      return "spotifyplaylist";
    } else if (soundcloud.validateURL(query, "track")) {
      return "soundcloudurl";
    } else if (ytsr.default.validate(query, "PLAYLIST")) {
      return "ytplaylist";
    } else {
      return "ytkeywords";
    }
  }

  static timeToSeconds(duration) {
    const time = duration;
    const a = time.split(":");

    const res = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return res;
  }

  static msToTime(format, duration) {
    var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 24);

    days = days < 10 ? "0" + days : days;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (format === "hh:mm:ss") {
      return `${hours}:${minutes}:${seconds}`;
    } else if (format === "dd:hh:mm:ss") {
      return `${days}:${hours}:${minutes}:${seconds}`;
    }
  }
}

module.exports = Util;
