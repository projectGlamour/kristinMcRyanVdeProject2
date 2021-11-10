const receivedValue = localStorage.getItem("ProductValueSentFromHome");

// namespacing starts
const app = {};


document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${receivedValue}`;



// variable list - namespace - starts
app.apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";
let productCategoryOption = ""; 
app.brandSelected = ""; // variable for the user's brand selection
app.priceLessThan = 1000; // variable for user's price selection
app.priceGreaterThan = 0; // variable for user's price selection


// method to get form element, listen for form submission and assign variables based on user's selections
app.formFilter = () => {
  //get form element
  const formElement = document.querySelector("form");
  const submitButtonElement = document.querySelector("button[type=submit]");
  console.log(formElement, submitButtonElement);

  //add event listener to submit button
  submitButtonElement.addEventListener("click", function(event){
    event.preventDefault();
    
    // get selected brand
    const brandOption = formElement[0].selectedIndex;
    //check if brand selected
    // if no user input option = 0
    if (brandOption !== 0){
      // save value of selected brand in variable
      app.brandSelected = formElement[0][brandOption].value;
    }

    //  get selected price range selected by user
    const priceOption = formElement[1].selectedIndex;
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
    }



    const productCategory = formElement[2].selectedIndex;
    
    if (productCategory === 1) {
      app.productCategoryOption = "lipstick"; 

    }
    else if (productCategory === 2) {

      app.productCategoryOption = "lip_gloss"; 

    }

    else if (productCategory === 3) {
      app.productCategoryOption = "lip_stain";
    }

    console.log(app.brandSelected, app.priceGreaterThan, app.priceLessThan);

    // call API

   
    app.getResults();
  })
} // end of app.formFilter

function removeimages (){
  let list = document.getElementById("images");   // Get the <ul> element with id="myList"
  list.remove();

  const NewUl = document.getElementById("imageGallery");
  const uniUL = document.createElement("ul");
  uniUL.setAttribute("id", "images");
  uniUL.setAttribute("class", "images");
  NewUl.appendChild(uniUL);



  
}
// method to take variables with user's selections and send to API
app.getResults = () => {
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    // pass in variables from form
    product_category: app.productCategoryOption,
    brand: app.brandSelected,
    price_greater_than: app.priceGreaterThan,
    price_less_than: app.priceLessThan,

  })

  // pass new url into fetch
  fetch(url)
  .then((response) => {
    // get response from API and return it
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(jsonResponse);
    // call function to display images
    app.displayImages(jsonResponse);
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
}

// call init
app.init();