document.addEventListener("DOMContentLoaded", () => {
  const offerContainer = document.getElementById("offerContainer");



  

  fetch("data/offer.json")
    .then((response) => response.json())
    .then((data) => {
      const offerCategories = data[0].offers;

      offerCategories.forEach((category) => {
        const categoryName = category.category;

        const offerList = category.offers_in_category;

        const offerCard = createOfferCard(categoryName, offerList);
        offerContainer.appendChild(offerCard);
      });
      renderCategoriesForMegaMenu(offerCategories);
      renderCategoriesForFooter(offerCategories);
    });

  // Create offer card with name and images
  function createOfferCard(offer, images) {
    const offerCard = document.createElement("div");
    console.log(window.location.href);
    offerCard.className = "container mt-5";
    offerCard.innerHTML = `
        <div class="row my-3 "> 
        <div class="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start text-center text-md-start">
            <h2 class="text-dark ">${offer.replace(/-/g, " ")}</h2>
          </div>
          <div class="col-md-6 d-none d-md-block ">
            <a href="  
            offers.html?category=${encodeURIComponent(
      offer
    )}" class="btn  loginbtn float-end">View more</a>
          </div>
        </div>
        <div id="${offer}-slider" class="carousel carousel-dark slide" data-bs-ride="carousel" >
          <div class="carousel-inner">
            ${generateCarouselItems(images)}
          </div>
          ${images.length > 5 ? generateCarouselControls(offer) : ""}
        </div>
        <div class="col  d-md-none d-flex flex-column align-items-center text-center   mt-3 ">
            <a href="offers.html?category=${encodeURIComponent(
      offer
    )}" class="btn  loginbtn float-end">View more</a>
          </div>
      `;
    return offerCard;
  }

  function generateCarouselItems(cards) {
    let slideshowHTML = "";
    const maxImagesToShow = Math.min(cards.length, 15);

    for (let i = 0; i < maxImagesToShow; i += 5) {
      const isActive = i === 0 ? "active" : "";

      slideshowHTML += `
          <div class="carousel-item ${isActive}" data-bs-interval="false">
            <div class="row g-3">
        `;

      for (let j = i; j < i + 5; j++) {
        if (j < maxImagesToShow) {
          slideshowHTML += `
              <div class="col-12 col-md card-col ">
                <div class="card ">
                  <a href="${
                    cards[j].url.startsWith("coupon/")
                      ? `/coupon/coupon.html?id=${cards[j].id}`
                      : cards[j].url
                  }" target="_blank" class="text-decoration-none">
                    <img src="images/${
                      cards[j].image
                    }" class="img-fluid" alt="Image">
                  </a>
                  <div class="card-body">
                    <a href="${
                      cards[j].url.startsWith("coupon/")
                        ? `/coupon/coupon.html?id=${cards[j].id}`
                        : cards[j].url
                    }" target="_blank" class="text-decoration-none">
                      <h5 class="card-title text-danger fs-6 fw-semibold">${
                        cards[j].headline
                      }</h5>
                    </a>
                    <a href="${
                      cards[j].url.startsWith("coupon/")
                        ? `/coupon/coupon.html?id=${cards[j].id}`
                        : cards[j].url
                    }" target="_blank" class="text-decoration-none">
                      <p class="card-text text-dark">${cards[j].advertiser}.</p>
                    </a>
                  </div>
                </div>
              </div>
            `;
        } else {
          slideshowHTML += `
              <div class="col"></div>
            `;
        }
      }

      slideshowHTML += `
            </div>
          </div>
        `;

      `<div><p>Hello</p></div>`;
    }

    return slideshowHTML;
  }

  function generateCarouselControls(offer) {
    return `
        <button class="carousel-control-prev" type="button" data-bs-target="#${offer}-slider" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${offer}-slider" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      `;
  }

  function renderCategoriesForMegaMenu(categories) {
    const catMobileDropdown = document.getElementById("catMobileDropdown");

    if (catMobileDropdown) {
      catMobileDropdown.innerHTML = "";

      categories.forEach((category) => {
        const categoryListItem = document.createElement("li");
        const categoryLink = document.createElement("a");
        categoryLink.textContent = category.category.replace(/-/g, " ");
        categoryLink.href = `offers.html?category=${encodeURIComponent(category.category)}`;
        categoryLink.classList.add("dropdown-item", "text-dark");
        categoryListItem.appendChild(categoryLink);
        catMobileDropdown.appendChild(categoryListItem);
      });
    }

    // Check if the mega menu container exists (for desktop view)
    const megaMenuContainer = document.querySelector(".mega-menu");

    if (megaMenuContainer) {
      const maxCategoriesPerColumn = 3;
      const totalCategories = categories.length;
      const columnsCount = Math.ceil(totalCategories / maxCategoriesPerColumn);
      const row = document.createElement("div");
      row.className = "row p-3 ";

      for (let i = 0; i < columnsCount; i++) {
        const column = document.createElement("div");
        column.className = "col-lg";

        const categoryList = document.createElement("ul");
        categoryList.className = "list-unstyled text-nowrap";

        for (
          let j = i * maxCategoriesPerColumn;
          j < (i + 1) * maxCategoriesPerColumn && j < totalCategories;
          j++
        ) {
          const category = categories[j];
          const categoryItem = document.createElement("li");
          const categoryLink = document.createElement("a");
          categoryLink.className = "nav-link text-dark";
          categoryLink.href = `offers.html?category=${encodeURIComponent(category.category)}`;
          categoryLink.textContent = category.category.replace(/-/g, " ");
          categoryItem.appendChild(categoryLink);
          categoryList.appendChild(categoryItem);
        }

        column.appendChild(categoryList);
        row.appendChild(column);
      }
      megaMenuContainer.appendChild(row);
    }
  }

  function renderCategoriesForFooter(categories) {
    const ul = document.getElementById("footerCategories");
    ul.innerHTML = "";

    categories.forEach((category) => {
      const categoryListItem = document.createElement("li");
      const categoryLink = document.createElement("a");
      categoryLink.textContent = category.category.replace(/-/g, " ");
      categoryLink.href = `offers.html?category=${encodeURIComponent(category.category)}`;
      categoryLink.classList.add("nav-link", "text-dark");
      categoryListItem.appendChild(categoryLink);
      ul.appendChild(categoryListItem);
    });
  }
});

/* back to top */

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to get the current year
function getCurrentYear() {
  return new Date().getFullYear();
}

// Update the desktop year
const desktopCurrentYear = document.getElementById("desktopCurrentYear");
if (desktopCurrentYear) {
  desktopCurrentYear.textContent = getCurrentYear();
}

// Update the mobile year
const mobileCurrentYear = document.getElementById("mobileCurrentYear");
if (mobileCurrentYear) {
  mobileCurrentYear.textContent = getCurrentYear();
}
