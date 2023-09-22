// Get the 'id' parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Load the JSON data from your file (you may need to adjust the path)
fetch("../data/coupon.json")
  .then((response) => response.json())
  .then((data) => {
    // Find the coupon object with the matching 'id'
    const advertiser = data.find((coupon) => coupon.id == id);

    if (advertiser) {
      function getLocation(locations) {
        return locations
          .map(
            (location) =>
              `<i class="fas fa-fw fa-map-marker-alt"></i><span>${location.Location}</span> `
          )
          .join("");
      }

      function getCTA(ctas) {
        return ctas
          .map((cta) => {
            if (cta.type === "phone") {
              return `<a class="btn btn-danger me-2 joinbtn" href="tel:${cta.link}"><i class="fas fa-fw fa-${cta.icon}-alt"></i> ${cta.text}</a>`;
            } else if (cta.type === "web") {
              return `<a class="btn btn-danger joinbtn" href="${cta.link}" target="_blank"><i class="fas fa-fw fa-globe "></i></i> ${cta.text}</a>`;
            }
          })
          .join("");
      }

      function getContacts(contacts) {
        return contacts
          .map((contact) => {
            return contact.contactType === "Address"
              ? `<a href="${contact.contactLink}" target="_blank" class="nav-link"><i class="fas fa-fw fa-map-marker-alt pt-4"></i> ${contact.contactMethod}</a> <br\>`
              : contact.contactType === "Phone"
              ? `<a href="${contact.contactLink}" class="nav-link"><i class="fas fa-fw fa-phone-alt "></i> ${contact.contactMethod}</a> <br\> `
              : contact.contactType === "Web"
              ? `<a href="${contact.contactLink}" target="_blank"><button type="button" class="btn btn-danger loginbtn "><i class="fas fa-fw fa-globe "></i> ${contact.contactMethod}</button></a>`
              : "";
          })
          .join("");
      }

      function adTemplate(advertiser) {
        const setLocations = getLocation(advertiser.Locations);
        const setCTAs = getCTA(advertiser.CTA);
        const setContacts = getContacts(advertiser.Contacts);

        return `
        
        <div class="row py-2">
          <div class="col-lg-4">
            <img
              src="../images/${advertiser.image}.jpg"
              class="img-fluid rounded m-3"
              alt="${advertiser.Headline} with ${advertiser.Advertiser}"
            />
          </div>
      
          <div class="col-lg-8">
            <div class="card-body m-3">
              <h1 class="card-title">${advertiser.Headline}</h1>
              <h5 class="card-title">${advertiser.Advertiser}</h5>
              <p class="card-text pt-3">
                <i class="fas fa-fw fa-tag"></i> ${advertiser.Saving}
              </p>
              ${setLocations}
              <p class="card-text mt-3">
                <i class="far fa-fw fa-clock"></i> ${advertiser.Valid}
              </p>
              ${setCTAs}
              <div class="d-flex justify-content-between">
                <div>
                  <a class="mt-3 btn btn-outline-light text-dark" href="#"
                    ><i class="fa fa-fw fa-print"></i> Print Offer</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      
        
    <!-- /.inner nav -->

    <nav class="navbar navbar-expand-lg navbar-light navbar-collapse d-none d-md-block ">
            <div class="container-fluid border-top border-bottom py-2 ">
        <span class="navbar-text fw-bold ">
        Navigate to:
    </span>
        
        <div class="collapse navbar-collapse" >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
            <a class="nav-link fw-bold " href="#offerDetails">Offer Details</a>
            </li>
            <li class="nav-item">
            <a class="nav-link fw-bold" href="#aboutAdvertiser">About ${advertiser.Advertiser} </a>
            </li>

            <li class="nav-item">
            <a class="nav-link fw-bold" href="#contact"> Contact </a>
            </li>

            <li class="nav-item">
            <a class="nav-link fw-bold" href="#terms"> Terms & Conditions </a>
            </li>
                    
        </ul>
        <div class="d-flex">

            <span class="pt-2 fw-bold">Share this offer:</span>
        <div class="btn-group" role="group" aria-label="Share buttons">
        
        <a href="#" class="btn btn-outline-light text-dark " target="_blank" rel="noopener noreferrer">
            <i class="fab fa-facebook-f"></i> 
        </a>
        <a href="#" class="btn btn-outline-light text-dark" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="btn btn-outline-light text-dark">
            <i class="fas fa-envelope"></i> 
        </a>
        </div>

            
        </div>
        </div>
    </div>
</nav>

<!-- /.inner nav end -->
        
        <!-- Offer Details -->
        <div class="row pt-2 border-bottom" id="offerDetails">
          <h4 class="text-danger">Offer Details</h4>
          <div class="ms-3">${advertiser.Detail}</div>
        </div>
      
        <!-- About Advertiser -->
        <div class="row pt-2 border-bottom" id="aboutAdvertiser">
          <h4 class="text-danger">About ${advertiser.Advertiser}</h4>
          <div class="ms-3 pb-4">${advertiser.About}</div>
        </div>
      
        <!-- Contact Details -->
        <div class="row m-2 pt-2 border-bottom" id="contact">
          <h4 class="text-danger">Contact Details</h4>
          <span>Click address to view on Google Maps.</span>
          <div class="ms-3 pb-4">${setContacts}</div>
        </div>
      
        <!-- Terms & Conditions -->
        <div class="row m-2 pt-2" id="terms">
          <h4 class="text-danger">${advertiser.Advertiser} Terms & Conditions</h4>
          <div class="ms-3 pb-4">${advertiser.Terms}</div>
        </div>
      
      
          `;
      }

      // Append the generated HTML to the 'Advertisetemplates' div
      const couponDetails = document.getElementById("Advertisetemplates");
      couponDetails.innerHTML = adTemplate(advertiser);
    } else {
      const couponDetails = document.getElementById("Advertisetemplates");

      // Create a div with the 'center' class
      const centerDiv = document.createElement("div");
      centerDiv.classList.add("text-center", "mt-5");

      // Create the heading
      const notFoundMessage = document.createElement("h2");
      notFoundMessage.textContent = "Coupon expired or not found";

      // Create the button
      const redirectToIndexLink = document.createElement("a");
      redirectToIndexLink.textContent = "Go back to home page";
      redirectToIndexLink.classList.add("btn", "btn-danger");
      redirectToIndexLink.href = "index.html";

      // Append the heading and button to the div
      centerDiv.appendChild(notFoundMessage);
      centerDiv.appendChild(redirectToIndexLink);

      // Append the centered div to the couponDetails element
      couponDetails.appendChild(centerDiv);
    }
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });
