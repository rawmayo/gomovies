import {
  toggleTypeSelect,
  makeHtml,
  toggleLoader,
  setResultText,
  clearSearchField,
  showLoadMoreBtn,
  removeCardsFromContainer,
} from "./modules/utilities.js";
import processQuery from "./modules/process.js";

const createCards = (data) => {
  const { Title, Year, imdbID, Poster } = data;

  const favorites = JSON.parse(localStorage.getItem("favorites"));

  const container = document.querySelector(".card-container");
  const cardDiv = makeHtml("div", undefined, ["card"]);

  const topSec = makeHtml("div", undefined, ["top-section"]);
  const posterImg = makeHtml("img", undefined, undefined, {
    src:
      Poster !== "N/A"
        ? Poster
        : "https://rawmayo.github.io/gomovies/assets/imgs/no-poster.jpg",
    alt: Title,
  });
  topSec.appendChild(posterImg);

  let classNames;
  if (favorites && favorites.includes(data.imdbID)) {
    classNames = ["fa-solid", "fa-heart", "my-fav", "favorite"];
  } else {
    classNames = ["fa-regular", "fa-heart", "favorite"];
  }

  const favIcon = makeHtml("i", undefined, classNames, {
    "data-imdb-id": data.imdbID,
  });
  topSec.appendChild(favIcon);

  const title = makeHtml("h2", undefined, ["title"]);
  title.innerText = Title;
  topSec.appendChild(title);

  const yr = makeHtml("span", undefined, ["year"]);
  yr.innerText = Year;
  topSec.appendChild(yr);
  cardDiv.appendChild(topSec);

  const bottomSec = makeHtml("div", undefined, ["bottom-section"]);
  const btn = makeHtml("button", undefined, ["btn", "select-btn"], {
    type: "button",
    "data-imdb-id": imdbID,
  });
  btn.innerText = "View details";
  const btnIcon = makeHtml("i", undefined, ["fa-solid", "fa-arrow-right"]);
  btn.appendChild(btnIcon);
  bottomSec.appendChild(btn);
  cardDiv.appendChild(bottomSec);

  container.appendChild(cardDiv);
};

const saveSelectedFavorite = () => {
  const favBtns = document.querySelectorAll(".favorite");

  favBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-imdb-id");

      if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([id]));
      } else {
        const favorites = JSON.parse(localStorage.getItem("favorites"));
        if (favorites.includes(id)) {
          localStorage.setItem(
            "favorites",
            JSON.stringify(favorites.filter((fav) => fav !== id))
          );
          btn.classList.remove("my-fav");
          btn.classList.replace("fa-solid", "fa-regular");
          return;
        }
        favorites.push(id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }

      btn.classList.add("my-fav");
      btn.classList.replace("fa-regular", "fa-solid");
    });
  });
};

const getMoreData = (url, count = 0) => {
  if (url === undefined) return;

  const loadBtn = document.querySelector(".btn-load");

  let n = 2;
  let tmpResults = 10;

  loadBtn.addEventListener("click", async () => {
    const pageUrl = `${url}&page=${n}`;
    const totalResults = count;

    const response = await fetch(pageUrl);

    const data = await response.json();

    if (
      data.Response === "True" &&
      tmpResults + data.Search.length < totalResults
    ) {
      tmpResults += data.Search.length;
      n++;

      [...data.Search].forEach((data) => {
        createCards(data);
      });
      viewSelected();
    } else {
      [...data.Search].forEach((data) => {
        createCards(data);
      });
      showLoadMoreBtn(false);
      viewSelected();
    }
  });
};

const getData = () => {
  const searchBox = document.querySelector(".search-box");

  if (searchBox === null) return;

  searchBox.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedType = getSelectedType().toLowerCase().trim();

    const searchQuery = getSearchQuery().trim();

    if (searchQuery.trim().length < 1) return;

    removeCardsFromContainer();
    showLoadMoreBtn(false);

    toggleLoader();

    const { data, url } = await processQuery(searchQuery, selectedType);

    if (data.Search) {
      setResultText(searchQuery);
      if (parseInt(data.totalResults) > 10) {
        showLoadMoreBtn(true);
        getMoreData(url, parseInt(data.totalResults));
      }
      toggleLoader();
      clearSearchField();
      [...data.Search].forEach((data) => {
        createCards(data);
      });
      viewSelected();
      saveSelectedFavorite();
    } else {
      toggleLoader();
      setResultText(searchQuery, false, selectedType);
      clearSearchField();
    }
  });
};

const getSearchQuery = () => {
  return document.querySelector(".search-input").value;
};

const getSelectedType = () => {
  return document.querySelector(".btn-select").innerText;
};

const viewSelected = () => {
  const selectedBtns = document.querySelectorAll(".select-btn");

  selectedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-imdb-id");

      localStorage.setItem("id", id);
      location.href = "details.html";
    });
  });
};

const init = () => {
  toggleTypeSelect();
  getData();
};

// Initialize
init();
