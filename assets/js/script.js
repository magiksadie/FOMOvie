var searchInput = document.getElementById("searchInput"); // Get the input field to be able to read its value

var omdbResponse; // To hold the OMDB API response
var watchmodeResponse; // To hold the Watchmode API response

var modal = document.getElementById("searchModal"); // Get the modal
var modalContent = document.querySelector(".modal-content"); // Get the div inside the modal
var btn = document.getElementById("btnModal"); // And the modal button
var span = document.getElementsByClassName("close")[0]; // This span contains a button to close the modal

var emptyError = document.createElement("p"); // Create a message for if the user tries to search on nothing
emptyError.textContent = "Please enter a title before searching"

// When the user clicks on the button, open the modal
btn.onclick = function (event) {
  event.preventDefault();
  $("#modalInside").empty();
  modal.style.display = "block";
  if (searchInput.value == "") {
    $("#modalInside").append(emptyError); // Error out if they forgot to enter something
  } else {
    getOmdbResponse(searchInput.value); // Otherwise, search for the movie
    searchInput.value = "";
  }
};

// When the user clicks on the X, clear the modal and close it
span.onclick = function () {
  $("#modalInside").empty();
  modal.style.display = "none";
};

// Or if they click anywhere outside the modal, clear & close it
window.onclick = function (event) {
  if (event.target == modal) {
    $("modalInside").empty();
    modal.style.display = "none";
  }
};

function getOmdbResponse(searchString) {
  var omdbUrl = "http://www.omdbapi.com/?apikey=928c9de&t=" + searchString;

  fetch(omdbUrl)
    .then(function (omdbResponse) {
      // Check if we received an API response
      if (omdbResponse.ok) {
        omdbResponse.json()
        .then(function (omdbData) {
          // Handle error if title doesn't exist, etc.
          if(omdbData.Error) {
            $("#modalInside").empty();
            $("#modalInside").append("Error: " + omdbData.Error + " Try a different search.");
          } else {
            $("#modalInside").empty();
            searchInput.value = "";
            showSearchResults(omdbData);

            // Movie Title
            // var movieTitle = document.createElement("h3");
            // movieTitle.textContent = omdbData.Title;
            // modalContent.appendChild(movieTitle);
            // //Movie Year
            // var movieYear = document.createElement("h4");
            // movieYear.textContent = omdbData.Year;
            // modalContent.appendChild(movieYear);
            // // Movie Poster
            // var moviePoster = document.createElement("img");
            // moviePoster.src = omdbData.Poster;
            // modalContent.appendChild(moviePoster);
            // // Movie Plot
            // var moviePlot = document.createElement("h4");
            // moviePlot.textContent = omdbData.Plot;
            // modalContent.appendChild(moviePlot);
            // // Movie Actors
            // var movieActors = document.createElement("h4");
            // movieActors.textContent = "Actors: " + omdbData.Actors;
            // modalContent.appendChild(movieActors);
            // // Movie Director
            // var movieDirector = document.createElement("h4");
            // movieDirector.textContent = "Director: " + omdbData.Director;
            // modalContent.appendChild(movieDirector);
            // var saveMovieBtn = document.createElement("button");
            // saveMovieBtn.textContent = "Save to Library";
            // modalContent.appendChild(saveMovieBtn);
            // saveMovie(omdbData);
            //getWatchmodeResponse(omdbData.imdbID);
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

function getWatchmodeResponse(searchWatchmode) {
  var watchmodeUrl =
    "https://api.watchmode.com/v1/search/?apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU&search_field=imdb_id&search_value=" +
    searchWatchmode;

  fetch(watchmodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(JSON.stringify(data));
    });
}

function showSearchResults(omdbData) {
  var searchCard = $("<div class='searchCard'>");
  $("#modalInside").append(searchCard);
  var movieTitle = $("<p>").html(omdbData.Title).attr("style", "font-size: 24px; font-weight: bold;");
  var movieYear = $("<p>").html(omdbData.Year).attr("style", "font-size: 18px; font-weight: bold");
  var moviePoster = $("<img>").attr("src", omdbData.Poster).attr("alt", "Movie poster for " + omdbData.Title);
  var moviePlot = $("<p>").html("<b>Plot synopsis:</b> " + omdbData.Plot);
  var movieDirector = $("<p>").html("<b>Directed by:</b> " + omdbData.Director);
  var movieActors = $("<p>").html("<b>Starring:</b> " + omdbData.Actors);
  var saveMovieBtn = $("<button>").text("Save to Library").attr("style", "border: 2px solid #f5c518; background-color: #f5c518;").attr("class", "button is-centered is-rounded");
  $(".searchCard").append(movieTitle, movieYear, moviePoster, moviePlot, movieDirector, movieActors, saveMovieBtn);

};

// function saveMovie(omdbResponse) {
//   var movieCard = document.createElement("div");
//   var movieTitle = document.createElement("h3");
//   movieTitle.textContent = omdbResponse.Title;
//   movieCard.appendChild(movieTitle);
//   //Movie Year
//   var movieYear = document.createElement("h4");
//   movieYear.textContent = omdbResponse.Year;
//   movieCard.appendChild(movieYear);
//   // Movie Poster
//   var moviePoster = document.createElement("img");
//   moviePoster.src = omdbResponse.Poster;
//   movieCard.appendChild(moviePoster);
//   toWatch.appendChild(movieCard);
// }
