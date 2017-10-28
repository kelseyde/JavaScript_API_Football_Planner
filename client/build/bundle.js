/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var requestHelper = {

  getRequest: function(url, callback, token, key) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  if (token && key !== null) {
    xhr.setRequestHeader(token, key)
  }

  xhr.addEventListener('load', function() {
    var jsonString = xhr.responseText
    var data = JSON.parse(jsonString)
    callback(data)
  })
  xhr.send()
},

}

module.exports = requestHelper


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var requestHelper = __webpack_require__(0)
var teamsUrl = 'http://api.football-data.org/v1/competitions/445/teams'
var apitoken = 'X-Auth-Token'
var apikey = '16bf6721521f4342aca8f7c7656dff95'
var MapWrapper = __webpack_require__(2)
var getLeagueTable = __webpack_require__(3);

var initialiseDirectionsButton = function(directionsButton) {
  directionsButton.addEventListener("click", function() {
    var homeTeamName = directionsButton.value;
    initMap(homeTeamName);
  });
}

var getTeamCrest = function(crestImg, fixture) {
  var url = fixture._links.homeTeam.href;
  requestHelper.getRequest(url, function(team) {
    crestImg.src = team.crestUrl;
  }, apitoken, apikey)
}

var populatePreviousFixturesList = function(team, previousFixtures) {
  var statsDiv = document.getElementById("stats-div");
  while (statsDiv.firstChild) { statsDiv.removeChild(statsDiv.firstChild) }
  var ul = document.createElement("ul");
  ul.id = "previous-fixtures-list";
  statsDiv.appendChild(ul);
  previousFixtures.forEach(function(fixture) {
    var li = document.createElement("li");
    li.innerText = fixture.homeTeamName + "   " + fixture.result.goalsHomeTeam +
      " - " + fixture.awayTeamName + "   " + fixture.result.goalsAwayTeam;
    ul.appendChild(li);
  })
}

var populateFixturesList = function(team, upcomingFixtures) {
  var mainDiv = document.getElementById("main-div");
  while (mainDiv.firstChild) { mainDiv.removeChild(mainDiv.firstChild) }
  var ul = document.createElement("ul");
  ul.id = "away-fixtures-list";
  upcomingFixtures.forEach(function(fixture) {
    var li = document.createElement("li");
    var fixtureDiv = document.createElement("div");
    fixtureDiv.id = "fixture-div";
    var homeTeamName = document.createElement("h5");
    homeTeamName.id = "home-team-name";
    homeTeamName.innerText = fixture.homeTeamName + " (AWAY)";
    var homeTeamCrest = document.createElement("img");
    homeTeamCrest.classList += "crest";
    getTeamCrest(homeTeamCrest, fixture);
    var date = document.createElement("p");
    date.innerText = fixture.date;
    var directionsButton = document.createElement("button");
    directionsButton.id = "directions-button";
    directionsButton.innerText = "Stadium Location";
    directionsButton.value = fixture.homeTeamName;
    mainDiv.appendChild(ul);
    ul.appendChild(li);
    li.appendChild(fixtureDiv);
    fixtureDiv.appendChild(homeTeamName);
    fixtureDiv.appendChild(homeTeamCrest);
    fixtureDiv.appendChild(date);
    fixtureDiv.appendChild(directionsButton);
    initialiseDirectionsButton(directionsButton);
  });
}

var getSelectedTeamFixtures = function(teams) {
  var select = document.querySelector("#team-dropdown");
  select.addEventListener("change", function() {
    var team = JSON.parse(select.value);
    var fixturesUrl = team._links.fixtures.href;
    requestHelper.getRequest(fixturesUrl, function(info) {
      var previousFixtures = info.fixtures.filter(function(fixture) {
        return fixture.status === "FINISHED";
      });
      populatePreviousFixturesList(team, previousFixtures)
      var upcomingFixtures = info.fixtures.filter(function(fixture) {
        return fixture.homeTeamName !== team.name
              && fixture.status !== "FINISHED";
      });
      populateFixturesList(team, upcomingFixtures);
    }, apitoken, apikey)
    getLeagueTable();
  })
}

var populateDropdown = function(information) {
  var select = document.querySelector('#team-dropdown');
  while (select.firstChild) { select.removeChild(select.firstChild) }
  var disabledOption = document.createElement("option");
  disabledOption.innerText = "Choose your team";
  disabledOption.disabled = true;
  disabledOption.selected = true;
  var teams = information.teams;
  select.appendChild(disabledOption);
  teams.forEach(function(team) {
    var option = document.createElement("option");
    option.innerText = team.name;
    option.value = JSON.stringify(team);
    select.appendChild(option);
  });
  getSelectedTeamFixtures(teams);
}

var initMap = function(teamName) {
  requestHelper.getRequest("http://localhost:3000/api/clubExtras", function(dbTeams) {
    console.log(teamName);
    var foundTeam = dbTeams.find(function(dbTeam) {
      return teamName === dbTeam.name;
    });
    var lat = foundTeam.latLng[0];
    var lng = foundTeam.latLng[1];
    var mainMap = new MapWrapper(lat, lng, 10);
  });
}

window.addEventListener("DOMContentLoaded", function() {
  requestHelper.getRequest(teamsUrl, populateDropdown, apitoken, apikey);
  // var directionsService = new google.maps.DirectionsService();
  // var directionsRenderer = new google.maps.DirectionsRenderer();
  //
  // var initialise = function() {
  //   var directionsRenderer = new google.maps.DirectionsRenderer();
  //   var mapDiv = document.createElement("div");
  //   var container = document.getElementById("main-div");
  //   container.appendChild(mapDiv);
    // var map = new google.maps.Map(mapDiv, {
    //   zoom: 7,
    //   center: {lat: 0, lng: 0}
    // });
    // mapDiv.id = "test-map-div";
  //   directionsRenderer.setMap(map);
  //   calcRoute();
  // }
  //
  // var calcRoute = function() {
  //   var directionsRequest = {
  //     origin: "joplin, mo",
  //     destination: "flagstaff, az",
  //     travelMode: "DRIVING"
  //   }
  //   directionsService.route(directionsRequest, function(result, status) {
  //     directionsRenderer.setDirections(result);
  //   })
  // }
  //
  // initialise();

//////////////////////////////////////////////////
//
//   var directionsDisplay;
// var directionsService = new google.maps.DirectionsService();
// var map;
//
// function initialize() {
//   directionsDisplay = new google.maps.DirectionsRenderer();
//   var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//   var mapOptions = {
//     zoom:7,
//     center: chicago
//   }
//   map = new google.maps.Map(document.getElementById('map');
//   directionsDisplay.setMap(map);
//   calcRoute();
// }
//
// function calcRoute() {
//   var start = document.getElementById('start').value;
//   var end = document.getElementById('end').value;
//   var request = {
//     origin: start,
//     destination: end,
//     travelMode: 'DRIVING'
//   };
//   directionsService.route(request, function(result, status) {
//     if (status == 'OK') {
//       directionsDisplay.setDirections(result);
//     }
//   });
// }
//
// initialize();

});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var MapWrapper = function(lat, lng, zoom) {
  var container = document.getElementById('main-div');
  while (container.firstChild) { container.removeChild(container.firstChild) }
  var mapDiv = document.createElement("div");
  mapDiv.id = "main-map";
  container.appendChild(mapDiv);
  this.googleMap = new google.maps.Map( mapDiv, {
    center: {lat: lat, lng: lng},
    zoom: zoom
  })
}

module.exports = MapWrapper;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var requestHelper = __webpack_require__(0);
var apitoken = 'X-Auth-Token';
var apikey = '16bf6721521f4342aca8f7c7656dff95';


var populateLeagueTable = function(leagueTable) {
  var select = document.getElementById("team-dropdown");
  var selectedTeam = JSON.parse(select.value);
  var selectedTeamName = selectedTeam.name;

  var table = document.getElementById("league-table");
  while (table.firstChild) { table.removeChild(table.firstChild) }
  var thead = document.createElement("thead");
  var theadRow = document.createElement("tr");
  var hRank = document.createElement("tr");
  hRank.innerText = "Rank";
  var hTeam = document.createElement("td");
  hTeam.innerText = "Team";
  var hPlayed = document.createElement("td");
  hPlayed.innerText = "P";
  var hGoalDifference = document.createElement("td");
  hGoalDifference.innerText = "GD";
  var hPoints = document.createElement("td");
  hPoints.innerText = "Pts"
  table.appendChild(thead);
  thead.appendChild(theadRow);
  theadRow.appendChild(hRank);
  theadRow.appendChild(hTeam);
  theadRow.appendChild(hPlayed);
  theadRow.appendChild(hGoalDifference);
  theadRow.appendChild(hPoints);

  var tbody = document.createElement("tbody");
  table.appendChild(tbody);
  leagueTable.standing.forEach(function(team) {
    var tr = document.createElement("tr");
    var rank = document.createElement("td");
    rank.innerText = team.position;
    var teamName = document.createElement("td");
    teamName.innerText = team.teamName;
    var teamPlayed = document.createElement("td");
    teamPlayed.innerText = team.playedGames;
    var teamGD = document.createElement("td");
    teamGD.innerText = team.goalDifference;
    var teamPoints = document.createElement("td");
    teamPoints.innerText = team.points;
    tbody.appendChild(tr);
    tr.appendChild(rank);
    tr.appendChild(teamName);
    tr.appendChild(teamPlayed);
    tr.appendChild(teamGD);
    tr.appendChild(teamPoints);
    if (selectedTeamName === team.teamName) {tr.classList += "highlighted"}
  })
}


var getLeagueTable = function() {
  requestHelper.getRequest("http://api.football-data.org/v1/competitions/445/leagueTable", populateLeagueTable, apitoken, apikey)
}

module.exports = getLeagueTable


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map