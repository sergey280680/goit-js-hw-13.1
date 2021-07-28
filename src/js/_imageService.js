const axios = require('axios');
const API_KEY = '22022827-e7833ac6793c04553f9ed3424';
const BASE_URL = 'https://pixabay.com/api/';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = true;

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 10;
  }

  async fetchImages() {
    let url = `${BASE_URL}?key=${API_KEY}&safesearch=${SAFESEARCH}&orientation=${ORIENTATION}&image_type=${IMAGE_TYPE}&per_page=${this.perPage}&page=${this.page}&q=${this.searchQuery}`;

    const response = await axios.get(url);

    this.page += 1;
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }
}
