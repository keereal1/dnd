/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/localstorage.js

function saveCards() {
  const cards = {
    todo: getCards(".todo"),
    inProgress: getCards(".inProgress"),
    done: getCards(".done")
  };
  localStorage.setItem("cards", JSON.stringify(cards));
}
function getCards(selector) {
  const cardsData = [];
  document.querySelectorAll(`${selector} .card .text`).forEach(card => {
    cardsData.push(card.textContent);
  });
  return cardsData;
}
function loadCards(todo, inProgress, done) {
  const cardsContent = JSON.parse(localStorage.getItem("cards"));
  if (!cardsContent) {
    return;
  }
  cardsContent.todo.forEach(card => {
    addCard(card, todo);
  });
  cardsContent.inProgress.forEach(card => {
    addCard(card, inProgress);
  });
  cardsContent.done.forEach(card => {
    addCard(card, done);
  });
}
function addCard(cardContent, collumn) {
  const card = createCard(cardContent);
  collumn.append(card);
}
;// CONCATENATED MODULE: ./src/js/app.js

function createCard(textContent) {
  const card = document.createElement("div");
  card.classList.add("card");
  const text = document.createElement("span");
  text.classList.add("text");
  text.textContent = textContent;
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("close");
  const cross = document.createElement("span");
  cross.classList.add("cross");
  cross.textContent = "×";
  removeBtn.append(cross);
  card.append(text);
  card.append(removeBtn);
  removeBtn.addEventListener("click", deleteCard);
  removeBtn.addEventListener("mousedown", e => {
    e.stopPropagation();
  });
  return card;
}
function deleteCard(e) {
  e.preventDefault();
  const el = e.currentTarget;
  const parent = el.closest(".card");
  parent.remove();
  saveCards();
}
document.addEventListener("DOMContentLoaded", () => {
  const toDoCards = document.querySelector(".todo");
  const inProgressCards = document.querySelector(".inProgress");
  const doneCards = document.querySelector(".done");
  const addBtns = document.querySelectorAll(".add-card-btn");
  function createTextForm(e) {
    const el = e.currentTarget;
    const parent = el.closest(".collumn");
    const currentForm = document.querySelector(".form-container");
    if (currentForm) {
      currentForm.remove();
    }
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");
    const form = document.createElement("form");
    form.classList.add("form");
    const field = document.createElement("textarea");
    field.classList.add("text-field");
    field.placeholder = "Enter a title for this card ...";
    field.addEventListener("mousedown", event => {
      event.stopPropagation();
    });
    const createBtn = document.createElement("button");
    createBtn.classList.add("formBtn", "create-card");
    createBtn.textContent = "Add Card";
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("cross", "close-form");
    closeBtn.textContent = "\u2715";
    form.append(field);
    form.append(createBtn);
    form.append(closeBtn);
    formContainer.append(form);
    if (parent.querySelector(".todo")) {
      createBtn.classList.add("toDoCollumn");
      toDoCards.append(formContainer);
    } else if (parent.querySelector(".inProgress")) {
      createBtn.classList.add("inProgressCollumn");
      inProgressCards.append(formContainer);
    } else if (parent.querySelector(".done")) {
      createBtn.classList.add("doneCollumn");
      doneCards.append(formContainer);
    }
    closeBtn.addEventListener("click", e => {
      e.preventDefault();
      formContainer.remove();
    });
    createBtn.addEventListener("click", addNewCard);
  }
  addBtns.forEach(button => {
    button.addEventListener("click", createTextForm);
  });
  function addNewCard(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const formContainer = document.querySelector(".form-container");
    const field = document.querySelector(".text-field");
    if (field.value.trim() === "") {
      return;
    }
    const card = createCard(field.value);
    if (el.classList.contains("toDoCollumn")) {
      toDoCards.append(card);
    } else if (el.classList.contains("inProgressCollumn")) {
      inProgressCards.append(card);
    } else if (el.classList.contains("doneCollumn")) {
      doneCards.append(card);
    }
    formContainer.remove();
    saveCards();
  }
  loadCards(toDoCards, inProgressCards, doneCards);

  //Drag and drop
  let activeElement;
  let shiftX, shiftY;
  const container = document.querySelector(".tasks-container");
  function createPlaceholder() {
    const placeEl = document.createElement("div");
    placeEl.classList.add("placeholder");
    placeEl.style.width = activeElement.offsetWidth + "px";
    placeEl.style.height = activeElement.offsetHeight + "px";
    return placeEl;
  }
  function removePlaceholder() {
    const placeEl = document.querySelector(".placeholder");
    if (!placeEl) return;
    placeEl.remove();
  }
  function mouseDown(e) {
    e.preventDefault();
    activeElement = e.target.closest(".card");
    if (!activeElement) {
      return;
    }
    const {
      left,
      top
    } = activeElement.getBoundingClientRect();
    shiftX = e.clientX - left;
    shiftY = e.clientY - top;
    activeElement.classList.add("dragged");
    activeElement.style.cursor = "grabbing";
    container.addEventListener("mouseover", onMouseOver);
    container.addEventListener("mouseup", onMouseUp);
  }
  container.addEventListener("mousedown", mouseDown);
  function onMouseOver(e) {
    activeElement.style.top = e.clientY - shiftY + "px";
    activeElement.style.left = e.clientX - shiftX + "px";
    removePlaceholder();
    const placeEl = createPlaceholder();
    const mouseOverItem = e.target;
    const closestCard = mouseOverItem.closest(".card");
    if (!closestCard) {
      const closestCardContainer = mouseOverItem.querySelector(".cards-list");
      if (!closestCardContainer) return;
      closestCardContainer.append(placeEl);
    } else {
      const parentElement = closestCard.closest(".cards-list");
      parentElement.insertBefore(placeEl, closestCard);
    }
  }
  function onMouseUp(e) {
    console.log(e);
    const mouseUpItem = e.target;
    const closestCard = mouseUpItem.closest(".card");
    if (!closestCard) {
      const closestCardContainer = mouseUpItem.querySelector(".cards-list");
      if (!closestCardContainer) return;
      closestCardContainer.append(activeElement);
    } else {
      const parentElement = closestCard.closest(".cards-list");
      parentElement.insertBefore(activeElement, closestCard);
    }
    activeElement.classList.remove("dragged");
    activeElement = undefined;
    removePlaceholder();
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseover", onMouseOver);
    saveCards();
  }
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;