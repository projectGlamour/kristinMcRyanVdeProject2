const receivedValue = localStorage.getItem("ProductValueSentFromHome");
console.log(`This is the value from home page ${receivedValue}`)
// adding product category from home page to header
document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${receivedValue}`;


// namespacing starts
const app = {};


// variable list - namespace - starts
app.apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";
let productCategoryOption = "";
let count = "0";
app.brandSelected = ""; // variable for the user's brand selection
app.priceLessThan = 1000; // variable for user's price selection
app.priceGreaterThan = 0; // variable for user's price selection
// app.productType = receivedValue;
app.productName = "";

app.changeToTitle = (value) => {
  // change value to string to put in h2 span
  let text = value.slice(0, 1).toUpperCase() + value.slice(1);
  console.log(`this is text in changeToTitle ${text}`)
  if (text === "Lip_liner"){
    newText = text.slice(0, 3) + " " + text.slice(4);
    console.log(`this is the newtext ${newText}`)
    return newText
  }
  return text;
}

app.changeToValue = (title) => {
  // change recieved value from title to value 
  let text = title.toLowerCase();
  if (text === "lipliner"){
    newText = text.slice(0, 3) + "_" + text.slice(3);
    console.log(`this is the newtext ${newText}`)
    return newText
  }
  return text; 
}

// takes the product type and changes the option of product type select then calls API to generate first call
app.setProductTypeOption = (productName) => {
  // change to value
  const value = app.changeToValue(productName);
  console.log(`This is the converted value of the product sent from home page ${value}`)
  // change matching option to selected
  document.getElementById(value).selected = true; 
  console.log(`This value of the product type that the option is changed to ${value}`)

  // change category 
  app.generateProductCategories(value);

  // generate initial API call for product type
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    product_type: value
  })
  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonResponse) => {
     // check if returns empty array
    if(jsonResponse.length !== 0){
      // call function to display images
      app.displayImages(jsonResponse);
    }else {
      alert('No results');
    }
  })
}


app.generateProductCategories = (result) => {
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
    
      // go through array that equals value of result to assign options for product category
      const chosenCategory = productCategoryArrays[result];
      console.log(`this is the result sent to app.generateProductCategories ${result}`)
      console.log(`This is the category chosen inside app.generateProductCategories ${chosenCategory}`);
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
    
}// end of app.generateProductCategories




// method to get form element, listen for form submission and assign variables based on user's selections
app.formFilter = () => {
  //get form element
  let formElement = document.querySelector("form");
  const submitButtonElement = document.querySelector("button[type=submit]");
  // console.log(formElement, submitButtonElement);
  
  // add event listener to product category select
  const productType = document.getElementById("productType");
  productType.addEventListener('change', (event) => {
    console.log(`event listener for product type change  ${event}`)
    const result = event.target.value;

    // //clear previous options 
    const optionsToRemove = document.querySelectorAll(".added");
    optionsToRemove.forEach(event => event.remove());

    app.generateProductCategories(result);
  })
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
      const nameCapitalized = app.changeToTitle(app.productType)
      document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${nameCapitalized}`;

     
    }

    // get selected brand
    const brandOption = formElement[1].selectedIndex;
    //check if brand selected
    // if no user input option = 0
    if (brandOption !== 0){
      // save value of selected brand in variable
      app.brandSelected = formElement[1][brandOption].value;
      console.log(`brand selected was ${app.brandSelected}`)
    }else {
      app.brandSelected = '';
    }

    // get product category selected by user
    const categoryOption = formElement[2].selectedIndex;
    
    if (categoryOption !== 0){
      // save value of category in variable
      app.productCategoryOption = formElement[2][categoryOption].value;
      console.log(`category selected was ${app.productCategoryOption}`);
    }

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

    // console.log(app.brandSelected, app.priceGreaterThan, app.priceLessThan);

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
    name: app.productName,
    product_type: app.productType
  })

  // pass new url into fetch
  fetch(url)
  .then((response) => {
    // get response from API and return it
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(`jsonresponse in getdata API call on submit ${jsonResponse}`);

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
    const para = document.createElement('p');
    const h2heading = document.createElement('h2');

    // add the content we need to the image element
    img.src = item.api_featured_image;
    li.width = "350";
    img.width = "350";
    li.height = "450";
    li.className = "smallImg";
    h2heading.innerText = item.name;
    img.alt = item.description;
    para.innerText = img.alt;

  
     // append the img element to the list item
    li.appendChild(img);
    li.appendChild(para);
    li.appendChild(h2heading);
    // append the li to the gallery ul
    imagesUl.appendChild(li);

    li.addEventListener("click", function () {
      li.classList.toggle("open");
      img.classList.toggle("opened");
    });
  })
}// end of display images

app.init = () => {
  // change product category to match received value from home page
  app.setProductTypeOption(receivedValue);

  // listen for changes to form
  app.formFilter();
}
app.getResults2 = () => {
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    // pass in variables from form
    product_type: app.productType
  })

  // pass new url into fetch
  fetch(url)
  .then((response) => {
    // get response from API and return it
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(`jsonresponse in getdata API call on submit ${jsonResponse}`);

    // check if returns empty array
    if(jsonResponse.length !== 0){
      // call function to display images
      app.displayImages(jsonResponse);
    }else {
      alert('No results');
    }
  })
  }
  


const brandSelectedBySelf = document.querySelectorAll (".brandTypeClass");
function lol (){
  brandSelectedBySelf.forEach(function (item) {
    item.addEventListener('click', function() {
      formElement = document.querySelector("form");
      
      const imageList = document.getElementById("ulImages"); 
      imageList.innerText = '';
  
      const brandOption = formElement[1].selectedIndex;
      const productTypeOption = formElement[0].selectedIndex;
      //check if brand selected
      // if no user input option = 0
      if (brandOption !== 0 && productTypeOption !== 0){
        // save value of selected brand in variable
        app.brandSelected = formElement[1][brandOption].value;
        app.productType = formElement[0][productTypeOption].value;
        app.getResults3();
  
      }
      
      else {
        app.brandSelected = '';
      }
      if (brandOption !== 0 && productTypeOption === 0) {
  
        app.brandSelected = formElement[1][brandOption].value;
        app.getResults4();
  
      }
   
    
    });
  });
}

lol();

app.getResults3 = () => {
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    
    brand: app.brandSelected,
    product_type: app.productType
  })

  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(`jsonresponse in getdata API call on submit ${jsonResponse}`);

    // check if returns empty array
    if(jsonResponse.length !== 0){
      // call function to display images
      app.displayImages(jsonResponse);
    }else {
      alert('No results');
    }
  })
}
  


app.getResults4 = () => {
  const url = new URL(app.apiUrl);
  url.search = new URLSearchParams({
    
    brand: app.brandSelected

  })

  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonResponse) => {
    console.log(`jsonresponse in getdata API call on submit ${jsonResponse}`);

    // check if returns empty array
    if(jsonResponse.length !== 0){
      // call function to display images
      app.displayImages(jsonResponse);
    }else {
      alert('No results');
    }
  })
  }
// call init
app.init();



function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const productSelectedBySelf = document.querySelectorAll (".productTypeClass");
productSelectedBySelf.forEach(function(item) {
  item.addEventListener('click', function() {
    formElement = document.querySelector("form");
    
    const imageList = document.getElementById("ulImages"); 
    imageList.innerText = '';

    const brandOption = formElement[1].selectedIndex;
    const productTypeOption = formElement[0].selectedIndex;

    if (productTypeOption !== 0 && brandOption === 0){
      app.productType = formElement[0][productTypeOption].value;
      app.getResults2();
    }
    
    if (brandOption !== 0 && productTypeOption !== 0){
      app.brandSelected = formElement[1][brandOption].value;
      app.productType = formElement[0][productTypeOption].value;
      app.getResults3();

    }

  
  });
});
  
