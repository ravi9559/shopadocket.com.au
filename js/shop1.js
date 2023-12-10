
const parentCategory = document.getElementById('parentCategory');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandCheckboxes = document.getElementById('brandCheckboxes');
    const priceCheckboxes = document.getElementById('priceCheckboxes');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const productListing = document.getElementById('productListing');

	let offerdata = [];

	  // Get all checkboxes with the class "filter-checkbox"
	  const checkboxes = document.querySelectorAll(".filter-checkbox");

	// Assuming checkboxesContainer is the parent element that contains dynamically generated checkboxes
const checkboxesContainer = document.getElementById("filtersForm");

// Add a single event listener to the parent container
checkboxesContainer.addEventListener("change", function(event) {
    // Check if the changed element is a checkbox with the class name "filter-checkbox"
    if (event.target.type === "checkbox" && event.target.classList.contains("filter-checkbox")) {
        // Call the filter function when a checkbox is changed
        filter();
    }
});



async function getProduct() {
	try {
	  const response = await fetch('data/shop.json');
	  if (!response.ok) {
		window.location.href = "../404.html";
	  }
  
	  const data = await response.json();
	  offerdata= data.ShoppingOffers;

	
	  // Initial product listing
	 
	  getUniqueParentcategory(data.CategoryGroups.ParentCategories);

	  getUniqueSubcategory(data.CategoryGroups.ParentCategories);
	  getUniqueCategories(data.CategoryGroups.ParentCategories);
	  getUniqueBrands(data.Brands);
	  getUniquePriceRanges(data.PriceRanges);

	  filter(offerdata)
	  
  
} catch (error) {
    console.error("Error fetching data:", error);
  }
}


getProduct()



// Function to get unique Parent Category
function getUniqueParentcategory(parentCat) {
	
	const uniqueBrandsSet = new Set(parentCat.map(item => item.ParentCategory));
	
	uniqueBrandsSet.forEach(brand => {
        parentCategory.innerHTML += `
            <div class="form-check">
                <input type="checkbox"    class="form-check-input filter-checkbox" name="${brand}" id="${brand}" value="${brand}">
                <label class="form-check-label" for="${brand}">${brand}</label>
            </div>
        `
	});
		
	
}


// Function to get unique sub Category
function getUniqueSubcategory(subcat) {
	const uniqueSubcategories = [];
  
	subcat.forEach(parentCategory => {
	  parentCategory.SubCategories.forEach(subcategory => {
		// Check if subcategory already exists in the unique array
		if (!uniqueSubcategories.some(item => item.SubCategory === subcategory.SubCategory)) {
		  uniqueSubcategories.push(subcategory);
		}
	  });
	});
  
	
  
	uniqueSubcategories.forEach(subcategory => {
	  subCategoryCheckboxes.innerHTML += `
		<div class="form-check">
		  <input type="checkbox"  class="form-check-input filter-checkbox" name="${subcategory.SubCategory}" id="${subcategory.SubCategory}" value="${subcategory.SubCategory}">
		  <label class="form-check-label" for="${subcategory.SubCategory}">${subcategory.SubCategory}</label>
		</div>
	  `;
	});
  }
  


  
// Function to get unique Categories

function getUniqueCategories(categories) {
	const allCategories = [];
  
	categories.forEach(parentCategory => {
	  parentCategory.SubCategories.forEach(subcategory => {
		subcategory.Categories.forEach(category => {
			
		  allCategories.push(category.Category);
		});
	  });
	});
  
	const uniqueCategories = new Set(allCategories);
  
	  
		uniqueCategories.forEach(subcategory => {
			
			categoryCheckboxes.innerHTML += `
			<div class="form-check">
			  <input type="checkbox"  class="form-check-input filter-checkbox" name="${subcategory}" id="${subcategory}" value="${subcategory}">
			  <label class="form-check-label" for="${subcategory}">${subcategory}</label>
			</div>
		  `;
		});
	  
	  
  }



// Function to get unique brands
function getUniqueBrands(brands) {



	const uniqueBrandsSet = new Set(brands.map(item => item.Brand));
	brandCheckboxes.innerHTML="";
	uniqueBrandsSet.forEach(brand => {

		
		
        brandCheckboxes.innerHTML += `
            <div class="form-check">
                <input type="checkbox"   class="form-check-input filter-checkbox" name="${brand}" id="${brand}" value="${brand}">
                <label class="form-check-label" for="${brand}">${brand}</label>
            </div>
        `
	});
		
	
}




// Function to get PriceRanges
function getUniquePriceRanges(PriceRanges) {

	const uniqueBrandsSet = new Set(PriceRanges.map(item => item.PriceRange));
	
	uniqueBrandsSet.forEach(price => {

		console.log(price);
		
        priceCheckboxes.innerHTML += `
            <div class="form-check">
                <input type="checkbox"  class="form-check-input filter-checkbox" name="${price}" id="${price}" value="${price}">
                <label class="form-check-label" for="${price}">${price}</label>
            </div>
        `
	});
		
	
}



// function filter() {
//     // Get all checked checkboxes
//     const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked");

//     if (!checkedBoxes || checkedBoxes.length === 0) {
//         // No filters selected, return all data
//         console.log("No filters selected. Displaying all products.");
//         displayProducts(offerdata);
//         return;
//     }

//     // Extract filter criteria
//     const filters = [];
//     checkedBoxes.forEach(checkbox => {
//         const filter = {
//             value: checkbox.value,
//             name: checkbox.name,
//             // ... other filter criteria ...
//         };
//         filters.push(filter);
//     });

//     console.log("Filters:", filters);

//     // Filter the data
//     const filteredData = offerdata.filter(item => {
//         // Check if item matches any selected filter
//         return filters.some(filter => {
//             // Implement logic to compare item with each filter
//             // Use dot notation for nested object properties

//             // Example: compare item ParentCategory, SubCategory, Category, or Brand with filter value
//             return (
//                 item.ParentCategory === filter.value ||
//                 item.SubCategory === filter.value ||
//                 item.Category === filter.value ||
//                 item.Brand === filter.value ||
//                 item.PriceRange === filter.value
              
//             );
//         });
//     });
	
	
    

//     // Display the filtered products
//     console.log("Displaying products:", filteredData);
//     displayProducts(filteredData);
// }



function filter() {
    // Get all checked checkboxes
    const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked");

    if (!checkedBoxes || checkedBoxes.length === 0) {
        // No filters selected, return all data
        console.log("No filters selected. Displaying all products.");
        displayProducts(offerdata);
        return;
    }

    // Extract filter criteria
    const filters = [];
    checkedBoxes.forEach(checkbox => {
        const filter = {
            value: checkbox.value,
            name: checkbox.name,
            // ... other filter criteria ...
        };
        filters.push(filter);
    });

    console.log("Filters:", filters);

    // Filter the data
    const filteredData = offerdata.filter(item => {
        // Check if item matches any selected filter
        return filters.some(filter => {
            // Implement logic to compare item with each filter
            // Use dot notation for nested object properties

            // Example: compare item ParentCategory, SubCategory, Category, or Brand with filter value
            return (
                item.ParentCategory === filter.value ||
                item.SubCategory === filter.value ||
                item.Category === filter.value ||
                item.Brand === filter.value ||
                item.PriceRange === filter.value
            );
        });
    });

    // Display the filtered products
    if (filteredData.length > 0) {
        console.log("Displaying products:", filteredData);
        displayProducts(filteredData);
    } else {
        // Display a message when no products match the selected criteria
        productListing.innerHTML =`<p class="text-center">"Unfortunately, we couldn't find any offers that match your current filter selections. "</p>
		<p class="text-center">Please try adjusting your filters to see more results.</p>`;
		pagination.innerHTML = "";

        // You can also update the DOM to display the message on your page
    }
}




function displayProducts(results) {
	console.log("Displaying products:", results);
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













