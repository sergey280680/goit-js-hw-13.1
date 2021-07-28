import './imageService';
import ImageApiService from './imageService';
import imageCardTpl from '../templates/photo-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import '../../node_modules/simplelightbox/dist/simple-lightbox.css';
let lightbox = new SimpleLightbox('.gallery a');

const imageApiService = new ImageApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  imageContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// поиск запроса
async function onSearch(e) {
  e.preventDefault();
  imageApiService.resetPage();
  clearImgContainer();
  refs.loadMoreBtn.classList.add('is-hidden');
  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  refs.searchForm.reset();

  if (imageApiService.searchQuery.trim() === '') {
    return;
  }

  try {
    const res = await imageApiService.fetchImages();

    appendImageMarkup(res.hits);

    if (res.hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${res.total} images.`);

    refs.loadMoreBtn.classList.remove('is-hidden');
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

// кнопка показать еще
async function onLoadMore() {
  try {
    const res = await imageApiService.fetchImages();

    if (res.hits.length === 0) {
      getTotalImgCount();
    } else {
      appendImageMarkup(res.hits);
    }
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

// добавление картинок при клике на LoadMore
function appendImageMarkup(data) {
  refs.imageContainer.insertAdjacentHTML('beforeend', imageCardTpl(data));
}

// очистка разметки при клике на search
function clearImgContainer() {
  refs.imageContainer.innerHTML = '';
}

function getTotalImgCount() {
  refs.loadMoreBtn.classList.add('is-hidden');
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
