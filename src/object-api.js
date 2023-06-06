const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053525-954bf5b1abb6340838a01bbc5';

export const fetchEvents = keyword => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true&per_page=10`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => console.log(error));
};
