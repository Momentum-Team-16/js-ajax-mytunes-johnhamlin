'use strict';

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

const displayResults = function (data) {
  // remove all existing child nodes
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }

  data.results.forEach((result, index) => {
    // const keys = {
    //   track: {
    //     hed: result.artistName,
    //   },
    //   album: {},
    //   musicArtist: {},
    // };
    const type = result.wrapperType;
    const card = document.createElement('div');
    card.classList.add('card', 'm-4', 'p-0', 'border-0', 'shadow-sm');
    // Give nice names to things from the results and, if needed later, store them in datasets
    const art = result.artworkUrl100;
    card.dataset.hed = result.artistName;
    card.dataset.subHed = result.trackName;
    card.dataset.audioURL = result.previewUrl;
    card.dataset.type = result.wrapperType;
    console.log(card.dataset.type);

    // Create and add album art
    const img = buildAndAppendElement('', card, 'img', [
      'album-art',
      'card-img-top',
      // 'mb-1',
    ]);
    img.src = art;

    // Create card body where all items will be added
    const cardBody = buildAndAppendElement('', card, 'div', ['card-body']);
    // Add artist name and track name
    buildAndAppendElement(card.dataset.hed, cardBody, 'h4', ['card-title']);
    buildAndAppendElement(card.dataset.subHed, cardBody, 'h6', [
      'card-subtitle',
      'mb-2',
    ]);

    searchResults.appendChild(card);
  });
};

const loadSongs = function (url) {
  fetch(url)
    .then(response => response.json())
    .then(displayResults)
    .catch(error =>
      console.error('There was an error fetching the data for iTunes')
    );
};

const search = function searchItunesAPI(event) {
  event.preventDefault();
  const searchField = document.getElementById('search');
  const query = searchField.value;
  // disallow blank searches
  if (!query) {
    let temp = buildAndAppendElement(
      'Please enter something to search for',
      searchResults,
      'h3',
      ['text-align-center']
    );
    console.log(temp);

    return;
  }
  const queryURI = encodeURIComponent(query);
  const searchType = document.getElementById('search-type');
  const url = `https://itunes.apple.com/search?term=${queryURI}&country=us&media=music&limit=20&entity=${searchType.value}`;

  if (searchType.value === 'song') return loadSongs(url);
  if (searchType.value === 'album') return loadSongs(url);
  if (searchType.value === 'musicArtist') return loadSongs(url);
};

const playSong = function (card) {
  const audioEl = document.getElementById('audio-player');
  const nowPlayingEl = document.getElementById('now-playing');
  audioEl.src = card.dataset.audioURL;
  audioEl.play();
  nowPlayingEl.innerText = `Now Playing: ${card.dataset.trackName} by ${card.dataset.artistName}`;
};

const getSongFromClick = function (event) {
  if (event.target.id === 'search-results') return;
  // get the top-level card element containing the event clicked
  let card = event.target;
  while (!Array.from(card.classList).includes('card')) {
    console.log(card);

    card = card.parentElement;
  }
  console.log(card);
  if (card.dataset.type === 'track') playSong(card);
};

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', search);
const searchResults = document.getElementById('search-results');
searchResults.addEventListener('click', getSongFromClick);
