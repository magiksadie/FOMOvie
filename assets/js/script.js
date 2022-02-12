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
var latestNetflixStatus = false; // Hold Watchmode info for future
var latestDisneyStatus = false;
var latestHuluStatus = false;
var latestHboStatus = false;
var latestPeakcockStatus = false;
var latestNetflixUrl = "";
var latestDisneyUrl = "";
var latestHuluUrl = "";
var latestHboUrl = "";
var latestPeakcockUrl = "";

var emptyError = document.createElement("p"); // Create a message for if the user tries to search on nothing
emptyError.textContent = "Please enter a title before searching"

loadStorage();

// Listener for the "Add to Library" button
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

// We have to search Watchmode for an IMDB ID to get their DB index before we can retrieve info on a title
function getWatchmodeResponse(searchWatchmode, latestTitleTemp) {
  var watchmodeUrl =
    "https://api.watchmode.com/v1/search/?apiKey=MuS3n44b8mKauQo1whbqtzMqQZQplKlbiBujelRM&search_field=imdb_id&search_value=" +
    searchWatchmode;

  fetch(watchmodeUrl)
    .then(function (watchmodeResponse) {
      return watchmodeResponse.json();
    })
    .then(function (watchmodeData) {
      findSources(watchmodeData.title_results[0].id, latestTitleTemp);
    });
};

// Now that we know the Watchmode ID of a movie, query for where it's available
function findSources(watchmodeID, latestTitleTemp) {
  var watchmodeUrl = "https://api.watchmode.com/v1/title/" + watchmodeID + "/sources/?regions=US&apiKey=MuS3n44b8mKauQo1whbqtzMqQZQplKlbiBujelRM";

  fetch(watchmodeUrl)
  .then( function(watchmodeResponse) {
    return watchmodeResponse.json();
  })
  .then( function(watchmodeData) {
    displaySources(watchmodeData, latestTitleTemp);
  })
};

// Add any stream links found to the Library page
function displaySources(watchmodeData, latestTitleTemp) {
  var newBr = $("<br>");
  $("#libCard" + libCount).append(newBr);
  var newSpan = $("<span>").html("Available on: ");
  $("#libCard" + libCount).append(newSpan);

  latestNetflixStatus = false;
  latestDisneyStatus = false;
  latestHuluStatus = false;
  latestHboStatus = false;
  latestPeakcockStatus = false;

    for(var i = 0; i < watchmodeData.length; i++) {
      if(watchmodeData[i].source_id == 203) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Netflix ");
      $("#libCard" + libCount).append(newA);
      latestNetflixStatus = true;
      latestNetflixUrl = watchmodeData[i].web_url;
    }
    if(watchmodeData[i].source_id == 372) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Disney+ ");
      $("#libCard" + libCount).append(newA);
      latestDisneyStatus = true;
      latestDisneyUrl = watchmodeData[i].web_url;
    }
    if(watchmodeData[i].source_id == 385) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Hulu ");
      $("#libCard" + libCount).append(newA);
      latestHuluStatus = true;
      latestHuluUrl = watchmodeData[i].web_url;
    }
    if(watchmodeData[i].source_id == 387) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("HBO Max ");
      $("#libCard" + libCount).append(newA);
      latestHboStatus = true;
      latestHboUrl = watchmodeData[i].web_url;
    }
    if(watchmodeData[i].source_id == 389) {
      var newA = $("<a>");
      newA.attr("href", watchmodeData[i].web_url).text("Peacock ");
      $("#libCard" + libCount).append(newA);
      latestPeakcockStatus = true;
      latestPeacockUrl = watchmodeData[i].web_url;
    }
  };

  // And save the movie's info for future use
  saveToStorage(latestTitleTemp);
};

// Save an array of objects, 1 obj per movie, holding title, year, poster URL, and links to stream
function saveToStorage(latestTitleTemp) {
  var storedTitles = JSON.parse(localStorage.getItem("Library"));
  var titleObj = {};

    // If local storage is empty, populate it with this first saved title
    if(storedTitles == null) {
      titleObj.title = latestTitleTemp;
      titleObj.year = latestYear;
      titleObj.poster = latestPoster;
      if(latestNetflixStatus) {
        titleObj.netflixUrl = latestNetflixUrl;
      }
      if(latestDisneyStatus) {
        titleObj.disneyUrl = latestDisneyUrl;
      }
      if(latestHuluStatus) {
        titleObj.huluUrl = latestHuluUrl;
      }
      if(latestHboStatus) {
        titleObj.hboUrl = latestHboUrl;
      }
      if(latestPeakcockStatus) {
        titleObj.peacockUrl = latestPeakcockUrl;
      }
      localStorage.setItem("Library", JSON.stringify([titleObj]));
      libCount++;
    } else {
      // If the title we're trying to save is already in storage, nevermind
      if(storedTitles.some(temp => temp.title == latestTitleTemp)) {
        libCount++;
      } else {
          titleObj.title = latestTitleTemp;
          titleObj.year = latestYear;
          titleObj.poster = latestPoster;
          if(latestNetflixStatus) {
            titleObj.netflixUrl = latestNetflixUrl;
          }
          if(latestDisneyStatus) {
            titleObj.disneyUrl = latestDisneyUrl;
          }
          if(latestHuluStatus) {
            titleObj.huluUrl = latestHuluUrl;
          }
          if(latestHboStatus) {
            titleObj.hboUrl = latestHboUrl;
          }
          if(latestPeakcockStatus) {
            titleObj.peacockUrl = latestPeakcockUrl;
          }
          storedTitles.push(titleObj);
          localStorage.setItem("Library", JSON.stringify(storedTitles));
          libCount++;
      }
    }
  };

function loadStorage() {
  var storedTitles = JSON.parse(localStorage.getItem("Library"));

  if(storedTitles == null) {
    // Do nothing
  } else {
    $("#placeholderHolder").empty();
    for(var i = 0; i < storedTitles.length; i++) {
      var libCard = $("<div>");
      libCard.addClass("libCard").attr("id", "libCard" + libCount);
      $("#libraryCards").prepend(libCard);
    
      var movieTitle = $("<p>").html(storedTitles[i].title).attr("style", "font-size: 24px; font-weight: bold;");
      var movieYear = $("<p>").html(storedTitles[i].year).attr("style", "font-size: 18px; font-weight: bold");
      var moviePoster = $("<img>").attr("src", storedTitles[i].poster).attr("alt", "Movie poster for " + storedTitles[i].title);
      $("#libCard" + libCount).append(movieTitle, movieYear, moviePoster);

      if(storedTitles[i].netflixUrl || storedTitles[i].disneyUrl || storedTitles[i].huluUrl || storedTitles[i].hboUrl || storedTitles[i].peacockUrl) {
        var newBr = $("<br>");
        $("#libCard" + libCount).append(newBr);
        var newSpan = $("<span>").html("Available on: ");
        $("#libCard" + libCount).append(newSpan);
        if(storedTitles[i].netflixUrl) {
          var newA = $("<a>");
          newA.attr("href", storedTitles[i].netflixUrl).text("Netflix ");
          $("#libCard" + libCount).append(newA);
        }
        if(storedTitles[i].disneyUrl) {
          var newA = $("<a>");
          newA.attr("href", storedTitles[i].disneyUrl).text("Disney+ ");
          $("#libCard" + libCount).append(newA);
        }
        if(storedTitles[i].huluUrl) {
          var newA = $("<a>");
          newA.attr("href", storedTitles[i].huluUrl).text("Hulu ");
          $("#libCard" + libCount).append(newA);
        }
        if(storedTitles[i].hboUrl) {
          var newA = $("<a>");
          newA.attr("href", storedTitles[i].hboUrl).text("HBO Max ");
          $("#libCard" + libCount).append(newA);
        }
        if(storedTitles[i].peacockUrl) {
          var newA = $("<a>");
          newA.attr("href", storedTitles[i].peacockUrl).text("Peacock ");
          $("#libCard" + libCount).append(newA);
        }
      }
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