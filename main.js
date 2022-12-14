'use strict';
class SearchResult {
  constructor(result) {
    this.type = result.wrapperType;
    this.art = result.artworkUrl100;
    this.hed = result.artistName;
    this.subHed = result.trackName;
    this.audioURL = result.previewUrl;
  }
}
const searchResultsCache = {};

// const keys = {
//   track: {
//     hed: result.artistName,
//   },
//   album: {},
//   musicArtist: {},
// };

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

const cacheResults = function (result) {
  const searchResult = new SearchResult(result);
  const id = result.trackId || result.collectionId || result.artistId;
  searchResultsCache[id] = searchResult;
  return [searchResult, id];
};

const displayResults = function (data) {
  // Clear the search results area
  searchResults.replaceChildren();

  data.results.forEach(result => {
    // Create new object for the result and store it in the cache by a unique ID from the API
    const [searchResult, id] = cacheResults(result);

    // Build the card, store it's ID as as data tag and add it to the DOM
    const card = document.createElement('div');
    card.classList.add('card', 'm-4', 'p-0', 'border-0', 'shadow-sm');
    card.dataset.id = id;

    // Create and add album art
    const img = buildAndAppendElement('', card, 'img', [
      'album-art',
      'card-img-top',
      // 'mb-1',
    ]);
    img.src = searchResult.art;

    // Create card body where all items will be added
    const cardBody = buildAndAppendElement('', card, 'div', ['card-body']);
    // Add headline and subheadling (usually artist name and track name)
    buildAndAppendElement(searchResult.hed, cardBody, 'h4', ['card-title']);
    buildAndAppendElement(searchResult.subHed, cardBody, 'h6', [
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
    return;
  }
  const queryURI = encodeURIComponent(query);
  const searchType = document.getElementById('search-type');
  const url = `https://itunes.apple.com/search?term=${queryURI}&country=us&media=music&limit=20&entity=${searchType.value}`;

  if (searchType.value === 'song') return loadSongs(url);
  if (searchType.value === 'album') return loadSongs(url);
  if (searchType.value === 'musicArtist') return loadSongs(url);
};

const playSong = function (searchResult) {
  const audioEl = document.getElementById('audio-player');
  const nowPlayingEl = document.getElementById('now-playing');
  audioEl.src = searchResult.audioURL;
  audioEl.play();
  nowPlayingEl.innerText = `Now Playing: ${searchResult.hed} by ${searchResult.subHed}`;
};

const getSongFromClick = function (event) {
  if (event.target.id === 'search-results') return;
  // get the top-level card element containing the event clicked, where the dataset.id is stored
  let card = event.target.closest('.card');
  const searchResult = searchResultsCache[card.dataset.id];
  if (searchResult.type === 'track') playSong(searchResult);
};

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', search);
const searchResults = document.getElementById('search-results');
searchResults.addEventListener('click', getSongFromClick);
