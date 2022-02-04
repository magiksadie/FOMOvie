// Watchmode API key
// yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU

// Hardcoding a placeholder IMDB title ID until that API response is up & running
var imdbResponse = "tt0103064";

var watchmodeResponse = getWatchmodeResponse();

function getWatchmodeResponse() {
    var requestUrl = "https://api.watchmode.com/v1/search/?apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU&search_field=imdb_id&search_value=" + imdbResponse;

    console.log(requestUrl);

    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log( JSON.stringify(data) );
    })
}

}

// Get the modal
var modal = document.getElementById("searchModal");
// Get the button that opens the modal
var btn = document.getElementById("btnModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = function(event) {
    event.preventDefault();
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
