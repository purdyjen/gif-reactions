$(document).ready(function() {
  //doc ready

  var topics = [
    "anger",
    "sadness",
    "fear",
    "joy",
    "interest",
    "surprise",
    "disgust",
    "shame"
  ];

  function addButton() {
    $("#topics").empty();
    for (i = 0; i < topics.length; i++) {
      var newButton = $("<button>");
      newButton.addClass("btn btn-dark");
      newButton.attr("data-name", topics[i]);
      newButton.text("#" + topics[i]);
      $("#topics").append(newButton);
    }
  }

  addButton();

  $(document).on("load", function () {
    var faves = JSON.parse(localStorage.getItem("favorites"));
    console.log(faves);
  });
  
  $("#add-button").on("click", function() {
    event.preventDefault();
    var topic = $("#add-topic")
      .val()
      .trim()
      .toLowerCase();
      if (topic.length > 0){
    topics.push(topic);
    addButton();}
    $("#add-topic").val("");
  });


  function randomNum() {
      return Math.floor(Math.random() * 50) + 1
    }
    console.log(randomNum());

    var results = [];
  
    $(document).on("click", ".btn-dark", function getGifs() {
    var url = "https://api.giphy.com/v1/gifs/search";
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var q = $(this).attr("data-name");
    var limit = "limit=10";
    var offset = "offset=" + randomNum();
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
      // JSON.stringify(response);
      // console.log(response);
      // console.log(q);
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
        
        img.addClass("gif card-img-top");
        img.attr("data-id", response.data[i].id);
        img.attr("alt", response.data[i].title);
        img.attr("src", response.data[i].images.fixed_width_still.url);
        img.attr("data-state", "still");
        img.attr("data-animate", response.data[i].images.fixed_width.url);
        img.attr("data-still", response.data[i].images.fixed_width_still.url);
        
        icon.addClass("icon far fa-heart");
        icon.attr("data-id", response.data[i].id);
        icon.attr("alt", response.data[i].title);
        icon.attr("src", response.data[i].images.fixed_width_still.url);
        icon.attr("data-state", "still");
        icon.attr("data-animate", response.data[i].images.fixed_width.url);
        icon.attr("data-still", response.data[i].images.fixed_width_still.url);
        icon.attr("data-rating", response.data[i].rating);
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
        // results.push(response.data[i]);
      } //for loop close

    }); //ajax.then closing tag
  }); //getGifs closing tag

  var favorites = [];

  $(document).on("click", ".icon", function favoriteGif() {
    var faves = JSON.parse(localStorage.getItem("favorites"));
     $(this)
      .removeClass("icon far fa-heart")
      .addClass("icon fas fa-heart");
      var faves = JSON.parse(localStorage.getItem("favorites")) || [];
      console.log("before addition:" + faves);
    var faveGif = {
      dataId: $(this).attr("data-id"),
      gifAlt: $(this).attr("alt"),
      gifSrc: $(this).attr("src"),
      dataAnimate: $(this).attr("data-animate"),
      dataStill: $(this).attr("data-still"),
      rating: $(this).attr("data-rating")
    }
    faves.push(faveGif);
    localStorage.setItem('favorites', JSON.stringify(faves));
    console.log(favorites);

  });

  $("#fave-button").on("click", function displayFaves() {
    $("#images").empty();
    var faves = JSON.parse(localStorage.getItem("favorites"));
    console.log(faves);
    for (k=0; k < faves.length; k++) {
      console.log(faves[k]);
      var card = $("<div>");
      var img = $("<img>");
      var p = $("<p>");
      var info = $("<div>");
      var title = $("<h5>");
      var icon = $("<i>");
     
      img.addClass("gif card-img-top");
      img.attr("data-id", faves[k].dataId);
      img.attr("alt", faves[k].gifAlt);
      img.attr("src", faves[k].gifSrc);
      img.attr("data-state", "still");
      img.attr("data-animate", faves[k].dataAnimate);
      img.attr("data-still", faves[k].dataStill);
      
      icon.addClass("icon fas fa-heart");
      icon.attr("data-id", faves[k].dataId);
      icon.attr("alt", faves[k].gifAlt);
      icon.attr("src", faves[k].gifSrc);
      icon.attr("data-state", "still");
      icon.attr("data-animate", faves[k].dataAnimate);
      icon.attr("data-still", faves[k].dataStill);
      icon.attr("data-rating", faves[k].rating);

      card.addClass("card h-300");
      info.addClass("card-body");
      title.addClass("card-title");
      title.text(faves[k].gifAlt);
      p.addClass("card-text");
      p.text("Rating: " + faves[k].rating);

      $(images).prepend(card);
      $(card).append(img);
      $(card).append(icon);
      $(card).append(info);
      $(info).append(title);
      $(info).append(p);
    }
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

}); //doc ready closing tag


// if (!Array.isArray(faves)) {
//   favorites = [];
// }
// id();

 // function id() {
  //   for (var i = 0; i < favorites.length; i++) {
  //     console.log(favorites[i]);
  //   }
  // }
  // id();
     
 