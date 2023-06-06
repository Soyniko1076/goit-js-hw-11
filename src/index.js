import { fetchEvents } from './object-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  list: document.querySelector('.list'),
  input: document.querySelector('.input'),
  loader: document.querySelector('.loader'),
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

getEvents('cat');

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
        return `<li class="wrapper"><img src="${webformatURL}" alt="${tags}" width="300"><p>${likes}</p><p>${views}</p><p>${comments}</p><p>${downloads}</p></li>`;
      }
    )
    .join('');
  refs.list.insertAdjacentHTML('beforeend', marcup);
}
