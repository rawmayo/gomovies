import { makeHtml } from "./modules/utilities.js";

const getFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites"));

  if (favorites.length > 0) {
    document.querySelector(".no-favorites").innerText =
      "Showing all your favorites";
    favorites.forEach(async (id) => {
      const url = `https://www.omdbapi.com/?apikey=ae9a00dc&i=${id}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        createCards(data);
        viewSelected();
        unlike();
      }
    });
  }
};

const unlike = () => {
  const unlikeBtns = document.querySelectorAll(".unlike-btn");
  const container = document.querySelector(".selected-favorites-container");

  unlikeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const unlikeId = btn.getAttribute("data-imdb-id");
      const cardToRemove = [...document.querySelectorAll(".card")].find(
        (card) => card.getAttribute("data-imdb-id") === unlikeId
      );

      if (cardToRemove !== undefined) {
        const favorites = JSON.parse(localStorage.getItem("favorites"));
        favorites.length - 1 < 1 &&
          (document.querySelector(".no-favorites").innerText =
            "You have no favorites");
        localStorage.setItem(
          "favorites",
          JSON.stringify(favorites.filter((fav) => fav !== unlikeId))
        );

        container.removeChild(cardToRemove);
      }
    });
  });
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

const createCards = (data) => {
  const { Title, Year, imdbID, Poster } = data;

  const container = document.querySelector(".selected-favorites-container");
  const cardDiv = makeHtml("div", undefined, ["card"], {
    "data-imdb-id": data.imdbID,
  });

  const topSec = makeHtml("div", undefined, ["top-section"]);
  const posterImg = makeHtml("img", undefined, undefined, {
    src: Poster !== "N/A" ? Poster : "/assets/imgs/no-poster.webp",
    alt: Title,
  });
  topSec.appendChild(posterImg);

  const title = makeHtml("h2", undefined, ["title"]);
  title.innerText = Title;
  topSec.appendChild(title);

  const yr = makeHtml("span", undefined, ["year"]);
  yr.innerText = Year;
  topSec.appendChild(yr);
  cardDiv.appendChild(topSec);

  const bottomSec = makeHtml("div", undefined, ["bottom-section"]);
  const btnView = makeHtml("button", undefined, ["btn", "select-btn"], {
    type: "button",
    "data-imdb-id": imdbID,
  });
  btnView.innerText = "View details";
  const btnViewIcon = makeHtml("i", undefined, ["fa-solid", "fa-arrow-right"]);
  btnView.appendChild(btnViewIcon);
  bottomSec.appendChild(btnView);

  const btnUnlike = makeHtml("button", undefined, ["btn", "unlike-btn"], {
    type: "button",
    "data-imdb-id": imdbID,
  });
  btnUnlike.innerText = "Unlike";
  const btnUnlikeIcon = makeHtml("i", undefined, [
    "fa-solid",
    "fa-heart-circle-xmark",
  ]);
  btnUnlike.appendChild(btnUnlikeIcon);
  bottomSec.appendChild(btnUnlike);
  cardDiv.appendChild(bottomSec);

  container.appendChild(cardDiv);
};

const init = () => {
  getFavorites();
};

// Initialize
init();
