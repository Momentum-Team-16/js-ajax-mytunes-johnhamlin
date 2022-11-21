'use strict';

const displayResults = function (data) {
  // remove all existing child nodes
  const searchResults = document.getElementById('search-results');
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }

  // Function to handle all the DOM stuff
  const buildAndAppendElement = function (
    text,
    parentElement,
    elementType,
    classesArr
  ) {
    const newElement = document.createElement(elementType);
    if (classesArr) newElement.classList.add(...classesArr);
    newElement.innerText = text;
    parentElement.appendChild(newElement);
    return newElement;
  };

  data.results.forEach(result => {
    const albumArt = result.artworkUrl100;
    const trackName = result.trackName;
    const artistName = result.artistName;
    const audioURL = result.previewURL;
    console.log(result.artistName);

    const card = document.createElement('div');
    card.classList.add('card', 'm-4', 'p-0', 'border-0');

    // Create card body where all items will be added
    const cardBody = buildAndAppendElement('', card, 'div', ['card-body']);

    // Create and add album art
    const img = buildAndAppendElement('', cardBody, 'img', [
      'album-art',
      'card-img-top',
      'img-thumbnail',
      'mb-4',
    ]);
    img.src = albumArt;

    // Add artist name and track name
    buildAndAppendElement(artistName, cardBody, 'h3', ['card-title']);
    buildAndAppendElement(trackName, cardBody, 'h6', ['card-subtitle', 'mb-2']);

    searchResults.appendChild(card);
  });
};

const search = function searchItunesAPI(event) {
  event.preventDefault();
  const searchField = document.getElementById('search');
  const query = searchField.value;
  const queryURI = encodeURIComponent(query);
  console.log(queryURI);
  fetch(
    `https://itunes.apple.com/search?term=${queryURI}&country=us&media=music&limit=20`
  )
    .then(response => response.json())
    .then(displayResults);
};

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', search);
