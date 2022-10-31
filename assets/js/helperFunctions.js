export const buildCards = (arr, isFave) => {
  const imagesDiv = document.getElementById("images");
  for (let i = 0; i < arr.length; i++) {
    // For each object inside array
    const card = document.createElement("div"); // Creates div element object
    const img = document.createElement("img"); // Creates img element object
    const p = document.createElement("p"); // Creates p element object
    const info = document.createElement("div"); // Creates div element object
    const title = document.createElement("h5"); // Creates h5 element object
    const icon = document.createElement("i"); // Creates icon element object

    img.setAttribute("class", "gif card-img-top");
    img.setAttribute("data-id", arr[i].dataId);
    img.setAttribute("alt", arr[i].gifAlt);
    img.setAttribute("src", arr[i].gifSrc);
    img.setAttribute("data-state", "still");
    img.setAttribute("data-animate", arr[i].dataAnimate);
    img.setAttribute("data-still", arr[i].dataStill);

    if (isFave) {
      icon.setAttribute("class", "icon fas fa-heart");
    } else {
      icon.setAttribute("class", "icon far fa-heart");
    }
    icon.setAttribute("data-id", arr[i].dataId);
    icon.setAttribute("alt", arr[i].gifAlt);
    icon.setAttribute("src", arr[i].gifSrc);
    icon.setAttribute("data-state", "still");
    icon.setAttribute("data-animate", arr[i].dataAnimate);
    icon.setAttribute("data-still", arr[i].dataStill);
    icon.setAttribute("data-rating", arr[i].rating);

    card.setAttribute("class", "card h-300");

    info.setAttribute("class", "card-body");

    title.setAttribute("class", "card-title");
    title.innerText = arr[i].gifAlt;

    p.setAttribute("class", "card-text");
    p.innerText = "Rating: " + arr[i].rating;

    imagesDiv.prepend(card);
    card.append(img);
    card.append(icon);
    card.append(info);
    info.append(title);
    info.append(p);
  } //for loop close
};

const buildGifObj = (arr) => {
  const gifArr = [];
  for (let i = 0; i < arr.length; i++) {
    const newGif = {
      // Creates new faveGif object with all relevant properties and values
      dataId: arr[i].id,
      gifAlt: arr[i].title,
      gifSrc: arr[i].images.fixed_width_still.url,
      dataAnimate: arr[i].images.fixed_width.url,
      dataStill: arr[i].images.fixed_width_still.url,
      rating: arr[i].rating,
    };
    gifArr.push(newGif);
  }
  return gifArr;
};

export const buildQuery = (attr) => {
  function randomNum() {
    return Math.floor(Math.random() * 50) + 1;
  }
  // Creates a random number so that a random subset of gifs is returned

  let url = "https://api.giphy.com/v1/gifs/search"; // Base URL for query
  let key = `api_key=TetrpMjBeTZDHJDhshu2qZwVTVoobDCD`;
  let q = attr; // Uses data-name of button as query term
  let limit = "limit=10"; // Sets response limit to ten gifs at a time
  let offset = "offset=" + randomNum(); // Randomizes which page of gif results is returned
  let rating = "rating=PG-13"; // Keeps the gifs family-friendly
  let lang = "lang=en"; // Use a 2-letter ISO 639-1 language code

  let queryURL = `${url}?${key}&q=${q}&${limit}&${offset}&${rating}&${lang}`; // Complete query URL
  return queryURL;
};

export const sendReq = async (attr) => {
  // Clears images div of any previous gif results so that only the results of the most recent call are shown
  const imagesDiv = document.getElementById("images");
  imagesDiv.innerText = "";
  const queryURL = buildQuery(attr);

  try {
    const response = await fetch(queryURL);
    if (response.ok) {
      const jsonResponse = await response.json();
      const gifArr = buildGifObj(jsonResponse.data);
      buildCards(gifArr, false);
    }
  } catch (error) {
    console.log(error);
  }
};
