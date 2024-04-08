import data from "./assets/data.js";

const productsContainer = document.querySelector('.products');
const searchInput = document.querySelector('.search');
const categoriesContainer = document.querySelector('.cats');
const priceRange = document.querySelector('.priceRange');
const priceValue = document.querySelector('.priceValue');
const ascendingBtn = document.querySelector('#ascending');
const descendingBtn = document.querySelector('#descending');
const urlParams = new URLSearchParams(window.location.search);

let filterSettings = {
    catSelected: urlParams.get('catSelected') || 'All',
    priceSelected: getMaxPrice(),
    sortOrder: urlParams.get('sortOrder') || 'default',
    isSearch: false,
};

function initApp() {
    setPrices();
    setCategories();
    displayProducts(data);
    applyFilters();
};
initApp();

priceRange.addEventListener('input', handlePriceRangeChange);
searchInput.addEventListener('input', handleSearchInputChange);
categoriesContainer.addEventListener('click', handleCategoryClick);
ascendingBtn.addEventListener('click', handleSortOrderChange);
descendingBtn.addEventListener('click', handleSortOrderChange);

window.addEventListener('popstate', () => {
    applyFilters();
});

function handlePriceRangeChange(e) {
    priceValue.textContent = e.target.value + ' UAH';
    filterSettings.priceSelected = +e.target.value;
    updateURL();
    applyFilters();
}

function handleSearchInputChange(e) {
    const value = e.target.value.toLowerCase();
    filterSettings.isSearch = !!value;
    updateURL();
    applyFilters();
}

function handleCategoryClick(e) {
    const selectedCat = e.target.textContent;
    if (e.target.tagName === 'DIV') return;
    filterSettings.catSelected = selectedCat;
    updateURL();
    applyFilters();
}

function handleSortOrderChange() {
    filterSettings.sortOrder = this.id;
    updateURL();
    applyFilters();
}

function applyFilters() {
    let filteredProducts = data;
    const value = searchInput.value.toLowerCase();

    if (filterSettings.isSearch) {
        filteredProducts = data.filter(
            (item) => item.name.toLowerCase().indexOf(value) !== -1
        );
    }

    if (filterSettings.catSelected !== 'All') {
        filteredProducts = filteredProducts.filter(
            (item) => item.cat === filterSettings.catSelected
        );
    }

    filteredProducts = filteredProducts.filter(
        (item) => item.price <= filterSettings.priceSelected
    );

    if (filterSettings.sortOrder === 'ascending') {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filterSettings.sortOrder === 'descending') {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

function displayProducts(filteredProducts) {
    if (filteredProducts.length) {
        productsContainer.innerHTML = filteredProducts
            .map(
                (product) => `
                <div class="product">
                    <img draggable="false" alt="watches" src=${product.img}>
                    <span class="name">${product.name}</span>
                    <span class="priceText">${product.price} UAH</span>
                </div>
            `
            )
            .join('');
    } else {
        productsContainer.innerHTML = `<span>NO DATA</span>`;
    }
}

function setPrices() {
    const priceList = data.map((item) => item.price);
    const minPrice = Math.min(...priceList);
    const maxPrice = Math.max(...priceList);

    priceRange.min = minPrice;
    priceRange.max = maxPrice;
    priceRange.value = filterSettings.priceSelected;
    priceValue.textContent = filterSettings.priceSelected + ' UAH';
}

function getMaxPrice() {
    const priceList = data.map((item) => item.price);
    return Math.max(...priceList);
}

function setCategories() {
    const allCats = data.map((item) => item.cat);
    const categories = ['All', ...new Set(allCats)];
    categoriesContainer.innerHTML = categories
        .map(
            (cat) =>
                `
          <span class="cat">${cat}</span>
      `
        )
        .join('');
}

function updateURL() {
    const urlParams = new URLSearchParams();
    urlParams.set('catSelected', filterSettings.catSelected);
    // urlParams.set('priceSelected', filterSettings.priceSelected);
    urlParams.set('sortOrder', filterSettings.sortOrder);
    // urlParams.set('isSearch', filterSettings.isSearch);
    const newURL = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newURL);
}
