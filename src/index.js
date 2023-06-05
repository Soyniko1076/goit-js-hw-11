const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053525-954bf5b1abb6340838a01bbc5';

function fetchEvents(keyword) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: keyword,
    // image_type: photo,
    // orientation: horizontal,
    // safesearch: true,
  });

  fetch(`${BASE_URL}?${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => console.log(error));
}

fetchEvents('cat')