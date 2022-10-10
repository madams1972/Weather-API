var apiKey = "a650327b9311c8b0c3e05f78df0b65fe";

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var recentSearch = document.querySelector('#local-storage-buttons');
var currentWeather = document.querySelector('#current-weather');
var weekList = document.querySelector('#weekly-forecast')
var weekDay = document.querySelectorAll('#single');


function getApi(event) {
    event.preventDefault();
    getWeather(searchInput.value);
}

function getWeather(searchInputVal) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInputVal + "&Appid=" + apiKey + "&units=imperial";
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInputVal + "&Appid=" + apiKey + "&units=imperial";

    while (recentSearch.firstChild) {
        recentSearch.removeChild(recentSearch.lastChild);
    }
    while (currentWeather.firstChild) {
        currentWeather.removeChild(currentWeather.lastChild);
    
    }
    for(var i = 0; i < weekDay.length; ++i) {
        while(weekDay[i].firstChild) {
            weekDay[i].removeChild(weekDay[i].lastChild);
        }
    }

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            currentWeather.classList.add("card");
            
            newElement = document.createElement("h4");
            var img = document.createElement("img");
            img.src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            newElement.textContent = data.name;
            currentWeather.appendChild(newElement);
            newElement.appendChild(img);


            newElement = document.createElement("p");
            var currentDate = moment().format("MMMM Do YYYY");
            newElement.textContent = currentDate;
            newElement.classList.add("date");
            currentWeather.appendChild(newElement);



            var recentCity = [];
            recentCity = JSON.parse(localStorage.getItem("recentCity"));
            if(recentCity != null) {
                var keyCount = 0;
                for(var i = 0; i < recentCity.length; ++i) {
                    if(recentCity[i] === searchInputVal) {
                        keyCount = 1;
                    }
                }
                if(keyCount === 0) {
                    recentCity.push(searchInputVal);
                }
            }
            else {
                recentCity = [searchInputVal];
            }
            for(var i = 0; i < recentCity.length; ++i) {
                newButton(recentCity[i]);
            }
            localStorage.setItem("recentCity", JSON.stringify(recentCity))

            function newButton(searchInputVal) {
                newElement = document.createElement("button");
                newElement.classList.add("btn");
                newElement.classList.add("btn-secondary");
                newElement.classList.add("mb-2");
                newElement.textContent = searchInputVal;
                newElement.addEventListener("click", function(event) {
                    event.preventDefault();
                    getWeather(searchInputVal);
                });
                recentSearch.appendChild(newElement);
            }


            fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ data.coord.lat +'&lon=' + data.coord.lon + 
            '&units=imperial&appid=e634cec217230a9a54489962c65ae11b')
                .then(function (response) {
                    return response.json();
                })
                .then(function(data) {

                    newElement = document.createElement("p");
                    newElement.textContent = "Temperature: " + data.current.temp + " °F";
                    currentWeather.appendChild(newElement);

                    newElement = document.createElement("p");
                    newElement.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
                    currentWeather.appendChild(newElement);

                    newElement = document.createElement("p");
                    newElement.textContent = "Humidity: " + data.current.humidity + "%";
                    currentWeather.appendChild(newElement);


                    newElement = document.createElement("p");
                    newElement.textContent = "UV Index: " + data.current.uvi;
                    newElement.classList.add("mark");
                    newElement.classList.add("text-white")
                    if(data.current.uvi <= 2) {
                        newElement.classList.add("bg-success");
                    }
                    else if(data.current.uvi <= 5) {
                        newElement.classList.add("bg-warning");
                    } else {
                        newElement.classList.add("bg-danger");
                    }
                    currentWeather.appendChild(newElement);
                    

            })

            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    for(var i = 0; i < weekDay.length; ++i) {
                        var day = [1, 9, 17, 25, 33]
                        weekDay[i].classList.add("single");

                        newElement = document.createElement("h5");
                        var forecastDate = moment(data.list[i+ (day[i])].dt_txt).format("MMMM Do YYYY");                        
                        newElement.textContent = forecastDate;
                        weekDay[i].appendChild(newElement);

                        newElement = document.createElement("p");
                        var imgTwo = document.createElement("img");
                        imgTwo.classList.add("imgTwo")
                        imgTwo.src = "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                        weekDay[i].appendChild(imgTwo);

                        //Temp
                        newElement = document.createElement("p");
                        newElement.textContent = "Temp: " + data.list[i].main.temp + " °F";
                        weekDay[i].appendChild(newElement);

                        //Wind
                        newElement = document.createElement("p");
                        newElement.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
                        weekDay[i].appendChild(newElement);

                        //Humidity
                        newElement = document.createElement("p");
                        newElement.textContent = "Humidity: " + data.list[i].main.humidity + " %";
                        weekDay[i].appendChild(newElement);
                    }

                    newElement = document.createElement("h3");
                    newElement.textContent = ("5-Day Forecast");
                    weekList.prepend(newElement);
                }) 
    })
}