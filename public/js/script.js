
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


function sortListings(order) {
    const listingsContainer = document.querySelector('#listings-container');
    const listings = Array.from(listingsContainer.children);

    listings.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.card-price').textContent.replace(/[^0-9.-]+/g, ''), 10);
        const priceB = parseInt(b.querySelector('.card-price').textContent.replace(/[^0-9.-]+/g, ''), 10);
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });

    listingsContainer.innerHTML = '';
    listings.forEach(listing => listingsContainer.appendChild(listing));
}

const taxswitch = document.getElementById("flexSwitchCheckDefault");
taxswitch.addEventListener("click",()=>{
  let taxInfo = document.getElementsByClassName("tax");
 
  
  for(let info of taxInfo){
    if(info.style.display != "inline"){
      info.style.display = "inline";
    } else{
      info.style.display = "none";
    }
  }
  const prices = document.querySelectorAll(".card-price");
  prices.forEach(price => {
    const originalPrice = parseFloat(price.dataset.originalPrice);
    // console.log(price.dataset);
    
    if (taxswitch.checked) {
      const taxedPrice = originalPrice * 1.18;
      price.innerHTML = `&nbsp; &#8377; ${taxedPrice.toLocaleString("en-IN")} / night <i class="tax">&nbsp;&nbsp;+18% GST</i>`;
    } else {
      price.innerHTML = `&nbsp; &#8377; ${originalPrice.toLocaleString("en-IN")} / night <i class="tax" style="display: none;">&nbsp;&nbsp;+18% GST</i>`;
    }
  })
  
});
