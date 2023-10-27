document.addEventListener("DOMContentLoaded", () => {
   
  
    fetch("data/offer.json")
      .then((response) => response.json())
      .then((data) => {
        const offerCategories = data[0].offers;
  
       
        renderCategoriesForMegaMenu(offerCategories);
        renderCategoriesForFooter(offerCategories);
      });
  
   
  
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
        row.className = "row p-3";
  
        for (let i = 0; i < columnsCount; i++) {
          const column = document.createElement("div");
          column.className = "col-md-auto";
  
          // const categoryList = document.createElement("a");
          //categoryList.className = "list-unstyled text-nowrap";
  
          for (
            let j = i * maxCategoriesPerColumn;
            j < (i + 1) * maxCategoriesPerColumn && j < totalCategories;
            j++
          ) {
            const category = categories[j];
            const a = document.createElement("a");
           
            a.href = `offers.html?category=${encodeURIComponent(category.category)}`;
            const categorydiv = document.createElement("div");
            categorydiv.className=  "d-flex align-items-center pt-3  px-1 rounded-3 "
            const categoryItemDiv = document.createElement("div");
            categoryItemDiv.className="text px-3 "
            const categoryItem = document.createElement("p");
            categoryItem.className="fw-medium"
             categoryItem.textContent = category.category.replace(/-/g, " ");

            categoryItemDiv.appendChild(categoryItem);
            categorydiv.appendChild(categoryItemDiv);
            a.appendChild(categorydiv);
            column.appendChild(a);
          }
  
          
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
  