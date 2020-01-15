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
      newButton.text("#" + topics[i]);
      $("#topics").append(newButton);
    }
  }

  // function addCardColumns() {
  //   for (i = 0; i < topics.length; i++) {
  //     var images = $("<div>");
  //     images.addClass("images card-columns");
  //     images.attr("data-name", topics[i]);
  //     $("#images").append(images);
  //   }
  // }

  addButton();
  // addCardColumns();

  $("#add-button").on("click", function() {
    event.preventDefault();
    var topic = $("#add-topic")
      .val()
      .trim()
      .toLowerCase();

    topics.push(topic);
    addButton();
    // addCardColumns();
  });

  $(document).on("click", ".btn-primary", function getGifs() {
    var url = "https://api.giphy.com/v1/gifs/search";
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var q = $(this).attr("data-name");
    var limit = "limit=10";
    var offset = "offset=0";
    var rating = "rating=PG-13";
    var lang = "lang=en"; //use a 2-letter ISO 639-1 language code

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

        var card = $("<div>");
        var img = $("<img>");
        var p = $("<p>");
        var info = $("<div>");
        var title = $("<h5>");
        var icon = $("<i>");
        var index = [i];

        img.addClass("gif card-img-top");
        img.attr("data-id", response.data[i].id);
        img.attr("alt", response.data[i].title);
        img.attr("src", response.data[i].images.fixed_width_still.url);
        img.attr("data-state", "still");
        img.attr("data-animate", response.data[i].images.fixed_width.url);
        img.attr("data-still", response.data[i].images.fixed_width_still.url);
        icon.addClass("icon far fa-heart");
        icon.attr("data-id", response.data[i].id);
        icon.attr("index", index);
        card.addClass("card h-300");
        info.addClass("card-body");
        title.addClass("card-title");
        title.text(response.data[i].title);
        p.addClass("card-text");
        p.text("Rating: " + response.data[i].rating);
          
        $(images).prepend(card);
        $(card).append(img);
        $(card).append(icon);
        $(card).append(info);
        $(info).append(title);
        $(info).append(p);
      } //for loop close
    }); //then closing tag
  }); //getGifs closing tag

  var favorites = [];
  var j=0;
  //favorites
//user clicks icon
  //i++ counter
  //retrieve necessary attributes from (this)
  //put into object
  //push into array
  //place array into local storage
  //for loop to retrieve from LS
  $(document).on("click", ".icon", function favoriteGif () {
    $(this).removeClass("icon far fa-heart").addClass("icon fas fa-heart");
    var getId = $(this).attr("data-id");
    favorites.push(getId);
    j++;
    localStorage.setItem("favorites", favorites[j]);
   console.log(favorites);

 
  //  Object.assign(obj1, obj2)
       
  });

  $("#fave-button").on("click", function displayFaves() {
    var url = "https://api.giphy.com/v1/gifs/";
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var id = favorites;
    var faveURL =
      url +
      id +
      "?" +
      key; 
    $.ajax({
      url: faveURL,
      method: "GET"
    }).then(function(faves) {
        // img.addClass("gif card-img-top");
        // img.attr("data-id", response.data[i].id);
        // img.attr("alt", response.data[i].title);
        // img.attr("src", response.data[i].images.fixed_width_still.url);
        // img.attr("data-state", "still");
        // img.attr("data-animate", response.data[i].images.fixed_width.url);
        // img.attr("data-still", response.data[i].images.fixed_width_still.url);
        // icon.addClass("icon far fa-heart");
        // card.addClass("card h-300");
        // info.addClass("card-body");
        // title.addClass("card-title");
        // title.text(response.data[i].title);
        // p.addClass("card-text");
        // p.text("Rating: " + response.data[i].rating);
     
        // $(images).prepend(card);
        // $(card).append(img);
        // $(card).append(icon);
        // $(card).append(info);
        // $(info).append(title);
        // $(info).append(p);

  });
});

  
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
  // addCardColumns();
}); //doc ready closing tag
