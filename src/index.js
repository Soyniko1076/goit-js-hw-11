import { fetchEvents } from './object-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input'),
  loader: document.querySelector('.loader'),
  form: document.querySelector('.search-form'),
  button: document.querySelector('.load-more'),
  list:document.querySelector('.info')
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
      refs.button.classList.remove('unvisible');
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
        return `<div class="photo-card  shadow6"><img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" width="330" height="230"><ul class="info"><li class="item"><p class="info-item">Likes</p><p class="descrip">${likes}</p></li><li class="item"><p class="info-item">Views</p><p class="descrip">${views}</p></li><li class="item"><p class="info-item">Comments</p><p class="descrip">${comments}</p></li><li class="item"><p class="info-item">Downloads</p><p class="descrip">${downloads}</p></li></ul></div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', marcup);
}

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  queryToFetch = event.target.elements.searchQuery.value;
  pageToFetch = 1;
  refs.gallery.innerHTML = '';
  getEvents(queryToFetch, pageToFetch);
}

refs.button.addEventListener('click', hendlLoadMore);

function hendlLoadMore() {
  pageToFetch += 1;
  getEvents(queryToFetch, pageToFetch);
}
