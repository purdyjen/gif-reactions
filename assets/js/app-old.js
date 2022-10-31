// checks local storage for topics and faves arrays
// If topics and/or faves is not saved to storage, then assigns topics and/or faves variable as an empty array
// If topics and/or faves is saved to storage, then grabs the string, parses it, and converts it back to an array

let topics = JSON.parse(localStorage.getItem("topics")) || [];
let faves = JSON.parse(localStorage.getItem("favorites")) || [];

const topicsDiv = document.getElementById("topics");
const addBtn = document.getElementById("add-button");
const addTopic = document.getElementById("add-topic");
const removeBtn = document.getElementById("remove-button");
const removeTopic = document.getElementById("remove-topic");
const imagesDiv = document.getElementById("images");
const faveBtn = document.getElementById("fave-button");
// If null, populates the topics array with eight values and then saves it into local storage
imagesDiv.innerText = "";
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
  topicsDiv.innerHTML = ""; // Clears topics div to ensure only current topics are shown
  for (i = 0; i < topics.length; i++) {
    const newButton = document.createElement("button"); // Creates new Button element
    newButton.setAttribute("class", "btn btn-dark"); // Adds the relevant CSS classes for styling
    newButton.setAttribute("data-name", topics[i]); // Creates data-name based on the value
    newButton.innerText = "#" + topics[i]; // Populates text in button based on the value
    topicsDiv.append(newButton); // Adds button to the topics div
  }
}

addButton(); // Calls addButton()

addBtn.addEventListener("click", function () {
  // Triggers function on add-button click
  event.preventDefault(); // Prevents page from reloading
  const topic = addTopic.val().trim().toLowerCase(); // Grabs value from the add-topic text box
  if (topic.length > 0) {
    // Ensures that text box isn't empty when button is clicked
    topics.push(topic); // Pushes new topic to array
    localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
    addButton(); // Calls addButton() so that new button is displayed too
  }
  addTopic.val(""); // Clears add-topic text box
});

removeBtn.addEventListener("click", function () {
  // Triggers function on remove-button click
  event.preventDefault(); // Prevents page from reloading
  removeTopic.val().trim().toLowerCase(); // Grabs value from the remove-topic text box
  if (removeTopic.length > 0) {
    // Ensures that text box isn't empty when button is clicked
    const index = topics.indexOf(topic); // Locates index number of topic value
    if (index !== -1) {
      // Ensures that the topic is in fact in the array before running the following code
      topics.splice(index, 1); // Removes topic from array
      localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
      addButton(); // Calls addButton() so that the removed topic is no longer displayed
    }
  }
  removeTopic.val(""); // Clears remove-topic text box
});

topicsDiv.onclick = function (event) {
  const target = event.target;
  if (!target.getAttribute("data-name")) return;
  const attr = target.getAttribute("data-name");
  sendReq(attr);
};

const sendReq = async (attr) => {
  // Clears images div of any previous gif results so that only the results of the most recent call are shown
  imagesDiv.innerText = "";

  function randomNum() {
    return Math.floor(Math.random() * 50) + 1;
  }
  // Creates a random number so that a random subset of gifs is returned

  let url = "https://api.giphy.com/v1/gifs/search"; // Base URL for query
  let key = "api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD";
  let q = attr; // Uses data-name of button as query term
  let limit = "limit=10"; // Sets response limit to ten gifs at a time
  let offset = "offset=" + randomNum(); // Randomizes which page of gif results is returned
  let rating = "rating=PG-13"; // Keeps the gifs family-friendly
  let lang = "lang=en"; // Use a 2-letter ISO 639-1 language code

  let queryURL = `${url}?${key}&q=${q}&${limit}&${offset}&${rating}&${lang}`; // Complete query URL

  try {
    const response = await fetch(queryURL);
    if (response.ok) {
      const jsonResponse = await response.json();
      for (i = 0; i < jsonResponse.data.length; i++) {
        // For each object inside array
        const card = document.createElement("div"); // Creates div element object
        const img = document.createElement("img"); // Creates img element object
        const p = document.createElement("p"); // Creates p element object
        const info = document.createElement("div"); // Creates div element object
        const title = document.createElement("h5"); // Creates h5 element object
        const icon = document.createElement("i"); // Creates icon element object

        img.setAttribute("class", "gif card-img-top"); // Adds CSS classes to element
        img.setAttribute("data-id", jsonResponse.data[i].id); // Adds unique data-id as attribute to allow for selection and manipulation
        img.setAttribute("alt", jsonResponse.data[i].title); // Creates alt value of image based on object's title
        img.setAttribute(
          "src",
          jsonResponse.data[i].images.fixed_width_still.url
        ); // Assigns source url using object's fixed_width_still url (still meaning the gif will not automatically play)
        img.setAttribute("data-state", "still"); // Assigns state to still
        img.setAttribute(
          "data-animate",
          jsonResponse.data[i].images.fixed_width.url
        ); // Provides animated gif url as data
        img.setAttribute(
          "data-still",
          jsonResponse.data[i].images.fixed_width_still.url
        ); // Provides still gif url as data

        icon.setAttribute("class", "icon far fa-heart"); // Adds CSS classes to element
        // Duplicates all of the above image attributes (as well as the gif's rating) so that the gif can be added to faves by clicking on the icon
        icon.setAttribute("data-id", jsonResponse.data[i].id);
        icon.setAttribute("alt", jsonResponse.data[i].title);
        icon.setAttribute(
          "src",
          jsonResponse.data[i].images.fixed_width_still.url
        );
        icon.setAttribute("data-state", "still");
        icon.setAttribute(
          "data-animate",
          jsonResponse.data[i].images.fixed_width.url
        );
        icon.setAttribute(
          "data-still",
          jsonResponse.data[i].images.fixed_width_still.url
        );
        icon.setAttribute("data-rating", jsonResponse.data[i].rating);

        card.setAttribute("class", "card h-300"); // Adds CSS class

        info.setAttribute("class", "card-body"); // Adds CSS class

        title.setAttribute("class", "card-title"); // Adds CSS class
        title.innerText = jsonResponse.data[i].title; // Inserts text to title element

        p.setAttribute("class", "card-text"); // Adds CSS class
        p.innerText = "Rating: " + jsonResponse.data[i].rating; // Inserts text to rating element

        imagesDiv.prepend(card); // Adds gif element to beginning of images element
        card.append(img); // Adds img element to card element
        card.append(icon); // Adds icon element to card element
        card.append(info); // Adds info element to card element
        info.append(title); // Adds title element to info element
        info.append(p); // Adds rating element to info element
      } //for loop close
    }
  } catch (error) {
    console.log(error);
  }
};

function toggleFave(target) {
  // On click of a gif's heart icon, calls toggleFave

  if (target.getAttribute("class") === "icon far fa-heart") {
    // If the current class of the icon includes "far", then it is not currently a fave
    target.setAttribute("class", "icon fas fa-heart"); // Changes icon from a white outline heart to a red, filled heart indicating new favorite status of gif
    var faveGif = {
      // Creates new faveGif object with all relevant properties and values
      dataId: target.getAttribute("data-id"),
      gifAlt: target.getAttribute("alt"),
      gifSrc: target.getAttribute("src"),
      dataAnimate: target.getAttribute("data-animate"),
      dataStill: target.getAttribute("data-still"),
      rating: target.getAttribute("data-rating"),
    };
    faves.push(faveGif); // Pushes new faveGif object into array
    localStorage.setItem("favorites", JSON.stringify(faves)); // Converts updated array to string and saves to local storage
  } else {
    target.setAttribute("class", "icon far fa-heart"); // If class is "fas", then gif is currently a favorite and needs to be removed from faves
    const getDataId = target.getAttribute("data-id"); // Grabs the data-id for the gif
    const searchIndex = faves.findIndex((fave) => fave.dataId == getDataId); // Locates the index of (first) gif with the specific data-id
    faves.splice(searchIndex, 1); // Removes the gif object at searchIndex
    localStorage.setItem("favorites", JSON.stringify(faves)); // Converts updated array to string and saves to local storage
  }
}

imagesDiv.onclick = function (event) {
  const target = event.target;
  event.preventDefault();
  if (
    target.getAttribute("class") === "icon far fa-heart" ||
    target.getAttribute("class") === "icon fas fa-heart"
  ) {
    toggleFave(target);
  } else if (target.getAttribute("class") === "gif card-img-top") {
    toggleState(target);
  }
};

const displayFaves = () => {
  // Generates gif cards for each object in array
  // This code has to be duplicated and modified from above Ajax function because of how objects in the faves array are structured compared to objects in the ajax response
  imagesDiv.innerText = "";
  for (k = 0; k < faves.length; k++) {
    const card = document.createElement("div"); // Creates div element object
    const img = document.createElement("img"); // Creates img element object
    const p = document.createElement("p"); // Creates p element object
    const info = document.createElement("div"); // Creates div element object
    const title = document.createElement("h5"); // Creates h5 element object
    const icon = document.createElement("i"); // Creates icon element object

    img.setAttribute("class", "gif card-img-top");
    img.setAttribute("data-id", faves[k].dataId);
    img.setAttribute("alt", faves[k].gifAlt);
    img.setAttribute("src", faves[k].gifSrc);
    img.setAttribute("data-state", "still");
    img.setAttribute("data-animate", faves[k].dataAnimate);
    img.setAttribute("data-still", faves[k].dataStill);

    icon.setAttribute("class", "icon fas fa-heart");
    icon.setAttribute("data-id", faves[k].dataId);
    icon.setAttribute("alt", faves[k].gifAlt);
    icon.setAttribute("src", faves[k].gifSrc);
    icon.setAttribute("data-state", "still");
    icon.setAttribute("data-animate", faves[k].dataAnimate);
    icon.setAttribute("data-still", faves[k].dataStill);
    icon.setAttribute("data-rating", faves[k].rating);

    card.setAttribute("class", "card h-300");

    info.setAttribute("class", "card-body");

    title.setAttribute("class", "card-title");
    title.innerText = faves[k].gifAlt;

    p.setAttribute("class", "card-text");
    p.innerText = "Rating: " + faves[k].rating;

    imagesDiv.prepend(card);
    card.append(img);
    card.append(icon);
    card.append(info);
    info.append(title);
    info.append(p);
  }
};

// faveBtn.addEventListener("click", displayFaves()); // On click of fave-button, populates the image div with all favorited gifs

function toggleState(target) {
  // Toggles the still/animated state of whichever gif is clicked

  const state = target.getAttribute("data-state"); // Grabs the current data-state value and assigns it to variable "state"

  if (state === "still") {
    // Toggles the state and current image src url accordingly
    const animateVal = target.getAttribute("data-animate");
    target.setAttribute("src", animateVal);
    target.setAttribute("data-state", "animate");
  } else if (state === "animate") {
    const stillVal = target.getAttribute("data-still");
    target.setAttribute("src", stillVal);
    target.setAttribute("data-state", "still");
  }
} //toggleState closing tag
