const parentCategory = document.getElementById('parentCategory');
const subCategoryCheckboxes = document.getElementById('subCategoryCheckboxes');
const categoryCheckboxes = document.getElementById('categoryCheckboxes');
const brandCheckboxes = document.getElementById('brandCheckboxes');
const priceCheckboxes = document.getElementById('priceCheckboxes');
const productListing = document.getElementById('productListing');
const pagination = document.getElementById('pagination');

let offerdata = [];
let data;

const checkboxesContainer = document.getElementById("filtersForm");

async function getProduct() {
    try {
        const response = await fetch('data/shop.json');
        if (!response.ok) {
            window.location.href = "../404.html";
        }

         data = await response.json();
        offerdata = data.ShoppingOffers;

        getUniqueParentcategory(data.CategoryGroups.ParentCategories);
        // getUniqueSubcategory(data.CategoryGroups.ParentCategories);
        // getUniqueCategories(data.CategoryGroups.ParentCategories);
        getUniqueBrands(data.Brands);
        getUniquePriceRanges(data.PriceRanges);

        filter(offerdata);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

getProduct();








// checkboxesContainer.addEventListener("change", function (event) {
//     if (event.target.type === "checkbox" && event.target.classList.contains("filter-checkbox")) {
     
//         filter();
//     }
// });



checkboxesContainer.addEventListener("change", function (event) {
    if (
        (event.target.type === "checkbox" || event.target.type === "radio") &&
        (event.target.classList.contains("filter-checkbox") || event.target.classList.contains("filter-radio"))
    ) {
        filter();
        
    }
});


// Add an event listener for changes in Parent Category radio
parentCategory.addEventListener("change", function (event) {
    if (event.target.type === "radio" && event.target.classList.contains("filter-radio")) {
        // Call a function to update Sub Categories and Categories based on the selected Parent Category
        updateSubCategoriesAndCategories(event.target.value);
        
        filter(); // Trigger the filter function after updating checkboxes
    }
});




function generateCheckboxes(data, container, labelKey) {
    const uniqueSet = new Set(data.map(item => item[labelKey]));

    uniqueSet.forEach(value => {
        
        container.innerHTML += `
            <div class="form-check">
                <input type="checkbox" class="form-check-input filter-checkbox" name="${value}" id="${value}" value="${value}">
                <label class="form-check-label" for="${value}">${value}</label>
            </div>
        `;
    });
}




function generateRadioButtons(data, container, labelKey) {
    const uniqueSet = new Set(data.map(item => item[labelKey]));

    // Add "All" as the default and selected option
    container.innerHTML += `
        <div class="form-check">
            <input type="radio" class="form-check-input filter-radio" name="${labelKey}" id="all${labelKey}" value="all" checked>
            <label class="form-check-label" for="all${labelKey}">All</label>
        </div>
    `;

    uniqueSet.forEach(value => {
       
        container.innerHTML += `
            <div class="form-check">
                <input type="radio" class="form-check-input filter-radio" name="${labelKey}" id="${value}" value="${value}">
                <label class="form-check-label" for="${value}">${value}</label>
            </div>
        `;
    });
}







function getUniqueParentcategory(parentCat) {
    // generateCheckboxes(parentCat, parentCategory, "ParentCategory");
    generateRadioButtons(parentCat, parentCategory, "ParentCategory");
}




function updateSubCategoriesAndCategories(selectedParentCategory) {
    // Find the selected parent category in the data
    const selectedParent = data.CategoryGroups.ParentCategories.find(item => item.ParentCategory === selectedParentCategory);
    
    // Clear existing checkboxes
    clearSubCategoriesCheckboxes();
    clearCategoriesCheckboxes();

    // Check if the selected parent category is found
    if (selectedParent) {
        // Update Sub Categories checkboxes
        if (selectedParent.SubCategories) {
            
            generateCheckboxes(selectedParent.SubCategories, subCategoryCheckboxes, "SubCategory");
            generateHeading(selectedParentCategory, subCategoryCheckboxes, "Sub Categories");
        } else {
            console.error("SubCategories are missing or undefined for the selected parent category.");
        }

        // Update Categories checkboxes
        if (selectedParent.SubCategories && selectedParent.SubCategories.length > 0 && selectedParent.SubCategories[0].Categories) {
           
            generateCheckboxes(selectedParent.SubCategories[0].Categories, categoryCheckboxes, "Category");
            generateHeading(selectedParentCategory, categoryCheckboxes, "Categories");
        } else {
            console.error("Categories are missing or undefined for the selected parent category.");
        }
    } else {
        console.error("Selected parent category not found in CategoryGroups.ParentCategories array.");
    }
}



function clearSubCategoriesCheckboxes() {
    // Clear existing Sub Categories checkboxes
    subCategoryCheckboxes.innerHTML = "";
}

function clearCategoriesCheckboxes() {
    // Clear existing Categories checkboxes
    categoryCheckboxes.innerHTML = "";
}





function generateHeading(selectedParentCategory, container, type) {
    const heading = document.createElement("lable");
    heading.textContent = ` ${type}`; // Customize the heading text as needed
    container.insertBefore(heading, container.firstChild);
}


function getUniqueSubcategory(subcat) {
    const uniqueSubcategories = [];

    subcat.forEach(parentCategory => {
        parentCategory.SubCategories.forEach(subcategory => {
            if (!uniqueSubcategories.some(item => item.SubCategory === subcategory.SubCategory)) {
                uniqueSubcategories.push(subcategory);
            }
        });
    });


    generateCheckboxes(uniqueSubcategories, subCategoryCheckboxes, "SubCategory");
}

function getUniqueCategories(categories) {
    const allCategories = [];

    categories.forEach(parentCategory => {
        parentCategory.SubCategories.forEach(subcategory => {
            allCategories.push(...subcategory.Categories);
        });
    });

        generateCheckboxes(allCategories, categoryCheckboxes, "Category");
}




function getUniqueBrands(brands) {

    generateCheckboxes(brands, brandCheckboxes, "Brand");
}

function getUniquePriceRanges(priceRanges) {

    generateCheckboxes(priceRanges, priceCheckboxes, "PriceRange");
   
}




// function filter() {
//     const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked");

//     if (!checkedBoxes || checkedBoxes.length === 0) {
//         console.log("No filters selected. Displaying all products.");
//         displayProducts(offerdata);
//         return;
//     }

//     const filters = Array.from(checkedBoxes).map(checkbox => ({
//         value: checkbox.value,
//         name: checkbox.name
//     }));

//     const filteredData = offerdata.filter(item => {
//         return filters.some(filter => {
//             return (
//                 item.ParentCategory === filter.value ||
//                 item.SubCategory === filter.value ||
//                 item.Category === filter.value ||
//                 item.Brand === filter.value ||
//                 item.PriceRange === filter.value
//             );
//         });
//     });

//     if (filteredData.length > 0) {
//         console.log("Displaying products:", filteredData);
//         displayProducts(filteredData);
//     } else {
//         productListing.innerHTML = `<p class="text-center">"Unfortunately, we couldn't find any offers that match your current filter selections. "</p>
//             <p class="text-center">Please try adjusting your filters to see more results.</p>`;
//         pagination.innerHTML = "";
//     }
// }



// function filter() {
//     const checkedInputs = document.querySelectorAll("input[type='checkbox']:checked, input[type='radio']:checked");

//     const showAll = Array.from(checkedInputs).some(input => input.type === 'radio' && input.value === 'all');

//     if (!checkedInputs || checkedInputs.length === 0 || showAll) {
//         console.log("No filters selected. Displaying all products.");
//         displayProducts(offerdata);
//         return;
//     }

   

//     const filters = Array.from(checkedInputs).map(input => ({
//         value: input.value,
//         name: input.name
//     }));

//     const filteredData = offerdata.filter(item => {
//         return filters.some(filter => {
//             return (
//                 item.ParentCategory === filter.value ||
//                 item.SubCategory === filter.value ||
//                 item.Category === filter.value ||
//                 item.Brand === filter.value ||
//                 item.PriceRange === filter.value
//             );
//         });
//     });

//     if (filteredData.length > 0) {
//         console.log("Displaying products:", filteredData);
//         displayProducts(filteredData);
//     } else {
//         productListing.innerHTML = `<p class="text-center">"Unfortunately, we couldn't find any offers that match your current filter selections. "</p>
//             <p class="text-center">Please try adjusting your filters to see more results.</p>`;
//         pagination.innerHTML = "";
//     }
// }




function filter() {
    const checkedInputs = document.querySelectorAll("input[type='checkbox']:checked, input[type='radio']:checked");
    const showAll = Array.from(checkedInputs).some(input => input.type === 'radio' && input.value === 'all');

    if (!checkedInputs || checkedInputs.length === 0  )  {
       
        displayProducts(offerdata);
        return;
    }

    
    if (showAll) {
        console.log("Radio button 'All' selected. Displaying all products.");
        displayProducts(offerdata);
        return;
    }
    

    const filters = Array.from(checkedInputs).map(input => ({
        value: input.value,
        name: input.name
    }));

    const filteredData = offerdata.filter(item => {
        return filters.every(filter => {
            // Check if the filter matches any of the properties (parent category, sub-category, or category)
            return (
                item.ParentCategory === filter.value ||
                item.SubCategory === filter.value ||
                item.Category === filter.value ||
                item.Brand === filter.value ||
                item.PriceRange === filter.value
            );
        });
    });

    if (filteredData.length > 0 ) {
             displayProducts(filteredData);
    } else {
        productListing.innerHTML = `<p class="text-center">"Unfortunately, we couldn't find any offers that match your current filter selections. "</p>
            <p class="text-center">Please try adjusting your filters to see more results.</p>`;
        pagination.innerHTML = "";
    }
}









function displayProducts(results) {
    
    pagination.innerHTML = "";

    if (results.length === 0) {
        productListing.innerHTML = '';
    } else {
        const cardsPerPage = 8;
        let currentPage = 1;
        const maxVisiblePages = 10;

        const nav = document.createElement("nav");
        const ul = document.createElement("ul");
        ul.classList.add("pagination");
        nav.appendChild(ul);

        function updatePageNumbers() {
            ul.innerHTML = "";
            const numPages = Math.ceil(results.length / cardsPerPage);
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(numPages, startPage + maxVisiblePages - 1);
            startPage = Math.max(1, endPage - maxVisiblePages + 1);

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
            return text.length > maxCharacters ? text.substring(0, maxCharacters) + "..." : text;
        }

        function displayCards() {
            productListing.innerHTML = "";
            const startIndex = (currentPage - 1) * cardsPerPage;
            const endIndex = Math.min(currentPage * cardsPerPage, results.length);

            for (let i = startIndex; i < endIndex; i++) {
                if (results[i]) {
                    const product = results[i];

                    const cardColumn = document.createElement("div");
                    cardColumn.classList.add("col-md-3", "mb-3");

                    const card = document.createElement("div");
                    card.classList.add("card", "mb-3");

                    card.innerHTML = `
                        <a href="${product.Link}" class="text-decoration-none">
                            <img src="images/${product.ImageFilename}" class="card-img-top" alt="..."> 
                            <div class="card-body">
                                <h5 class="card-title text-danger fs-6 fw-semibold mb-3">${headlineLimit(product.Headline, 30)}</h5>
                                <h6 class="card-subtitle text-dark fw-semibold mb-2">${headlineLimit(product.AdvertiserName, 30)}</h6>
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
