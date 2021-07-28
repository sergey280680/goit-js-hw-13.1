import ImageApiService from './_imageService';
import imageCardTpl from '../templates/photo-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import '../../node_modules/simplelightbox/dist/simple-lightbox.css';
import './_imageService';
import LoadMoreBtn from './_loadMoreBtn';
import refs from './_refs.js';

let lightbox = new SimpleLightbox('.gallery a');
const imageApiService = new ImageApiService();
const { searchForm, imageContainer, loadMoreBtn } = refs;
const loadMorebtn = new LoadMoreBtn({
  selector: '.load-more',
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

// поиск запроса
async function onSearch(e) {
  e.preventDefault();
  imageApiService.resetPage();

  loadMorebtn.hide();

  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  searchForm.reset();
  clearImgContainer();

  if (imageApiService.searchQuery.trim() === '') {
    return;
  }
  loadMorebtn.show();

  loadMorebtn.disable();
  try {
    const res = await imageApiService.fetchImages();

    appendImageMarkup(res.hits);
    if (res.hits.length === 0) {
      loadMorebtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${res.total} images.`);

    loadMorebtn.show();
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
  loadMorebtn.enable();
}

// кнопка показать еще
async function onLoadMore() {
  loadMorebtn.disable();
  try {
    const res = await imageApiService.fetchImages();

    if (res.hits.length === 0) {
      getTotalImgCount();
    } else {
      appendImageMarkup(res.hits);
      loadMorebtn.enable();
    }
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

// добавление картинок при клике на LoadMore
function appendImageMarkup(data) {
  imageContainer.insertAdjacentHTML('beforeend', imageCardTpl(data));
}

// очистка разметки при клике на search
function clearImgContainer() {
  imageContainer.innerHTML = '';
}

function getTotalImgCount() {
  loadMorebtn.hide();
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
