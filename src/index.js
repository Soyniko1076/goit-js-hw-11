import { fetchEvents } from './object-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input'),
  loader: document.querySelector('.loader'),
  form: document.querySelector('.search-form'),
  button: document.querySelector('.load-more'),
};

let pageToFetch = 1;
let queryToFetch = '';

function getEvents(query, page) {
  fetchEvents(query, page)
    .then(data => {
      Notify.success('Hooray! We found 500 images');
      const events = data.hits;
      console.log(events);
      renderEvents(events);
    })
    .catch(error => {
      console.log(error);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function renderEvents(events) {
  const marcup = events
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="330" height="230"><div class="info"><p class="info-item"><b>${likes}</b></p><p class="info-item"><b>${views}</b></p><p class="info-item"><b>${comments}</b></p><p class="info-item"><b>${downloads}</b></p></div></div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', marcup);
}

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  queryToFetch = event.target.elements.searchQuery.value;
  getEvents(queryToFetch, pageToFetch);
}
