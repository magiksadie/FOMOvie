const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("search-modal"); // Get the modal
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close-modal");
const saveBtn = document.getElementById("save-to-library-btn");

let omdbResponse;
let watchmodeResponse;

let libCount = 0;
let latestTitle = ""; // Hold OMDB API results for future use
let latestYear = "";
let latestPoster = "";
let latestImdbId = "";

loadStorage();

saveBtn.onclick = function(e) {
  e.preventDefault();
  saveMovie(latestTitle);
  modal.style.display = "none";
  $("#modalInside").empty();
  saveBtn.style.display = "none";
};

searchBtn.onclick = function(e) {
  e.preventDefault();
  $("#modalInside").empty();
  saveBtn.style.display = "none";
  modal.style.display = "block";
  if (searchInput.value == "") {
    let emptyError = document.createElement("p");
    emptyError.textContent = "Please enter a title before searching";
    $("#modalInside").append(emptyError);
  } else {
    getOmdbResponse(searchInput.value);
     // Otherwise, search for the movie
    searchInput.value = ""; // Reset search field for next search
  }
};

// When the user clicks on the X, clear the modal and close it
closeBtn.onclick = function() {
  $("#modalInside").empty();
  saveBtn.style.display = "none";
  modal.style.display = "none";
};

// Or if they click anywhere outside the modal, clear & close it
window.onclick = function (e) {
  if (e.target == modal) {
    $("modalInside").empty();
    saveBtn.style.display = "none";
    modal.style.display = "none";
  }
};

function getOmdbResponse(searchString) {
  const url = "https://www.omdbapi.com/?apikey=928c9de&type=movie&t=" + searchString;

  fetch(url)
    .then(function (omdbResponse) {
      // Check if we received an API response
      if (omdbResponse.ok) {
        omdbResponse.json()
        .then(function (omdbData) {
          // Handle error if title doesn't exist, etc.
          if(omdbData.Error) {
            $("#modalInside").empty();
            saveBtn.style.display = "none";
            $("#modalInside").append("Error: " + omdbData.Error + " Try a different search.");
          } else {
            $("#modalInside").empty();
            saveBtn.style.display = "none";
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
  const searchCard = $("<div class='searchCard'>");
  $("#modalInside").append(searchCard);
  const movieTitle = $("<p>").html(omdbData.Title).attr("style", "font-size: 24px; font-weight: bold;");
  const movieYear = $("<p>").html(omdbData.Year).attr("style", "font-size: 18px; font-weight: bold");
  const moviePoster = $("<img>").attr("src", omdbData.Poster).attr("alt", "Movie poster for " + omdbData.Title);
  const moviePlot = $("<p>").html("<b>Plot synopsis:</b> " + omdbData.Plot);
  const movieDirector = $("<p>").html("<b>Directed by:</b> " + omdbData.Director);
  const movieActors = $("<p>").html("<b>Starring:</b> " + omdbData.Actors);

  $(".searchCard").append(movieTitle, movieYear, moviePoster, moviePlot, movieDirector, movieActors);
  saveBtn.style.display = "inline-block";

  // Save some results to globals in case they're needed later
  latestTitle = omdbData.Title;
  latestYear = omdbData.Year;
  latestPoster = omdbData.Poster;
};

// Save movie to library when "Add to Library" is clicked
function saveMovie(movie) {
  $("#placeholderHolder").empty(); // Ditch the placeholder image now that there will be at least 1 movie poster

  const libCard = $("<div>");
  libCard.addClass("libCard").attr("id", "libCard" + libCount);
  $("#libraryCards").prepend(libCard);

  const movieTitle = $("<p>").html(latestTitle).attr("style", "font-size: 24px; font-weight: bold; "); //add css style to remove inline styling + add class
  const movieYear = $("<p>").html(latestYear).attr("style", "font-size: 18px; font-weight: bold");
  const moviePoster = $("<img>").attr("src", latestPoster).attr("alt", "Movie poster for " + latestTitle);
  $("#libCard" + libCount).append(movieTitle, movieYear, moviePoster);

  getWatchmodeResponse(latestImdbId, movie);
}

function getWatchmodeResponse(searchWatchmode, movie) {
  const url = "https://api.watchmode.com/v1/search/?apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU&search_field=imdb_id&search_value=" + searchWatchmode;

  fetch(url)
    .then(function (watchmodeResponse) {
      return watchmodeResponse.json();
    })
    .then(function (watchmodeData) {
      findSources(watchmodeData.title_results[0].id, movie);
    });
};

function findSources(watchmodeID, movie) {
  var url = "https://api.watchmode.com/v1/title/" + watchmodeID + "/sources/?regions=US&apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU";

  fetch(url)
  .then( function(watchmodeResponse) {
    return watchmodeResponse.json();
  })
  .then( function(watchmodeData) {
    displaySources(watchmodeData, movie);
  })
};

function displaySources(watchmodeData, movie) {
  const lineBreak = $("<br>");
  const newSpan = $("<span>").html("Available on: ");
  $("#libCard" + libCount).append(lineBreak);
  $("#libCard" + libCount).append(newSpan);

  for(let i = 0; i < watchmodeData.length; i++) {
    const linkToService = $("<a>");
    let service = "";
    if(watchmodeData[i].source_id == 203) {
      service = "Netflix ";
    }
    if(watchmodeData[i].source_id == 372) {
      service = "Disney+ ";
    }
    if(watchmodeData[i].source_id == 385) {
      service = "Hulu ";
    }
    if(watchmodeData[i].source_id == 387) {
      service = "HBO Max ";
    }
    if(watchmodeData[i].source_id == 389) {
      service = "Peacock ";
    }
    linkToService.attr("href", watchmodeData[i].web_url).text(service);
    $("#libCard" + libCount).append(linkToService);
  };

  saveToStorage(movie);
};

function saveToStorage(movie) {
  var titles = JSON.parse(localStorage.getItem("Library"));
  var titleArray = [];

  if(titles == null) {
    titleArray.push(movie);
    localStorage.setItem("Library", JSON.stringify(titleArray));
    libCount++;
  } else {
      if(titles.includes(movie)) {
        libCount++;
      } else {
        titles.push(movie);
        localStorage.setItem("Library", JSON.stringify(titles));
        libCount++;
      }
  }
};

function loadStorage() {
  var titles = JSON.parse(localStorage.getItem("Library"));

  if(titles !== null) {
    for(var i = 0; i < titles.length; i++) {
      var omdbUrl = "http://www.omdbapi.com/?apikey=928c9de&type=movie&t=" + titles[i];

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