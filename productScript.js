const receivedValue = localStorage.getItem("ProductValueSentFromHome");

// namespacing starts
const app = {};

// adding product category from home page to header
document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${receivedValue}`;

// variable list - namespace - starts
app.apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";
let productCategoryOption = ""; 
app.brandSelected = ""; // variable for the user's brand selection
app.priceLessThan = 1000; // variable for user's price selection
app.priceGreaterThan = 0; // variable for user's price selection
app.productType = receivedValue;


app.generateProductCategories = () => {
  const productCategoryArrays = {
    blush: ["powder", "cream"],
    bronzer: ["powder"],
    eyebrow: ["penci"],
    eyeliner: ["liquid", "pencil", "gel", "cream"],
    eyeshadow: ["pallette", "pencil", "cream"],
    foundation: ["concealer", "liquid", "contour", "bb cc", "cream", "mineral", "powder", "highlighter"],
    lip_liner: ["pencil"],
    lipstick: ["lipstick", "lip gloss", "liquid", "stain"]
  }
    // add event listener to product category select
    const productType = document.getElementById("productType");
    productType.addEventListener('change', (event) => {
      console.log("changed", event)
      const result = event.target.value;

      //clear previous options added document.querySelectorAll('.classname').forEach(e => e.remove());
      const optionsToRemove = document.querySelectorAll(".added");
      optionsToRemove.forEach(event => event.remove());

      // go through array that equals value of result to assign options for product category
      const chosenCategory = productCategoryArrays[result];
     
      console.log(chosenCategory);
      // get product category select
      const productCategorySelect = document.getElementById("category");

      // loop through product array to populate category select
      chosenCategory.forEach((item) => {
        // create option
        const option = document.createElement("option");
        option.classList.add("added");
        option.value = item;
        option.text = item;

        productCategorySelect.appendChild(option);
      })
    })
}// end of app.generateProductCategories




// method to get form element, listen for form submission and assign variables based on user's selections
app.formFilter = () => {
  //get form element
  let formElement = document.querySelector("form");
  const submitButtonElement = document.querySelector("button[type=submit]");
  console.log(formElement, submitButtonElement);
  
  //add event listener to submit button
  submitButtonElement.addEventListener("click", function(event){
    event.preventDefault();

    formElement = document.querySelector("form");
    
    // clear any images in the gallery
    const imageList = document.getElementById("ulImages"); 
    imageList.innerText = '';

    // get product type
    const productTypeOption = formElement[0].selectedIndex;

    if (productTypeOption !== 0){
      // save value of selected product type
      // this will overwrite receivedValue
      app.productType = formElement[0][productTypeOption].value;
      // change product name in header to match
      // *** STRETCH get innerText of selected type
      // ** make product Capitalized
      document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${app.productType}`;

     
    }

    // get selected brand
    const brandOption = formElement[1].selectedIndex;
    //check if brand selected
    // if no user input option = 0
    if (brandOption !== 0){
      // save value of selected brand in variable
      app.brandSelected = formElement[1][brandOption].value;
      console.log(app.brandSelected)
    }else {
      app.brandSelected = '';
    }

    // get product category selected by user
    const categoryOption = formElement[2].selectedIndex;
    
    if (categoryOption !== 0){
      // save value of category in variable
      app.productCategoryOption = formElement[2][categoryOption].value;
      console.log(app.productCategoryOption);
    }
    // if (productCategory === 1) {
    //   app.productCategoryOption = product_categoryA; 

    // }
    // else if (productCategory === 2) {

    //   app.productCategoryOption = product_categoryB; 

    // }

    // else if (productCategory === 3) {
    //   app.productCategoryOption = product_categoryC;
    // }

    // else{
    //   app.productCategoryOption = "";
    // }

    //  get selected price range selected by user
    const priceOption = formElement[3].selectedIndex;
    //  check which price was selected
    // if no user selection = 0
    if (priceOption === 1){
      // least expensive was selected
      // assign values for price range
      app.priceLessThan = 20;
      app.priceGreaterThan = 0;
    }else if (priceOption === 2){
      // most expensive was selected
      // assign values for price range
      app.priceGreaterThan = 20;
      app.priceLessThan = 1000;
    }else {
      app.priceGreaterThan = 0;
      app.priceLessThan = 1000;
    }



 

    console.log(app.brandSelected, app.priceGreaterThan, app.priceLessThan);

    console.log(productTypeOption, brandOption, categoryOption, priceOption);

    if (productTypeOption === 0 && brandOption === 0 && categoryOption === 0 && priceOption === 0 ){
      alert('Please select a Product type');
    }else {
      // call API
      app.getResults();
      
    }
  })
} // end of app.formFilter



// method to take variables with user's selections and send to API
app.getResults = () => {
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    // pass in variables from form
    product_category: app.productCategoryOption,
    brand: app.brandSelected,
    price_greater_than: app.priceGreaterThan,
    price_less_than: app.priceLessThan,
    product_type: app.productType
  })

  // pass new url into fetch
  fetch(url)
  .then((response) => {
    // get response from API and return it
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);

    // check if returns empty array
    if(jsonResponse.length !== 0){
      // call function to display images
      app.displayImages(jsonResponse);
    }else {
      alert('No results');
    }
  })
  } // end of app.getResults

// method to take results from API call and display them on the product page
app.displayImages = (arrayData) => {
  // find the images ul and assign to variable
  const imagesUl = document.querySelector("ul.images");

  // take the data from the API and iterate through it
  arrayData.forEach((item) => {
    // create a list item element
    const li = document.createElement('li');

    // create an image item
    const img = document.createElement('img');

    // add the content we need to the image element
    img.src = item.api_featured_image;
    img.width = "350";
    img.height = "350"; 
    img.alt = item.description;
    
     // append the img element to the list item
    li.appendChild(img);

    // append the li to the gallery ul
    imagesUl.appendChild(li);
  })

}// end of display images



app.init = () => {
  // 
  app.formFilter();
   // populate product category select
      app.generateProductCategories();
}

// call init
app.init();


function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
