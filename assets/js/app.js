$(document).ready(function () {
  //doc ready
  // page can't be safely manipulated until the DOM is ready. jQuery detects this state of readiness.
  // shorthand for $(document).ready() is $()
  // $(function() { ...code... });

  // checks local storage for topics and faves arrays
  // If topics and/or faves is not saved to storage, then assigns topics and/or faves variable as an empty array
  // If topics and/or faves is saved to storage, then grabs the string, parses it, and converts it back to an array
  var topics = JSON.parse(localStorage.getItem("topics")) || [];
  var faves = JSON.parse(localStorage.getItem("favorites")) || [];

  // If null, populates the topics array with eight values and then saves it into local storage
  if (topics.length === 0) {
    topics = [
      "anger",
      "sadness",
      "fear",
      "joy",
      "interest",
      "surprise",
      "disgust",
      "shame",
    ];
    localStorage.setItem("topics", JSON.stringify(topics)); // Converts array to string and saves to local storage
  }

  // Adds a button for each topic present in the topics array to allow for easy gif searching
  function addButton() {
    $("#topics").empty(); // Clears topics div to ensure only current topics are shown
    for (i = 0; i < topics.length; i++) {
      var newButton = $("<button>"); // Creates new Button element
      newButton.addClass("btn btn-dark"); // Adds the relevant CSS classes for styling
      newButton.attr("data-name", topics[i]); // Creates data-name based on the value
      newButton.text("#" + topics[i]); // Populates text in button based on the value
      $("#topics").append(newButton); // Adds button to the topics div
    }
  }

  addButton(); // Calls addButton()

  $("#add-button").on("click", function () {
    // Triggers function on add-button click
    event.preventDefault(); // Prevents page from reloading
    var topic = $("#add-topic").val().trim().toLowerCase(); // Grabs value from the add-topic text box
    if (topic.length > 0) {
      // Ensures that text box isn't empty when button is clicked
      topics.push(topic); // Pushes new topic to array
      localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
      addButton(); // Calls addButton() so that new button is displayed too
    }
    $("#add-topic").val(""); // Clears add-topic text box
  });

  $("#remove-button").on("click", function () {
    // Triggers function on remove-button click
    event.preventDefault(); // Prevents page from reloading
    var topic = $("#remove-topic").val().trim().toLowerCase(); // Grabs value from the remove-topic text box
    if (topic.length > 0) {
      // Ensures that text box isn't empty when button is clicked
      const index = topics.indexOf(topic); // Locates index number of topic value
      if (index !== -1) {
        // Ensures that the topic is in fact in the array before running the following code
        topics.splice(index, 1); // Removes topic from array
        localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
        addButton(); // Calls addButton() so that the removed topic is no longer displayed
      }
    }
    $("#remove-topic").val(""); // Clears remove-topic text box
  });

  $(document).on("click", ".btn-dark", function getGifs() {
    // Clears images div of any previous gif results so that only the results of the most recent call are shown
    $("#images").empty();

    // Creates a random number so that a random subset of gifs is returned
    function randomNum() {
      return Math.floor(Math.random() * 50) + 1;
    }

    var url = "https://api.giphy.com/v1/gifs/search"; // Base URL for query
    var key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
    var q = $(this).attr("data-name"); // Uses data-name of button as query term
    var limit = "limit=10"; // Sets response limit to ten gifs at a time
    var offset = "offset=" + randomNum(); // Randomizes which page of gif results is returned
    var rating = "rating=PG-13"; // Keeps the gifs family-friendly
    var lang = "lang=en"; // Use a 2-letter ISO 639-1 language code

    var queryURL = `${url}?${key}&q=${q}&${limit}&${offset}&${rating}&${lang}`; // Complete query URL

    $.ajax({
      // Performs asynchronous HTTP (Ajax) request
      url: queryURL, // URL for request
      method: "GET", // Type of request
    }).then(function (response) {
      // What to do with response (which is an array of objects)
      for (i = 0; i < response.data.length; i++) {
        // For each object inside array
        var card = $("<div>"); // Creates div element object
        var img = $("<img>"); // Creates img element object
        var p = $("<p>"); // Creates p element object
        var info = $("<div>"); // Creates div element object
        var title = $("<h5>"); // Creates h5 element object
        var icon = $("<i>"); // Creates icon element object

        img.addClass("gif card-img-top"); // Adds CSS classes to element
        img.attr("data-id", response.data[i].id); // Adds unique data-id as attribute to allow for selection and manipulation
        img.attr("alt", response.data[i].title); // Creates alt value of image based on object's title
        img.attr("src", response.data[i].images.fixed_width_still.url); // Assigns source url using object's fixed_width_still url (still meaning the gif will not automatically play)
        img.attr("data-state", "still"); // Assigns state to still
        img.attr("data-animate", response.data[i].images.fixed_width.url); // Provides animated gif url as data
        img.attr("data-still", response.data[i].images.fixed_width_still.url); // Provides still gif url as data

        icon.addClass("icon far fa-heart"); // Adds CSS classes to element
        // Duplicates all of the above image attributes (as well as the gif's rating) so that the gif can be added to faves by clicking on the icon
        icon.attr("data-id", response.data[i].id);
        icon.attr("alt", response.data[i].title);
        icon.attr("src", response.data[i].images.fixed_width_still.url);
        icon.attr("data-state", "still");
        icon.attr("data-animate", response.data[i].images.fixed_width.url);
        icon.attr("data-still", response.data[i].images.fixed_width_still.url);
        icon.attr("data-rating", response.data[i].rating);

        card.addClass("card h-300"); // Adds CSS class

        info.addClass("card-body"); // Adds CSS class

        title.addClass("card-title"); // Adds CSS class
        title.text(response.data[i].title); // Inserts text to title element

        p.addClass("card-text"); // Adds CSS class
        p.text("Rating: " + response.data[i].rating); // Inserts text to rating element

        $(images).prepend(card); // Adds gif element to beginning of images element
        $(card).append(img); // Adds img element to card element
        $(card).append(icon); // Adds icon element to card element
        $(card).append(info); // Adds info element to card element
        $(info).append(title); // Adds title element to info element
        $(info).append(p); // Adds rating element to info element
      } //for loop close
    }); //ajax.then closing tag
  }); //getGifs closing tag

  $(document).on("click", ".icon", function toggleFave() {
    // On click of a gif's heart icon, calls toggleFave

    if ($(this).hasClass("far")) {
      // If the current class of the icon includes "far", then it is not currently a fave
      $(this).removeClass("icon far fa-heart").addClass("icon fas fa-heart"); // Changes icon from a white outline heart to a red, filled heart indicating new favorite status of gif
      var faveGif = {
        // Creates new faveGif object with all relevant properties and values
        dataId: $(this).attr("data-id"),
        gifAlt: $(this).attr("alt"),
        gifSrc: $(this).attr("src"),
        dataAnimate: $(this).attr("data-animate"),
        dataStill: $(this).attr("data-still"),
        rating: $(this).attr("data-rating"),
      };
      faves.push(faveGif); // Pushes new faveGif object into array
      localStorage.setItem("favorites", JSON.stringify(faves)); // Converts updated array to string and saves to local storage
    } else {
      $(this).removeClass("icon fas fa-heart").addClass("icon far fa-heart"); // If class is "fas", then gif is currently a favorite and needs to be removed from faves
      const getDataId = $(this).attr("data-id"); // Grabs the data-id for the gif
      const searchIndex = faves.findIndex((fave) => fave.dataId == getDataId); // Locates the index of (first) gif with the specific data-id
      faves.splice(searchIndex, 1); // Removes the gif object at searchIndex
      localStorage.setItem("favorites", JSON.stringify(faves)); // Converts updated array to string and saves to local storage
      displayFaves(); // Calls displayFaves() to show updated array
    }
  });

  const displayFaves = () => {
    // Generates gif cards for each object in array
    // Reference above Ajax function for specifics
    $("#images").empty();
    for (k = 0; k < faves.length; k++) {
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
  };

  $("#fave-button").on("click", displayFaves); // On click of fave-button, populates the image div with all favorited gifs

  $(document).on("click", ".gif", function toggleState() { // Toggles the still/animated state of whichever gif is clicked
    var state = $(this).attr("data-state"); // Grabs the current data-state value and assigns it to variable "state"

    if (state === "still") { // Toggles the state and current image src url accordingly
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
