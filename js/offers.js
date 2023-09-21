const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
let currentPage = 1;
const cardsPerPage =50;
let offers = [];

document.addEventListener('DOMContentLoaded', () => {
  const offerCardsContainer = document.getElementById('offerCardsContainer');

  const categoryHeading = document.getElementById('categoryHeading');
  

  // Fetch data from JSON and initialize
  fetch('data/offer.json')
    .then((response) => response.json())
    .then((data) => {
      // Find the category with the specified name
      const categoryData = data.find((cat) =>
        cat.offers.some((offer) => offer.category === category)
      );

      if (categoryData) {
        categoryHeading.innerText = category.replace(/-/g, " ")
        offers = categoryData.offers.find((cat) => cat.category === category)
          .offers_in_category;
        handlePagination(currentPage);
      } else {
        console.error(`Category not found: ${category}`);
      }
    });

  
  // Function to create offer cards
function createOfferCards(offers) {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedOffers = offers.slice(startIndex, endIndex);

  offerCardsContainer.innerHTML = '';

  paginatedOffers.forEach((offer) => {
    const card = document.createElement('div');
    card.className=''
    
    // Check if the offer has a valid image URL
    const imageUrl = offer.image ? offer.image : 'placeholder.jpg';

    card.innerHTML = `
      <div class="card">
      <a href="${
        offer.url.startsWith("coupon/")
          ? `coupon.html?id=${offer.id}`
          : offer.url
      }" target="_blank" class="text-decoration-none">
        <img src="images/${imageUrl}" class="card-img-top" alt="${offer.headline}"> </a>
        <div class="card-body">
        <a href="${
          offer.url.startsWith("coupon/")
            ? `coupon.html?id=${offer.id}`
            : offer.url
        }" target="_blank" class="text-decoration-none">
          <h5 class="card-title text-danger">${offer.headline}</h5> </a>
          <a href="${
            offer.url.startsWith("coupon/")
              ? `coupon.html?id=${offer.id}`
              : offer.url
          }" target="_blank" class="text-decoration-none"> <p class="card-text text-dark">${offer.advertiser}</p> </a>
        </div>
      </div>
    `;
    offerCardsContainer.appendChild(card);
  });
}


  // Pagination function
  window.handlePagination = function (page) {
    currentPage = page;
    createOfferCards(offers);
  };
});

