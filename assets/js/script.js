// Watchmode API key
// yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU

// Placeholder IMDB title ID until that API response is up & running
var imdbResponse = "tt0103064";

getWatchmodeResponse();

function getWatchmodeResponse() {
    var requestUrl = "https://api.watchmode.com/v1/search/?apiKey=yiuf9OlLjaQLmIWWTJqlyJi6QSFdlkvTHpBC8nwU&search_field=imdb_id&search_value=" + imdbResponse;

    fetch(requestUrl)
    .then( function(response) {
        console.log(response.json());
        return response.json();
    })

}