'use strict';

const displayResults = function (data) {
  data.results.forEach(result => {
    console.log(result.artistName);
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
