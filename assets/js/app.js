$(document).ready(function() {
  //doc ready

  var topics = [
    "anger",
    "fear",
    "sad",
    "disgust",
    "surprise",
    "anticipation",
    "trust",
    "joy"
  ];

  function addButton() {
    $("#topics").empty();
    for (i = 0; i < topics.length; i++) {
      var newButton = $("<button>");
      newButton.addClass("btn btn-primary");
      newButton.attr("data-name", topics[i]);
      newButton.text(topics[i]);
      $("#topics").append(newButton);

    }
  }

  addButton();

  $("#add-button").on("click", function() {
    event.preventDefault();
    var topic = $("#add-topic")
      .val()
      .trim();

    topics.push(topic);
    addButton();
  });

  $(document).on("click", ".btn", function getGifs() {
    var url = "https://api.giphy.com/v1/gifs/search";
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var q = $(this).attr("data-name");
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
      "q=" +
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
      JSON.stringify(response);
      console.log(response);
      console.log(q);
      for (i = 0; i < response.data.length; i++) {
        console.log(
          "ID: " +
            response.data[i].id +
            ", " +
            "TITLE: " +
            response.data[i].title +
            ", " +
            "LINK: " +
            response.data[i].images.fixed_width_still.url
        );
        var images = $("<div>");
        var gifDiv = $("<div>");
        var img = $("<img>");
        var p = $("<p>");
        var a = $("<a>");
        var icon = $("<i>");
        images.addClass("images container");
        images.attr("data-name", q);
        
        p.text("Rating: " + response.data[i].rating);
        img.addClass("gif");
        img.attr("data-id", response.data[i].id);
        img.attr("alt", response.data[i].title);
        img.attr("src", response.data[i].images.fixed_width_still.url);
        img.attr("data-state", "still");
        img.attr("data-animate", response.data[i].images.fixed_width.url);
        img.attr("data-still", response.data[i].images.fixed_width_still.url);
        icon.addClass("icon far fa-heart");
        $("#images").append(images);
        $(images).prepend(gifDiv);
        $(gifDiv).append(img);
        $(gifDiv).append(icon);
        $(gifDiv).append(p);

        
      } //for loop close
    }); //then closing tag
  }); //getGifs closing tag

  $(document).on("click", ".gif", function toggleState() {
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

  addButton();
}); //doc ready closing tag
