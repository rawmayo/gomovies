import { makeHtml } from "./modules/utilities.js";

const getSelectedDetails = async () => {
  if (!localStorage.getItem("id")) {
    location.href = "index.html";
    return;
  }

  const id = localStorage.getItem("id");

  const url = `https://www.omdbapi.com/?apikey=ae9a00dc&i=${id}`;
  const encodedURL = encodeURI(url);

  const response = await fetch(encodedURL);

  const data = await response.json();

  if (data) {
    setDetailsPage(data);
    hideLoader();
  }
};

const hideLoader = () => {
  document.querySelector(".loader").style.display = "none";
};

const setDetailsPage = (data) => {
  document
    .querySelector(".poster")
    .setAttribute(
      "src",
      data.Poster !== "N/A" ? data.Poster : "../assets/imgs/no-poster.webp"
    );

  document.querySelector("header.view-header").style.background = `url(${
    data.Poster !== "N/A" ? data.Poster : "../assets/imgs/no-poster.webp"
  }) repeat center`;

  document.querySelector(".title").innerText = data.Title;

  const genreArray = data.Genre.split(", ");
  const genreContainer = document.querySelector(".genre-container");
  genreArray.forEach((genre) => {
    const span = makeHtml("span", undefined, ["genre"]);
    span.innerText = genre;
    genreContainer.appendChild(span);
  });

  const imdb = document.querySelector(".imdb-value");
  imdb.innerHTML = `<i class="fa-solid fa-star"></i> ${data.imdbRating}`;
  const metascore = document.querySelector(".metascore-value");
  metascore.innerHTML = `<i class="fa-solid fa-certificate"></i> ${data.Metascore}`;

  document.getElementById("synopsis").innerText = data.Plot;
  document.getElementById("director").innerText = data.Director;
  document.getElementById("actors").innerText = data.Actors;
  document.getElementById("writer").innerText = data.Writer;
  document.getElementById("release").innerText = data.Released;
  document.getElementById("rated").innerText = data.Rated;
  document.getElementById("duration").innerText = data.Runtime;
  document.getElementById("lang").innerText = data.Language;
  document.getElementById("country").innerText = data.Country;
  document.getElementById("awards").innerText = data.Awards;
  document.getElementById("dvd").innerText = data.DVD;
  document.querySelector(".boxoffice").innerText =
    data.BoxOffice !== undefined ? data.BoxOffice : "N/A";
  document.getElementById("imb").innerText =
    data.Ratings.length === 1 ? data.Ratings[0].Value : "N/A";
  document.getElementById("rotten").innerText =
    data.Ratings.length === 2 ? data.Ratings[1].Value : "N/A";
  document.getElementById("metacritics").innerText =
    data.Ratings.length === 3 ? data.Ratings[2].Value : "N/A";
};

const init = () => {
  getSelectedDetails();
};

// Initialize
init();
