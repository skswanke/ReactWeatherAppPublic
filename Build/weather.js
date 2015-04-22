var API_KEY = ""
var TimeApp = React.createClass({displayName: "TimeApp",
  getInitialState: function() {
    var date = new Date();
    var year    = date.getFullYear();
    var month   = date.getMonth()+1;
    var day     = date.getDate();
    var hour;
    if (date.getHours()%12 === 0) {
      hour = 12;
    } else {
      hour = date.getHours()%12;
    }
    var ampm = date.getHours() >= 12 ? 'pm' : 'am';
    var minute  = date.getMinutes();
    var seconds;
    if (minute<10) {
      minute = "0" + minute;
    }
    if (date.getSeconds()<10){
      seconds = '0' + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }
    return {
      time: month+'/'+day+'/'+year+' '+hour+':'+minute+':'+seconds+ampm,
      text: 'Time'
    };
  },

  tick: function() {
    var date = new Date();
    var year    = date.getFullYear();
    var month   = date.getMonth()+1;
    var day     = date.getDate();
    var hour;
    if (date.getHours()%12 === 0) {
      hour = 12;
    } else {
      hour = date.getHours()%12;
    }
    var ampm = date.getHours() >= 12 ? 'pm' : 'am';
    var minute  = date.getMinutes();
    var seconds;
    if (minute<10) {
      minute = "0" + minute;
    }
    if (date.getSeconds()<10){
      seconds = '0' + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }

    this.setState({ time: month+'/'+day+'/'+year+' '+hour+':'+minute+':'+seconds+ampm}); 
  },

  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      React.createElement("span", {className: "data"}, this.state.time)
    );
  }
});

var WeatherApp = React.createClass({displayName: "WeatherApp",
  getInitialState: function() {
    return {
      data:[] 
    };
  },
  loadJSONFromServer: function () {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?id=5234372&APPID="+API_KEY,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
        console.log("GET")
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('err', status, err.toString());
      }.bind(this)
    });
  },
  capFirstLetter: function (str) {
    var x = 0;
    var splt = str.split(" ");
    done = "";
    while(splt[x]) {
      done = done.concat(splt[x].charAt(0).toUpperCase() + splt[x].slice(1)," ");
      x++;
    }
    return done;
  },
  getReadableDate: function (unixTime) {
    var date = new Date(unixTime*1000);
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    var min = date.getMinutes();
    if (min<10) {
      min = "0" + min
    }
    return (date.getHours()%12) + ":" + min + ampm;
  },
  getWindDirection: function (deg) {
    if (deg<11.25 || deg > 348.75){
      return "N"
    } else if (deg>=11.25 && deg < 33.75){
      return "NNE"
    } else if (deg>=33.75 && deg < 56.25){
      return "NE"
    } else if (deg>=56.25 && deg < 78.75){
      return "ENE"
    } else if (deg>=78.75 && deg < 101.25) {
      return "E"
    } else if (deg>=101.25 && deg < 123.75) {
      return "ESE"
    } else if (deg>=123.75 && deg < 146.25) {
      return "SE"
    } else if (deg>=146.25 && deg < 168.75) {
      return "SSE"
    } else if (deg>=168.75 && deg < 191.25) {
      return "S"
    } else if (deg>=191.25 && deg < 213.75) {
      return "SSW"
    } else if (deg>=213.75 && deg < 236.25) {
      return "SW"
    } else if (deg>=236.25 && deg < 258.75) {
      return "WSW"
    } else if (deg>=258.75 && deg < 281.25) {
      return "W"
    } else if (deg>=281.25 && deg < 303.75) {
      return "WNW"
    } else if (deg>=303.75 && deg < 326.25) {
      return "NW"
    } else if (deg>=326.25 && deg < 348.75) {
      return "NNW"
    } else {
      return "Error"
    }
  },
  randDeg: function () {
    setInterval(this, 1000)
    return Math.random()*359
  },
  componentDidMount: function() {
    this.loadJSONFromServer();
    setInterval(this.loadJSONFromServer, this.props.pollInterval);
  },
  render: function() {
    if (!this.state.data.weather){return (React.createElement("p", null, "loading..."))}
    else {
      return (
        React.createElement("div", {id: "wApp"}, 
          React.createElement("div", {id: "overview"}, 
            React.createElement("h2", {className: "name"}, 
              this.state.data.name
            ), 
            React.createElement("img", {className: "weathericon", src: "http://openweathermap.org/img/w/"+this.state.data.weather[0].icon+".png"}), 
            React.createElement("p", {className: "description"}, 
              this.capFirstLetter(this.state.data.weather[0].description)
            )
          ), 
          React.createElement("div", {className: "details"}, 
            React.createElement("p", {className: "time"}, 
              React.createElement(TimeApp, null)
            ), 
            React.createElement("p", null, " "), 
            React.createElement("ul", null, 
              React.createElement("li", null, 
                React.createElement("p", {className: "temp"}, 
                  React.createElement("span", {className: "desc"}, "Temp (°F): "), 
                  React.createElement("span", {className: "data"}, Math.round((this.state.data.main.temp - 273.15)* 1.8000 + 32.00), "°")
                )
              ), 
              React.createElement("li", null, 
                React.createElement("p", {className: "humidity"}, 
                  React.createElement("span", {className: "desc"}, "Humidity: "), 
                  React.createElement("span", {className: "data"}, this.state.data.main.humidity, "%")
                )
              ), 
              React.createElement("li", null, 
                React.createElement("p", {className: "sunrise"}, 
                  React.createElement("span", {className: "desc"}, React.createElement("img", {className: "sunriseimg", src: "sunrise.png"})), 
                  React.createElement("span", {className: "data sun"}, this.getReadableDate(this.state.data.sys.sunrise))
                )
              ), 
              React.createElement("li", null, 
                React.createElement("p", {className: "sunset"}, 
                  React.createElement("span", {className: "desc"}, React.createElement("img", {className: "sunsetimg", src: "sunset.png"})), 
                  React.createElement("span", {className: "data sun"}, this.getReadableDate(this.state.data.sys.sunset))
                )
              )
            )
          ), 
          React.createElement("div", {className: "wind"}, 
            React.createElement("div", {className: "dial"}, 
              React.createElement("img", {className: "windimg", src: "windimg.png"}), 
              React.createElement("img", {className: "windarrow", style: {position: 'absolute', WebkitTransition: '-webkit-transform 2s linear', WebkitTransformOrigin: 'top left', WebkitTransform: 'rotate('+ this.state.data.wind.deg + 'deg) translate(-50%, -50%)', transition: 'transform 2s linear', transformOrigin: 'top left', transform: 'rotate('+ this.state.data.wind.deg + 'deg) translate(-50%, -50%)'}, src: "windarrow.png"})
            ), 
            React.createElement("p", null, 
              React.createElement("span", {className: "desc"}, "Direction: "), 
              React.createElement("span", {className: "windata"}, Math.round(this.state.data.wind.deg), "° ", this.getWindDirection(this.state.data.wind.deg))
            ), 
            React.createElement("p", null, 
              React.createElement("span", {className: "desc"}, "Speed: "), 
              React.createElement("span", {className: "data"}, Math.round(this.state.data.wind.speed * 2.2369362920544), "mph")
            ), 
            React.createElement("small", {className: "update"}, "Updated: ", this.getReadableDate(this.state.data.dt))
          )
        )
      );
    }
  }
});

React.render(
  React.createElement(WeatherApp, {pollInterval: 10000}),
  document.getElementById('weatherApp')
);

/*{
  "coord":{"lon":-73.21,"lat":44.48},
  "sys":{
    "message":0.0124,
    "country":"US",
    "sunrise":1428402120,
    "sunset":1428449263
  },
  "weather":[
    {
      "id":802,
      "main":"Clouds",
      "description":"scattered clouds",
      "icon":"03d"
    }
    ],
  "base":"stations",
  "main":{
    "temp":278.825,
    "temp_min":278.825,
    "temp_max":278.825,
    "pressure":1013.3,
    "sea_level":1041.49,
    "grnd_level":1013.3,
    "humidity":57
  },
  "wind":{
    "speed":2.12,
    "deg":2.00397
  },
  "clouds":{
    "all":32
  },
  "dt":1428429530,
  "id":5234372,
  "name":"Burlington",
  "cod":200
}*/