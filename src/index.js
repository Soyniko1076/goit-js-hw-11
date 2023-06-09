const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053525-954bf5b1abb6340838a01bbc5';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  guard: document.querySelector('.guard'),
};

const lightbox = new SimpleLightbox('.gallery a');

let pageToFetch = 1;
let queryToFetch = '';

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        getEvents(queryToFetch, pageToFetch);
      }
    });
  },
  { rootMargin: '200px' }
);

function fetchEvents(keyword) {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
}

function getEvents(query, page) {
  fetchEvents(query, page)
    .then(data => {
      if (data.totalHits !== 0) {
        Notify.success('Hooray! We found 500 images');
        const events = data.hits;
        renderEvents(events);
        lightbox.refresh();
        observer.observe(refs.guard);
      } else {
        Notify.failure(
          `Sorry, there are no images matching your search query "${query}". Please try another query.`
        );
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again in 5 minutes`
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
        return `<div class="photo-card  shadow6"><a href="${largeImageURL}"><img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" width="330" height="230"></a><ul class="info"><li class="item"><p class="info-item">Likes</p><p class="descrip">${likes}</p></li><li class="item"><p class="info-item">Views</p><p class="descrip">${views}</p></li><li class="item"><p class="info-item">Comments</p><p class="descrip">${comments}</p></li><li class="item"><p class="info-item">Downloads</p><p class="descrip">${downloads}</p></li></ul></div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', marcup);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.5,
    behavior: 'smooth',
  });
}

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const inputValue = event.target.elements.searchQuery.value;
  if (!inputValue.trim() || inputValue === queryToFetch) {
    return;
  }
  queryToFetch = inputValue;
  pageToFetch = 1;
  refs.gallery.innerHTML = '';

  getEvents(queryToFetch, pageToFetch);
}
