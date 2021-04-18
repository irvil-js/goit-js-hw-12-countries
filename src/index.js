import './styles.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop.css';
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
import './js/countries.js';
import fetchSearchCountries from './js/fetchCountries.js';
import countryItemsTemplate from './templates/description-country.hbs';
import countriesListTemplate from './templates/list-countries.hbs';
import { info, error, defaults } from '@pnotify/core/dist/PNotify.js';
//import { info, error, defaults } from '@pnotify/core';
import debounce from 'lodash.debounce';

defaults.title = "Irina's search page";
defaults.styling = 'material';
defaults.icons = 'material';

let lastFailed = '';

const refs = {
  searchForm: document.querySelector('#search-form'),
  countryList: document.querySelector('#country-list'),
  searchInput: document.querySelector('.search__input'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();

  if (!searchQuery || searchQuery.length === 0) {
    return;
  }

  fetchSearchCountries(searchQuery).then(data => {
    if (!data) {
      error({
        text: 'Ничего не найдено. Корректно введите запрос',
        styling: 'material',
        icons: 'material',
      });
      lastFailed = searchQuery;
      return;
    }

    const markup = buildListItemMarkup(data);
    const renderCountriesList = buildCountriesList(data);

    if (data.length > 10) {
      info({
        text: 'Too many matches found. Please enter a more specific query!',
      });
    } else if (data.length > 1 && data.length <= 10) {
      insertListItem(renderCountriesList);
    } else if (data.length === 1) {
      insertListItem(markup);
    } else {
      error({
        text: 'Ничего не найдено. Корректно введите запрос',
      });
      lastFailed = searchQuery;
      return;
    }
  });
}

function insertListItem(items) {
  refs.countryList.insertAdjacentHTML('beforeend', items);
}

function buildCountriesList(items) {
  return countriesListTemplate(items);
}

function buildListItemMarkup(items) {
  return countryItemsTemplate(items);
}

function clearListItems() {
  refs.countryList.innerHTML = '';
}
