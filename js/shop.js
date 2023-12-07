// script.js

document.addEventListener('DOMContentLoaded', function () {
    const parentCategoryFilter = document.getElementById('parentCategoryFilter');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceRangeFilter = document.getElementById('priceRangeFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const productListing = document.getElementById('productListing');

    // Fetch data from shoppingoffers.json
    fetch('data/shop.json')
        .then(response => response.json())
        .then(data => {
            // Populate filters with options
             populateFilterOptions(parentCategoryFilter, getParentCategories(data.CategoryGroups.ParentCategories));
            populateFilterOptions(brandFilter, getUniqueBrands(data.ShoppingOffers));
            populateFilterOptions(priceRangeFilter, getUniquePriceRanges(data.ShoppingOffers));

            // Event listener for parent category change
            parentCategoryFilter.addEventListener('change', function () {
                const selectedParentCategory = parentCategoryFilter.value;
                // Populate subcategory filter based on the selected parent category
                populateFilterOptions(subCategoryFilter, getSubcategories(selectedParentCategory, data.CategoryGroups.ParentCategories));
            });

            // Event listener for applying filters
            applyFiltersBtn.addEventListener('click', function () {
                const selectedParentCategory = parentCategoryFilter.value;
                const selectedSubCategory = subCategoryFilter.value;
                const selectedCategory = categoryFilter.value;
                const selectedBrand = brandFilter.value;
                const selectedPriceRange = priceRangeFilter.value;

                // Filter products based on selected filters
                const filteredProducts = filterProducts(selectedParentCategory, selectedSubCategory, selectedCategory, selectedBrand, selectedPriceRange, data.ShoppingOffers);

                // Display filtered products
                displayProducts(filteredProducts);
            });

            // Initial product listing
            displayProducts(data.ShoppingOffers);
        })
        .catch(error => console.error('Error fetching data:', error));
});

// Function to populate filter options
function populateFilterOptions(selectElement, value) {
    selectElement.innerHTML = `<input type="checkbox" value="" id="parentCategoryFilter" checked="">
    <label for="shop-filter-checkbox_1">Adidas</label>`
    value.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        selectElement.add(optionElement);
    });
}





// // Function to populate filter options
// function populateFilterOptions(selectElement, options) {
//     selectElement.innerHTML = '<option value="">All</option>';
//     options.forEach(option => {
//         const optionElement = document.createElement('option');
//         optionElement.value = option;
//         optionElement.text = option;
//         selectElement.add(optionElement);
//     });
// }

// Function to get unique parent categories
function getParentCategories(parentCategories) {
    return parentCategories.map(category => category.ParentCategory);
}

// Function to get subcategories based on parent category
function getSubcategories(parentCategory, parentCategories) {
    const category = parentCategories.find(category => category.ParentCategory === parentCategory);
    return category ? category.SubCategories.map(subCategory => subCategory.SubCategory) : [];
}

// Function to get unique brands
function getUniqueBrands(products) {
    return [...new Set(products.map(product => product.Brand))];
}

// Function to get unique price ranges
function getUniquePriceRanges(products) {
    return [...new Set(products.map(product => product.PriceRange))];
}

// Function to filter products based on selected filters
function filterProducts(parentCategory, subCategory, category, brand, priceRange, products) {
    return products.filter(product => (
        (parentCategory === '' || product.ParentCategory === parentCategory) &&
        (subCategory === '' || product.SubCategory === subCategory) &&
        (category === '' || product.Category === category) &&
        (brand === '' || product.Brand === brand) &&
        (priceRange === '' || product.PriceRange === priceRange)
    ));
}

// Function to render data on the page
function displayProducts(results) {
	pagination.innerHTML = "";

	if (results.length === 0) {
        productListing.innerHTML = '';
	} else {
		const cardsPerPage = 8;
		let currentPage = 1;
		const maxVisiblePages = 10;

		// Create a pagination element with previous and next buttons
		const nav = document.createElement("nav");
		const ul = document.createElement("ul");
		ul.classList.add("pagination");
		nav.appendChild(ul);

		// Function to update the page numbers
		function updatePageNumbers() {
			ul.innerHTML = "";

			// Calculate the range of page numbers to display
			const numPages = Math.ceil(results.length / cardsPerPage);
			let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
			let endPage = Math.min(numPages, startPage + maxVisiblePages - 1);
			startPage = Math.max(1, endPage - maxVisiblePages + 1);

			// Create a previous button
			if (currentPage > 1) {
				const previousLi = document.createElement("li");
				previousLi.classList.add("page-item");
				const previousLink = document.createElement("a");
				previousLink.classList.add("page-link", "text-dark");
				previousLink.href = "#";
				previousLink.textContent = "Previous";
				previousLi.appendChild(previousLink);
				ul.appendChild(previousLi);

				previousLink.addEventListener("click", (e) => {
					e.preventDefault();
					currentPage--;
					updatePageNumbers();
					displayCards();
				});
			}

			// Create page number buttons
			for (let page = startPage; page <= endPage; page++) {
				const li = document.createElement("li");
				li.classList.add("page-item");
				const a = document.createElement("a");
				a.classList.add("page-link", "text-dark");
				a.href = "#";
				a.textContent = page;
				li.appendChild(a);
				ul.appendChild(li);

				a.addEventListener("click", (e) => {
					e.preventDefault();
					currentPage = page;
					updatePageNumbers();
					displayCards();
				});

				if (page === currentPage) {
					li.classList.add("active");
				}
			}

			// Create a next button
			if (currentPage < numPages) {
				const nextLi = document.createElement("li");
				nextLi.classList.add("page-item");
				const nextLink = document.createElement("a");
				nextLink.classList.add("page-link", "text-dark");
				nextLink.href = "#";
				nextLink.textContent = "Next";
				nextLi.appendChild(nextLink);
				ul.appendChild(nextLi);

				nextLink.addEventListener("click", (e) => {
					e.preventDefault();
					currentPage++;
					updatePageNumbers();
					displayCards();
				});
			}
		}

		function headlineLimit(text, maxCharacters) {
			if (text.length > maxCharacters) {
				return text.substring(0, maxCharacters) + "...";
			} else {
				return text;
			}
		}

		// Function to display the cards for the current page
		function displayCards() {
            productListing.innerHTML = "";

			const startIndex = (currentPage - 1) * cardsPerPage;
			const endIndex = Math.min(currentPage * cardsPerPage, results.length);

			// Display the cards for the current page
			for (let i = startIndex; i < endIndex; i++) {
				if (results[i]) {
					const product = results[i];

					const cardColumn = document.createElement("div");
					cardColumn.classList.add("col-md-3", "mb-3");

					const card = document.createElement("div");
					card.classList.add("card", "mb-3");

					card.innerHTML = `
        <a href="${product.Link}" class="text-decoration-none">
            <img src="images/${
						product.ImageFilename
					}" class="card-img-top" alt="..."> 

            <div class="card-body">
                <h5 class="card-title text-danger fs-6 fw-semibold  mb-3"> ${headlineLimit(
									product.Headline,
									30
								)}</h5>
                <h6 class="card-subtitle text-dark fw-semibold mb-2"> ${headlineLimit(
									product.AdvertiserName,
									30
								)}</h6>
                
                
            </div>
        </a>`;
					cardColumn.appendChild(card);
                    productListing.appendChild(cardColumn);
				}
			}
		}

		updatePageNumbers();
		displayCards();
		pagination.appendChild(nav);
	}
}











// // Function to display products
// function displayProducts(products) {
//     const productListing = document.getElementById('productListing');
//     productListing.innerHTML = '';

//     products.forEach(product => {
//         const card = document.createElement('div');
//         card.classList.add('card', 'mb-3');

//         card.innerHTML = `
//             <img src="images/${product.ImageFilename}" class="card-img-top" alt="${product.Headline}">
//             <div class="card-body">
//                 <h5 class="card-title">${product.Headline}</h5>
//                 <p class="card-text">${product.Brand}</p>
//                 <p class="card-text">${product.PriceRange}</p>
//                 <a href="${product.Link}" class="btn btn-primary">Visit Store</a>
//             </div>
//         `;

//         productListing.appendChild(card);
//     });
// }






// import {JSON_ROOT_URL, AFFILIATE_IMG_ROOT_URL} from "../../js/sd.js";

// const featuredJsonUrl = `${JSON_ROOT_URL}affiliate.json`;

// const affiliateCardsContainer = document.getElementById("affiliateCardsContainer");
// const pagination = document.getElementById("pagination");
// // Function to fetch JSON data
// function fetchData(callback) {
// 	fetch(featuredJsonUrl)
// 		.then((response) => response.json())
// 		.then((data) => callback(data.Affiliates))
// 		.catch((error) => console.error("Error fetching data:", error));
// }

// // Function to filter and render data based on FeaturedCategory
// function filterData(category) {
// 	fetchData((data) => {
// 		affiliateCardsContainer.innerHTML = ""; // Clear previous content

// 		if (category === "Show All") {
// 			displayResults(data);
// 		} else {
// 			//const filteredData = data.filter((item) => item.FeaturedCategory === category);
// 			const filteredData = data.filter((item) => {
// 				return item.FeaturedCategories.some((cat) => cat.FeaturedCategory === category);
// 			});
// 			displayResults(filteredData);
// 		}
// 	});
// }

// // Function to dynamically create category buttons
// function createCategoryButtons(categories) {
// 	const buttonContainer = document.getElementById("categoryButtons");

// 	categories.forEach((category) => {
// 		const button = document.createElement("button");
// 		button.classList.add("btn", "btn-outline-danger", "me-3", "mb-3");
// 		button.textContent = category;
// 		button.addEventListener("click", () => {
// 			filterData(category);
// 			setActiveButton(button);
// 			updateBreadcrumb(category);
// 			updatePageHeading(category);
// 		});
// 		buttonContainer.appendChild(button);
// 		// Set 'active' class on the "All" button by default
// 		if (category === "Show All") {
// 			button.classList.add("active");
// 		}
// 	});
// }

// // Function to set the active state for the clicked button
// function setActiveButton(clickedButton) {
// 	const buttons = document.getElementsByTagName("button");
// 	for (const button of buttons) {
// 		button.classList.remove("active");
// 	}
// 	clickedButton.classList.add("active");
// }

// // Function to update breadcrumb based on the selected category
// function updateBreadcrumb(category) {
// 	const breadcrumbNav = document.getElementById("breadcrumbNav");
// 	const breadcrumbCategory = document.getElementById("breadcrumbCategory");

// 	// Change breadcrumb link and text based on the selected category
// 	if (category === "Show All") {
// 		breadcrumbCategory.textContent = "Featured Offers";
// 		breadcrumbCategory.removeAttribute("aria-current");
// 		breadcrumbNav.innerHTML = `
//                 <ol class="breadcrumb">
//                     <li class="breadcrumb-item"><a class="text-danger text-decoration-none" href="/">Home</a></li>
//                     <li class="breadcrumb-item active" id="breadcrumbCategory" aria-current="page">Featured Offers</li>
//                 </ol>`;
// 	} else {
// 		breadcrumbCategory.textContent = category;
// 		breadcrumbCategory.setAttribute("aria-current", "page");
// 		breadcrumbNav.innerHTML = `
//                 <ol class="breadcrumb">
//                     <li class="breadcrumb-item"><a class="text-danger text-decoration-none" href="/">Home</a></li>
//                     <li class="breadcrumb-item"><a class="text-danger text-decoration-none" href="/featured">Featured Offers</a></li>
//                     <li class="breadcrumb-item active" id="breadcrumbCategory" aria-current="page">${category}</li>
//                 </ol>`;
// 	}
// }

// // Function to update the page heading based on the selected category
// function updatePageHeading(category) {
// 	const pageHeading = document.getElementById("pageHeading");

// 	if (category === "Show All") {
// 		pageHeading.textContent = "Featured Offers";
// 	} else {
// 		pageHeading.textContent = category;
// 	}
// }



// // Initial rendering of all data
// fetchData((data) => {
	
// 	const categoryCounts = {};
// 	const customOrder = ["Show All", "Women's Fashion", "Men's Fashion"];

// 	data.forEach((item) => {
// 		item.FeaturedCategories.forEach((category) => {
// 			const cat = category.FeaturedCategory;
// 			if (cat!=="null" && cat !== "Other" && !customOrder.includes(cat)) {
// 				categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
// 			}
// 		});
// 	});

// 	// Sort categories based on custom order and frequency
// 	const sortedCategories = customOrder.concat(
// 		Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]),
// 		"Other"
// 	);

// 	// Create category buttons
// 	createCategoryButtons(sortedCategories);

// 	// Display results
// 	displayResults(data);
// });