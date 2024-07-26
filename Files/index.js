//-------------------------Fetching Section----------------------------------
import { apiKey } from "./env";
async function fetchData(city) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},&APPID=${apiKey}`
    );
    let data = await response.json();
    document.getElementById(
      "gmap_canvas"
    ).src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    appendingData(data);
  } catch (error) {
    console.log(error);
  }
}
async function fiveDaysForecast(city) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`
    );
    let data = await response.json();
    sortForecastData(data.list);
  } catch (error) {
    console.log(error);
  }
}
//-----------------------------------------------------------------------------
//-------------------------Small Functions-------------------------------------
function getMonthName(monthNumber) {
  // Array of month names
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if the provided monthNumber is valid
  if (monthNumber >= 0 && monthNumber <= 11) {
    // Return the month name corresponding to the monthNumber
    return months[monthNumber];
  } else {
    // Return an error message if the monthNumber is out of range
    return "Invalid month number. Please provide a number between 0 and 11.";
  }
}
function convertMillisecondsToTime(milliseconds) {
  // Create a new Date object using the milliseconds
  var date = new Date(milliseconds);

  // Get hours and minutes from the Date object
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Determine AM/PM
  var ampm = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Set 12 for midnight

  // Pad single digit minutes with leading zero
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Format the time
  var time = hours + ":" + minutes + ampm;

  return time;
}
function getDayOfWeek(dayNumber) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (dayNumber >= 0 && dayNumber <= 6) {
    return days[dayNumber];
  } else {
    return "Invalid day number. Please provide a number between 0 and 6.";
  }
}
function getMinTemp(arr) {
  let min = 999999;
  arr.forEach((element) => {
    if (element.main.temp_min < min) {
      min = element.main.temp_min;
    }
  });

  return min - 273.15;
}
function getMaxTemp(arr) {
  let max = 0;
  arr.forEach((element) => {
    if (element.main.temp_max > max) {
      max = element.main.temp_max;
    }
  });
  return max - 273.15;
}
function filterData(data) {
  this.day = getDayOfWeek(new Date(data[0].dt * 1000).getDay());
  this.icon = data[0].weather[0].icon;
  this.temp_min = Math.trunc(getMinTemp(data)) + "°";
  this.temp_max = Math.trunc(getMaxTemp(data)) + "°";
}

//-------------------------------------------------------------------------------
//------------------Appending Section--------------------------------------------
async function appendingData(data) {
  const timeInMili = data.dt;
  const fullDate = new Date(timeInMili * 1000);
  const m = getMonthName(fullDate.getMonth());
  const d = fullDate.getDate();
  const t = convertMillisecondsToTime(fullDate.getTime());
  document.getElementById("time").innerText = `${m} ${d}, ${t}`;
  document.getElementById("city").innerText =
    data.name + ", " + data.sys.country;

  const currentTemp = Math.trunc(data.main.temp - 273.15);

  document.getElementById("currentTemp").innerText = currentTemp + "° C";

  document.getElementById(
    "cloud"
  ).src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

  const condition = data.weather[0].main;
  const feelsLike = Math.trunc(data.main.feels_like - 273.15);
  document.getElementById(
    "feels-like"
  ).innerText = `Feels like ${feelsLike}° C. ${condition}.`;

  let windSpeed = data.wind.speed;
  document.getElementById("wind").innerText = `Wind Speed : ${windSpeed}m/s`;

  let airPressure = data.main.pressure;
  document.getElementById(
    "pressure"
  ).innerText = `Air Pressure : ${airPressure}hPa`;

  let humidity = data.main.humidity;
  document.getElementById("humidity").innerText = `Humidity : ${humidity}%`;

  let visibility = data.visibility / 1000;
  document.getElementById(
    "visibility"
  ).innerText = `Visibility : ${visibility}km`;

  let lowTemp = Math.trunc(data.main.temp_min - 273.15);
  document.getElementById(
    "lowTemp"
  ).innerText = `Lowest : ${lowTemp}° C`;

  let highTemp = Math.trunc(data.main.temp_max - 273.15);
  document.getElementById(
    "highTemp"
  ).innerText = `Highest : ${highTemp}° C`;
}
function sortForecastData(data) {
  for (i = 0; i < temp.length; i++) {
    temp[i].innerHTML = "";
  }
  let today = new Date(data[0].dt * 1000).getDate();
  let day1 = [];
  let day2 = [];
  let day3 = [];
  let day4 = [];
  let day5 = [];
  let day6 = [];
  data.forEach(function (ele) {
    if (new Date(ele.dt * 1000).getDate() == today) {
      day1.push(ele);
    } else if (new Date(ele.dt * 1000).getDate() == today + 1) {
      day2.push(ele);
    } else if (new Date(ele.dt * 1000).getDate() == today + 2) {
      day3.push(ele);
    } else if (new Date(ele.dt * 1000).getDate() == today + 3) {
      day4.push(ele);
    } else if (new Date(ele.dt * 1000).getDate() == today + 4) {
      day5.push(ele);
    } else if (new Date(ele.dt * 1000).getDate() == today + 5) {
      day6.push(ele);
    }
  });
  let day1Data = new filterData(day1);
  let day2Data = new filterData(day2);
  let day3Data = new filterData(day3);
  let day4Data = new filterData(day4);
  let day5Data = new filterData(day5);
  var finalData = [day1Data, day2Data, day3Data, day4Data, day5Data];
  temp.forEach((element, i) => {
    let p1 = document.createElement("p");
    p1.innerText = finalData[i].day;

    let image = document.createElement("img");
    image.src = `https://openweathermap.org/img/w/${finalData[i].icon}.png`;

    let min = document.createElement("p");
    min.innerText = finalData[i].temp_min;

    let max = document.createElement("p");
    max.innerText = finalData[i].temp_max;

    element.append(p1, image, min, max);
  });
}
//-------------------------------------------------------------------------------

var temp = document.querySelectorAll("#forecast>div");
document.getElementById("search-button").addEventListener("click", function () {
  let city = document.getElementById("search-box").value;
  city = city ? city : "Kolkata";
  fetchData(city.toLowerCase());
  fiveDaysForecast(city.toLowerCase());
});

fiveDaysForecast("kolkata");
fetchData("kolkata");
