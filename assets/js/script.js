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
