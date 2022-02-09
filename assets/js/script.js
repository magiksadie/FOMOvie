// OMDB API key
// 928c9de
// TMDB API key
// ec41a34f528d3376af8f21290ccf32a1
// Watchmode API key
// yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU

// Looks like we probably won't need to use TMDB

// Hardcoding a placeholder OMDB title ID until that API response is up & running
var searchString = "Terminator 2"; // tt0103064

var omdbResponse;
var watchmodeResponse;
var tmdbResponse;
var saveMovieBtn = document.createElement("button");
//Modal Content
var modalContent = document.querySelector(".modal-content");
var toWatch = document.querySelector("#to-watch");
//getOmdbResponse(searchString);

function getOmdbResponse(searchString) {
  var omdbUrl = "http://www.omdbapi.com/?apikey=928c9de&t=" + searchString;

  fetch(omdbUrl)
    .then(function (omdbResponse) {
      // Check if we received an API response
      if (omdbResponse.ok) {
        omdbResponse.json().then(function (omdbData) {
          // Modal Content
          console.log(omdbData);
          console.log(omdbData.imdbID);
          // Movie Title
          var movieTitle = document.createElement("h3");
          movieTitle.textContent = omdbData.Title;
          modalContent.appendChild(movieTitle);
          //Movie Year
          var movieYear = document.createElement("h4");
          movieYear.textContent = omdbData.Year;
          modalContent.appendChild(movieYear);
          // Movie Poster
          var moviePoster = document.createElement("img");
          moviePoster.src = omdbData.Poster;
          modalContent.appendChild(moviePoster);
          // Movie Plot
          var moviePlot = document.createElement("h4");
          moviePlot.textContent = omdbData.Plot;
          modalContent.appendChild(moviePlot);
          // Movie Actors
          var movieActors = document.createElement("h4");
          movieActors.textContent = "Actors: " + omdbData.Actors;
          modalContent.appendChild(movieActors);
          // Movie Director
          var movieDirector = document.createElement("h4");
          movieDirector.textContent = "Director: " + omdbData.Director;
          modalContent.appendChild(movieDirector);
          // Save Movie Button
          saveMovieBtn.textContent = "Save to Library";
          modalContent.appendChild(saveMovieBtn);
          saveMovie(omdbData);
          //getWatchmodeResponse(omdbData.imdbID);
        });
      } else {
        // Add error handling that doesn't use alert
        alert("Error: " + omdbResponse.statusText);
      }
    })
    .catch(function (omdbError) {
      // Also eliminate this alert
      alert("Unable to connect to OMDB");
    });
}

// function getTmdbResponse(searchTmdb) {
//   var tmdbUrl = "https://api.themoviedb.org/3/find/" + searchTmdb + "?api_key=ec41a34f528d3376af8f21290ccf32a1&external_source=imdb_id";

//   fetch(tmdbUrl)
//   .then(function(tmdbResponse) {
//     if (tmdbResponse.ok) {
//       tmdbResponse.json()
//       .then(function(tmdbData) {
//         console.log(tmdbData);
//         console.log(tmdbData.movie_results[0].id);
//         console.log(tmdbData.movie_results[0].imdb_id);
//         getWatchmodeResponse(tmdbData.movie_results[0].imdb_id);

//       });
//     } else {
//       // Error handling
//       alert("Error: " + tmdbResponse.statusText);
//     }
//   })
//   .catch(function(tmdbError) {
//     // Error handling
//     alert("Unable to connect to TMDB");
//   });
// };

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
//Input field
var searchInput = document.getElementById("searchInput");
// Get the modal
var modal = document.getElementById("searchModal");
// Get the button that opens the modal
var btn = document.getElementById("btnModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = function (event) {
  event.preventDefault();
  modal.style.display = "block";
  getOmdbResponse(searchInput.value);
  console.log(searchInput.value);
};
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function saveMovie(omdbResponse) {
  var movieCard = document.createElement("div");
  var movieTitle = document.createElement("h3");
  movieTitle.textContent = omdbResponse.Title;
  movieCard.appendChild(movieTitle);
  //Movie Year
  var movieYear = document.createElement("h4");
  movieYear.textContent = omdbResponse.Year;
  movieCard.appendChild(movieYear);
  // Movie Poster
  var moviePoster = document.createElement("img");
  moviePoster.src = omdbResponse.Poster;
  movieCard.appendChild(moviePoster);
  toWatch.appendChild(movieCard);
}
//Save Local Data
saveMovieBtn.addEventListener("click", (function (event) {
  console.log("hello");
  event.preventDefault();
  var value = "movieCard, movieTitle, movieYear";
  localStorage.setItem("library", value);
}));
//Retrieve Local Data
$(".library-content").val(localStorage.getItem(saveMovie));
