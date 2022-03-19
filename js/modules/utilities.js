export const toggleTypeSelect = () => {
  document.querySelector(".btn-select").addEventListener("click", () => {
    document.querySelector(".fa-caret-down").classList.toggle("rotate");
    document
      .querySelector(".search-type-dropdown")
      .classList.toggle("v-hidden");

    setSelectedText();
  });
};

export const makeHtml = (
  element = "",
  elementId = undefined,
  classNames = [],
  attribs = {}
) => {
  const el = document.createElement(element);

  if (elementId !== undefined) {
    el.id = elementId;
  }

  if (classNames.length > 0) {
    classNames.forEach((className) => el.classList.add(className));
  }

  if (Object.keys(attribs).length > 0) {
    Object.keys(attribs).forEach((key, i) => {
      el.setAttribute(key, Object.values(attribs)[i]);
    });
  }

  return el;
};

export const toggleLoader = () => {
  document.querySelector(".loader").classList.toggle("d-none");
};

export const setResultText = (query = "", found = true, selected = "") => {
  if (found) {
    document.querySelector(
      ".search-count"
    ).innerText = `Showing search results for "${query}"`;
  } else {
    document.querySelector(
      ".search-count"
    ).innerText = `Sorry, we can't find the ${selected} "${query}"`;
  }
};

export const clearSearchField = () => {
  document.querySelector(".search-input").value = "";
};

export const showLoadMoreBtn = (show = false) => {
  if (!show) {
    document.querySelector(".load-more").classList.add("d-none");
  } else {
    document.querySelector(".load-more").classList.remove("d-none");
  }
};

export const removeCardsFromContainer = () => {
  const container = document.querySelector(".card-container");

  [...container.children].forEach((child) => {
    if (child.classList.contains("card")) {
      container.removeChild(child);
    }
  });
};

/**
 * Local functions
 */

const setSelectedText = () => {
  const types = document.querySelectorAll(".types");

  types.forEach((type) => {
    type.addEventListener("click", () => {
      document.querySelector(
        ".btn-select"
      ).innerHTML = `${type.innerText} <i class="fa-solid fa-caret-down "></i>`;
      document.querySelector(".search-type-dropdown").classList.add("v-hidden");
    });
  });
};
