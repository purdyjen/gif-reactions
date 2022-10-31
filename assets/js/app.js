import { buildCards, sendReq } from "./helperFunctions.js";

// checks local storage for topics and faves arrays
// If topics and/or faves is not saved to storage, then assigns topics and/or faves variable as an empty array
// If topics and/or faves is saved to storage, then grabs the string, parses it, and converts it back to an array

let topics = JSON.parse(localStorage.getItem("topics")) || [];
let faves = JSON.parse(localStorage.getItem("favorites")) || [];

const topicsDiv = document.getElementById("topics");
const addBtn = document.getElementById("add-button");
const removeBtn = document.getElementById("remove-button");
const addTopic = document.getElementById("add-topic");
const removeTopic = document.getElementById("remove-topic");
const imagesDiv = document.getElementById("images");

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
function createButton() {
  const topicsDiv = document.getElementById("topics");
  topicsDiv.innerHTML = ""; // Clears topics div to ensure only current topics are shown
  for (let i = 0; i < topics.length; i++) {
    const newButton = document.createElement("button"); // Creates new Button element
    newButton.setAttribute("class", "btn btn-dark"); // Adds the relevant CSS classes for styling
    newButton.setAttribute("data-name", topics[i]); // Creates data-name based on the value
    newButton.innerText = "#" + topics[i]; // Populates text in button based on the value
    topicsDiv.append(newButton); // Adds button to the topics div
  }
}

createButton(); // Calls createButton()

addBtn.addEventListener("click", function (e) {
  // Triggers function on add-button click
  e.preventDefault(); // Prevents page from reloading
  const topic = addTopic.value.trim().toLowerCase(); // Grabs value from the add-topic text box
  if (topic.length > 0) {
    // Ensures that text box isn't empty when button is clicked
    const index = topics.indexOf(topic); // Locates index number of topic value
    if (index === -1) {
      topics.push(topic); // Pushes new topic to array
      localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
      createButton(); // Calls createButton() so that new button is displayed too
    } else {
      alert("You've already added that topic.");
    }
  }
  addTopic.value = ""; // Clears add-topic text box
});

addTopic.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevents page from reloading
    const topic = addTopic.value.trim().toLowerCase(); // Grabs value from the add-topic text box
    if (topic.length > 0) {
      // Ensures that text box isn't empty when button is clicked
      const index = topics.indexOf(topic); // Locates index number of topic value
      if (index === -1) {
        topics.push(topic); // Pushes new topic to array
        localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
        createButton(); // Calls createButton() so that new button is displayed too
      } else {
        alert("You've already added that topic.");
      }
    }
    addTopic.value = ""; // Clears add-topic text box
  }
});
removeBtn.addEventListener("click", function (e) {
  // Triggers function on remove-button click
  e.preventDefault(); // Prevents page from reloading
  const topic = removeTopic.value.trim().toLowerCase(); // Grabs value from the remove-topic text box
  if (topic.length > 0) {
    // Ensures that text box isn't empty when button is clicked
    const index = topics.indexOf(topic); // Locates index number of topic value
    if (index !== -1) {
      // Ensures that the topic is in fact in the array before running the following code
      topics.splice(index, 1); // Removes topic from array
      localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
      createButton(); // Calls createButton() so that the removed topic is no longer displayed
    }
  }
  removeTopic.value = ""; // Clears remove-topic text box
});

removeTopic.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevents page from reloading
    const topic = removeTopic.value.trim().toLowerCase(); // Grabs value from the remove-topic text box
    if (topic.length > 0) {
      // Ensures that text box isn't empty when button is clicked
      const index = topics.indexOf(topic); // Locates index number of topic value
      if (index !== -1) {
        // Ensures that the topic is in fact in the array before running the following code
        topics.splice(index, 1); // Removes topic from array
        localStorage.setItem("topics", JSON.stringify(topics)); // Converts updated array to string and saves to local storage
        createButton(); // Calls createButton() so that the removed topic is no longer displayed
      }
    }
    removeTopic.value = ""; // Clears remove-topic text box
  }
});

topicsDiv.onclick = function (e) {
  const target = e.target;
  if (!target.getAttribute("data-name")) return;
  const attr = target.getAttribute("data-name");
  sendReq(attr);
};

function toggleFave(target) {
  // On click of a gif's heart icon, calls toggleFave

  if (target.getAttribute("class") === "icon far fa-heart") {
    // If the current class of the icon includes "far", then it is not currently a fave
    target.setAttribute("class", "icon fas fa-heart"); // Changes icon from a white outline heart to a red, filled heart indicating new favorite status of gif
    const faveGif = {
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

const displayFaves = () => {
  imagesDiv.innerText = "";
  buildCards(faves, true);
};

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

imagesDiv.onclick = function (e) {
  const target = e.target;
  e.preventDefault();
  if (
    target.getAttribute("class") === "icon far fa-heart" ||
    target.getAttribute("class") === "icon fas fa-heart"
  ) {
    toggleFave(target);
  } else if (target.getAttribute("class") === "gif card-img-top") {
    toggleState(target);
  }
};
