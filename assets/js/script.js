var searchInput = document.getElementById("searchInput"); // Get the input field to be able to read its value
var btn = document.getElementById("btnModal"); // And the search button

var omdbResponse; // To hold the OMDB API response
var watchmodeResponse; // To hold the Watchmode API response

var modal = document.getElementById("searchModal"); // Get the modal
var modalContent = document.querySelector(".modal-content"); // Get the div inside the modal
var span = document.getElementsByClassName("close")[0]; // This span contains a button to close the modal
var libBtn = document.querySelector("#libraryBtn");
var libCount = 0;
var latestTitle = ""; // Hold OMDB API results for future use
var latestYear = "";
var latestPoster = "";
var latestImdbId = "";

var emptyError = document.createElement("p"); // Create a message for if the user tries to search on nothing
emptyError.textContent = "Please enter a title before searching"

loadStorage();

libBtn.onclick = function(event) {
  event.preventDefault();
  saveMovie(latestTitle);
  modal.style.display = "none";
  $("#modalInside").empty();
  $("#libraryBtn").attr("style", "display: none");
};

// When the user clicks on the button, open the modal
btn.onclick = function(event) {
  event.preventDefault();
  $("#modalInside").empty();
  $("#libraryBtn").attr("style", "display: none");
  modal.style.display = "block";
  if (searchInput.value == "") {
    $("#modalInside").append(emptyError); // Error out if they forgot to enter something
  } else {
    getOmdbResponse(searchInput.value); // Otherwise, search for the movie
    searchInput.value = ""; // Reset search field for next search
  }
};

// When the user clicks on the X, clear the modal and close it
span.onclick = function() {
  $("#modalInside").empty();
  $("#libraryBtn").attr("style", "display: none");
  modal.style.display = "none";
};

// Or if they click anywhere outside the modal, clear & close it
window.onclick = function (event) {
if (event.target == modal) {
    $("modalInside").empty();
    $("#libraryBtn").attr("style", "display: none");
    modal.style.display = "none";
  }
};

function getOmdbResponse(searchString) {
  var omdbUrl = "https://www.omdbapi.com/?apikey=928c9de&type=movie&t=" + searchString;

  fetch(omdbUrl)
    .then(function (omdbResponse) {
      // Check if we received an API response
      if (omdbResponse.ok) {
        omdbResponse.json()
        .then(function (omdbData) {
          // Handle error if title doesn't exist, etc.
          if(omdbData.Error) {
            $("#modalInside").empty();
            $("#libraryBtn").attr("style", "display: none");
            $("#modalInside").append("Error: " + omdbData.Error + " Try a different search.");
          } else {
            $("#modalInside").empty();
            $("#libraryBtn").attr("style", "display: none");
            searchInput.value = "";
            latestImdbId = omdbData.imdbID;
            showSearchResults(omdbData);
        }
        });
      } else {
        // Error handling if API is unresponsive
        $("#modalInside").append("Error: " + omdbResponse.statusText + ", please try again later." );
      }
    })
    .catch(function (omdbError) {
      console.log(omdbError);
    });
}

// Makes a div with the OMDB info and displays it in the modal
function showSearchResults(omdbData) {
  var searchCard = $("<div class='searchCard'>");
  $("#modalInside").append(searchCard);
  var movieTitle = $("<p>").html(omdbData.Title).attr("style", "font-size: 24px; font-weight: bold;");
  var movieYear = $("<p>").html(omdbData.Year).attr("style", "font-size: 18px; font-weight: bold");
  var moviePoster = $("<img>").attr("src", omdbData.Poster).attr("alt", "Movie poster for " + omdbData.Title);
  var moviePlot = $("<p>").html("<b>Plot synopsis:</b> " + omdbData.Plot);
  var movieDirector = $("<p>").html("<b>Directed by:</b> " + omdbData.Director);
  var movieActors = $("<p>").html("<b>Starring:</b> " + omdbData.Actors);

  $(".searchCard").append(movieTitle, movieYear, moviePoster, moviePlot, movieDirector, movieActors);
  $("#libraryBtn").attr("style", "display: inline-block");

  // Save some results to globals in case they're needed later
  latestTitle = omdbData.Title;
  latestYear = omdbData.Year;
  latestPoster = omdbData.Poster;
};

// Save movie to library when "Add to Library" is clicked
function saveMovie(latestTitleTemp) {
  $("#placeholderHolder").empty(); // Ditch the placeholder image now that there will be at least 1 movie poster

  var libCard = $("<div>");
  libCard.addClass("libCard").attr("id", "libCard" + libCount);
  $("#libraryCards").prepend(libCard);

  var movieTitle = $("<p>").html(latestTitle).attr("style", "font-size: 24px; font-weight: bold;");
  var movieYear = $("<p>").html(latestYear).attr("style", "font-size: 18px; font-weight: bold");
  var moviePoster = $("<img>").attr("src", latestPoster).attr("alt", "Movie poster for " + latestTitle);
  $("#libCard" + libCount).append(movieTitle, movieYear, moviePoster);

  getWatchmodeResponse(latestImdbId, latestTitleTemp);
}

function getWatchmodeResponse(searchWatchmode, latestTitleTemp) {
  var watchmodeUrl =
    "https://api.watchmode.com/v1/search/?apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU&search_field=imdb_id&search_value=" +
    searchWatchmode;

  fetch(watchmodeUrl)
    .then(function (watchmodeResponse) {
      return watchmodeResponse.json();
    })
    .then(function (watchmodeData) {
      findSources(watchmodeData.title_results[0].id, latestTitleTemp);
    });
};

function findSources(watchmodeID, latestTitleTemp) {
  var watchmodeUrl = "https://api.watchmode.com/v1/title/" + watchmodeID + "/sources/?regions=US&apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU";

  fetch(watchmodeUrl)
  .then( function(watchmodeResponse) {
    return watchmodeResponse.json();
  })
  .then( function(watchmodeData) {
    displaySources(watchmodeData, latestTitleTemp);
  })
};

function displaySources(watchmodeData, latestTitleTemp) {
  var newBr = $("<br>");
  $("#libCard" + libCount).append(newBr);
  var newSpan = $("<span>").html("Available on: ");
  $("#libCard" + libCount).append(newSpan);

    for(var i = 0; i < watchmodeData.length; i++) {
      if(watchmodeData[i].source_id == 203) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Netflix ");
      $("#libCard" + libCount).append(newA);
    }
    if(watchmodeData[i].source_id == 372) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Disney+ ");
      $("#libCard" + libCount).append(newA);
    }
    if(watchmodeData[i].source_id == 385) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Hulu ");
      $("#libCard" + libCount).append(newA);
    }
    if(watchmodeData[i].source_id == 387) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("HBO Max ");
      $("#libCard" + libCount).append(newA);
    }
    if(watchmodeData[i].source_id == 389) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Peacock ");
      $("#libCard" + libCount).append(newA);
    }
  };

  saveToStorage(latestTitleTemp);
};

function saveToStorage(latestTitleTemp) {
  var titles = JSON.parse(localStorage.getItem("Library"));
  var titleArray = [];

  if(titles == null) {
    titleArray.push(latestTitleTemp);
    localStorage.setItem("Library", JSON.stringify(titleArray));
    libCount++;
  } else {
      if(titles.includes(latestTitleTemp)) {
        libCount++;
      } else {
        titles.push(latestTitleTemp);
        localStorage.setItem("Library", JSON.stringify(titles));
        libCount++;
      }
  }
};

function loadStorage() {
  var titles = JSON.parse(localStorage.getItem("Library"));

  if(titles !== null) {
    for(var i = 0; i < titles.length; i++) {
      var omdbUrl = "https://www.omdbapi.com/?apikey=928c9de&type=movie&t=" + titles[i];

      fetch(omdbUrl)
      .then(function(omdbResponse) {
        omdbResponse.json()
        .then(function(omdbData) {
          latestImdbId = omdbData.imdbID;
          latestTitle = omdbData.Title;
          latestYear = omdbData.Year;
          latestPoster = omdbData.Poster;
          saveMovie(latestTitle);
        })
      })
    }
  }
};
              

// Drop and Drag Function--

  //class App {

  //static init() {

    //App.box = document.getElementsByClassName('content')[0]

    //App.box.addEventListener("dragstart", App.dragstart)
    //App.box.addEventListener("dragend", App.dragend)

    //const containers = document.getElementsByClassName('holder')

    //for(const container of containers) {
      //container.addEventListener("dragover", App.dragover)
      //container.addEventListener("dragenter", App.dragenter)
      //container.addEventListener("dragleave", App.dragleave)
      //container.addEventListener("drop", App.drop)
    //}
  //}

  //static dragstart() {
    //this.className += "held"
  
    //setTimeout(()=>this.className="invisible", 0)
  //}

  //static dragend() {
    //this.className = "content"
  //}

  //static dragover(e) {
    //e.preventDefault()
  //}

  //static dragenter(e) {
   // e.preventDefault()
    //this.className += "hovered"
  //}

  //static dragleave() {
    //this.className = "holder"
  //}

  //static drop() {
    //this.className = "holder"
    //this.append(App.box)
  //}

//}

//document.addEventListener("DOMContentLoaded", App.init)