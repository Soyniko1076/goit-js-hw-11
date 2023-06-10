import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/';
const API_KEY = '37053525-954bf5b1abb6340838a01bbc5';

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

async function fetchEvents(keyword, page) {
  try {
    const { data } = await axios(
      `api/?key=${API_KEY}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&$page=${page}`
    );
    return data;
  } catch (error) {
    console.log(error);
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again in 5 minutes`
    );
  }
}

async function getEvents(query, page) {
  const data = await fetchEvents(query, page);
  console.log(page);
  if (data.totalHits !== 0) {
    if (page === 1) {
      Notify.success('Hooray! We found 500 images');
    }
    const events = data.hits;
    renderEvents(events);
    lightbox.refresh();
    observer.observe(refs.guard);
    pageToFetch += 1;
  } else {
    Notify.failure(
      `Sorry, there are no images matching your search query "${query}". Please try another query.`
    );
  }
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
