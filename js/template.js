const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
let currentPage = 1;
const cardsPerPage = 10;
let offers = [];

document.addEventListener("DOMContentLoaded", () => {
  const offerCardsContainer = document.getElementById("offerCardsContainer");

  fetchOffers(currentPage);

  function createOfferCard(offers) {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const slicedOffers = offers.slice(startIndex, endIndex);
    const cardContainer = document.createElement("div");

    const catRow = document.createElement("div");
    catRow.className = "row mt-5";
    catRow.innerHTML = `<h3>${category.replace(/-/g, " ")}</h3>`;
    cardContainer.appendChild(catRow);

    const row = document.createElement("div");
    row.className = "row ";

    row.innerHTML = generateOfferCards(slicedOffers);
    cardContainer.appendChild(row);

    const paginationRow = document.createElement("div");
    paginationRow.className = "row mt-5";

    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = generatePagination(offers);

    paginationRow.appendChild(col);
    cardContainer.appendChild(paginationRow);

    return cardContainer;
  }

  function generateOfferCards(offers) {
    let card = "";

    // Open a row before the loop
    card += '<div class="row row-cols-1 row-cols-md-5 g-4">';

    for (let j = 0; j < offers.length; j++) {
      const offerSrc = offers[j].image;

      card += `
      
        <div class="col">
        <a href="${
          offers[j].url.startsWith("coupon/")
            ? `coupon.html?id=${offers[j].id}`
            : offers[j].url
        }" target="_blank" class="text-decoration-none">
          <div class="card ">
           
            <img src="images/${offerSrc}" class="img-fluid   object-fit-cover" alt="..."> 
            <div class="card-body">
              <h5 class="card-title text-danger fs-6 fw-semibold">${offers[j].headline}</h5>
              <p>${offers[j].advertiser}</p>
      </div>
      
          </div>
          </a>
        </div>
        
       
      `;

      if ((j + 1) % 5 === 0 && j !== offers.length - 1) {
        card += '</div><div class="row row-cols-1 row-cols-md-5 g-4">';
      }
    }

    // Close the final row
    card += "</div>";

    return card;
  }

  function generatePagination(offers) {
    const totalPages = Math.ceil(offers.length / cardsPerPage);

    let paginationHTML = `
      <nav>
        <ul class="pagination justify-content-center">
    `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <li class="page-item ${
          i === currentPage ? "active" : ""
        }"><a class="page-link text-dark" href="#" onclick="handlePagination(${i})">${i}</a></li>
      `;
    }

    paginationHTML += `
        </ul>
      </nav>
    `;

    return paginationHTML;
  }

  window.handlePagination = function (page) {
    currentPage = page;
    offerCardsContainer.innerHTML = "";
    offerCardsContainer.appendChild(createOfferCard(offers));
  };

  function fetchOffers(page) {
    fetch(`data/offer.json`)
      .then((response) => response.json())
      .then((data) => {
        // Find the category with the specified name
        const categoryData = data.find((cat) =>
          cat.offers.some((offer) => offer.category === category)
        );
        if (categoryData) {
          offers = categoryData.offers.find(
            (cat) => cat.category === category
          ).offers_in_category;
          handlePagination(page); // Display the specified page
        } else {
          console.error(`Category not found: ${category}`);
        }
      });
  }
});
