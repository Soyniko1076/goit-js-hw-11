import { fetchEvents } from './object-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input'),
  loader: document.querySelector('.loader'),
  form: document.querySelector('.search-form'),
  button: document.querySelector('.load-more'),
};

function getEvents(query) {
  fetchEvents(query)
    .then(data => {
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

getEvents('human');

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
        return `<div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"><div class="info"><p class="info-item"><b>${likes}</b></p><p class="info-item"><b>${views}</b></p><p class="info-item"><b>${comments}</b></p><p class="info-item"><b>${downloads}</b></p></div></div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', marcup);
}
