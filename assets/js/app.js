$(document).ready(function() {
  //doc ready

  var topics = ["anger", "fear", "sad", "disgust", "disgust", "surprise", "anticipation", "trust", "joy"];

  $("#test-button").on("click", function getGifs() {
    var userInput = "star-wars";
    var url = "https://api.giphy.com/v1/gifs/search";
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var q = "q=" + userInput;
    var limit = "limit=10";
    var offset = "offset=0";
    var rating = "rating=PG-13";
    var lang = "lang=en"; //use a 2-letter ISO 639-1 language code
    var random_id; //an ID/proxy for specific user
    var queryURL =
      url +
      "?" +
      key +
      "&" +
      q +
      "&" +
      limit +
      "&" +
      offset +
      "&" +
      rating +
      "&" +
      lang;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      for (i = 0; i < response.data.length; i++) {
        console.log(
          response.data[i].id +
            ", " +
            response.data[i].title +
            ", " +
            response.data[i].images.fixed_width_still.url
        );
        var gifDiv = $("<div>");
        var img = $("<img>");
        var p = $("<p>");
        p.text("Rating: " + response.data[i].rating);
        img.addClass("gif");
        img.attr("data-id", response.data[i].id);
        img.attr("alt", response.data[i].title);
        img.attr("src", response.data[i].images.fixed_width_still.url);
        img.attr("data-state", "still");
        img.attr("data-animate", response.data[i].images.fixed_width.url);
        img.attr("data-still", response.data[i].images.fixed_width_still.url);
        $(gifDiv).append(img);
        $(gifDiv).append(p);
        $("#images").prepend(gifDiv);
      } //for loop close
    }); //then closing tag
  }); //getGifs closing tag

  $(document).on("click", ".gif", function toggleState() {
      console.log("Is this even working?");
    var state = $(this).attr("data-state");

    if (state === "still") {
      var animateVal = $(this).attr("data-animate");
      $(this).attr("src", animateVal);
      $(this).attr("data-state", "animate");
    } else if (state === "animate") {
      var stillVal = $(this).attr("data-still");
      $(this).attr("src", stillVal);
      $(this).attr("data-state", "still");
    }
  }); //toggleState closing tag




}); //doc ready closing tag
