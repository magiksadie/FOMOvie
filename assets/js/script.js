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

