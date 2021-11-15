function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// namespacing starts
const app = {};

app.getReceivedType = () => {
  app.receivedValue = localStorage.getItem("ProductValueSentFromHome");
  console.log(app.receivedValue)
  if (app.receivedValue === null){
    app.receivedValue = "lipstick";
  }
  // adding product category from home page to header
  document.getElementById('productTitleContainer').innerHTML = 
  `<h2>Imperial Glamour Products ~ ${app.receivedValue}`;
}


// variable list 
app.apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";


// start of functions 

app.changeToTitle = (value) => {
  // change value to string to put in h2 span
  let text = value.slice(0, 1).toUpperCase() + value.slice(1);
 
  if (text === "Lip_liner"){
    newText = text.slice(0, 3) + " " + text.slice(4);
    return newText
  }
  return text;
}

app.changeToValue = (title) => {
  // change recieved value from title to value 
  let text = title.toLowerCase();
  if (text === "lipliner"){
    newText = text.slice(0, 3) + "_" + text.slice(3);
    return newText
  }
  return text; 
}

// takes the product type from the home page and changes the option of product type select then calls API to generate first call
app.setInitialProductTypeOption = (productName) => {
  // change to value
  const value = app.changeToValue(productName);

  // change matching option to selected
  document.getElementById(value).selected = true; 

  // change category 
  app.generateProductCategories(value);

  // generate initial API call for product type
  const url = new URL (app.apiUrl);
  url.search = new URLSearchParams({
        product_type: value
      })
  app.apiCall(url);
}// end of app.setInitialProductTypeOption


app.generateProductCategories = (result) => {
  const productCategoryArrays = {
    blush: ["powder", "cream"],
    bronzer: ["powder"],
    eyeliner: ["liquid", "pencil", "gel", "cream"],
    eyeshadow: ["palette", "pencil", "cream"],
    foundation: ["concealer", "liquid", "contour", "bb cc", "cream", "mineral", "powder", "highlighter"],
    lip_liner: ["pencil"],
    lipstick: ["lipstick", "lip gloss", "liquid"]
  }
    
  // go through product array that equals value of result to assign options for product category
  const chosenCategory = productCategoryArrays[result];

  // get product category select
  const productCategorySelect = document.getElementById("category");

  // loop through product array to populate category select
  chosenCategory.forEach((item) => {
    // create option
    const option = document.createElement("option");
    option.classList.add("added", "categoryClass");
    option.value = item;
    option.text = item;

    productCategorySelect.appendChild(option);
  })
}// end of app.generateProductCategories


// API call 
app.apiCall = (url) => {
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
      // get alert div
      const alertDiv = document.querySelector(".alert");
      const alertButton = document.querySelector(".closeButton");

      alertDiv.classList.toggle("showAlert");

      // add event listener to close alert
      alertButton.addEventListener("click", () => {
        alertDiv.classList.remove("showAlert");
      });
    }
  })
} // end of app.apiCall


// listen for user changes to selects and call API for changes
app.listenForSelectChanges = () => {
  //get select elements
  const selectElements = document.querySelectorAll("select");

  const url = new URL(app.apiUrl);

  // loop through selectElements and add event listeners
  selectElements.forEach((element) => {
    element.addEventListener("change", (event) => {
     
      // get values of selected options in form
      const typeOptionSelected = document.querySelector("#productType option:checked").value;
      const brandOptionSelected = document.querySelector("#brand option:checked").value;
      const categoryOptionSelected = document.querySelector("#category option:checked").value;
      const priceOptionSelected = document.querySelector("#price option:checked").value;
      console.log(priceOptionSelected)
      
      const result = event.target.classList;
        
      if (result.contains("productSelect")){
        //clear previous category options 
        const optionsToRemove = document.querySelectorAll(".added");
        optionsToRemove.forEach(event => event.remove());

        // change the category according to product type
        if (typeOptionSelected != 0){
          app.generateProductCategories(typeOptionSelected);
        }
        // change product in header to match selection
        const nameCapitalized = app.changeToTitle(typeOptionSelected)
        document.getElementById('productTitleContainer').innerHTML = `<h2>Imperial Glamour Products ~ ${nameCapitalized}`;

      }
   
      if (typeOptionSelected != 0 && brandOptionSelected == 0 && categoryOptionSelected == 0 && priceOptionSelected == 0){
        // user selected a new product type
        // call API for new product type
        url.search = new URLSearchParams({
          product_type: typeOptionSelected
        })
        app.apiCall(url);

        // change product in header to match selection
        const nameCapitalized = app.changeToTitle(typeOptionSelected)
        document.getElementById('productTitleContainer').innerHTML = `<h2>Imperial Glamour Products ~ ${nameCapitalized}`;

        // reset other selects to 0
        document.getElementById("brand").selectedIndex = 0;
        document.getElementById("price").selectedIndex = 0;
      

      }else if (typeOptionSelected == 0 && brandOptionSelected == 0 && categoryOptionSelected == 0 && priceOptionSelected == 0) {
        // searching ALL products
        app.apiCall(url);

        // change header
        const nameCapitalized = app.changeToTitle(brandOptionSelected)
        document.getElementById('productTitleContainer').innerHTML = `<h2>Imperial Glamour Products</h2>`;

      }else {
        // product type selected with other filters
        if(typeOptionSelected != 0 && brandOptionSelected != 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has product type, brand, category and price selected
          if (priceOptionSelected === "leastExpensive"){
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              product_category: categoryOptionSelected,
              price_greater_than: 0,
              price_less_than: 25
            })
          }else{
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              product_category: categoryOptionSelected,
              price_greater_than: 25,
              price_less_than: 1000
            })
          };
        }else if(typeOptionSelected != 0 && brandOptionSelected != 0 && categoryOptionSelected != 0 && priceOptionSelected == 0){
          // has type, brand and category selected, no price
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              product_category: categoryOptionSelected
            })
        }else if(typeOptionSelected != 0 && brandOptionSelected != 0 && categoryOptionSelected == 0 && priceOptionSelected == 0){
          // has type, brand selected, no category or price
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
            })
        }else if(typeOptionSelected != 0 && brandOptionSelected != 0 && categoryOptionSelected == 0 && priceOptionSelected != 0){
          // has type, brand and price selected but no category
          if (priceOptionSelected === "leastExpensive"){
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              price_greater_than: 0,
              price_less_than: 25
            })
          }else{
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              price_greater_than: 25,
              price_less_than: 1000
            })
          };
        }else if(typeOptionSelected != 0 && brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has type, category and price selected but no brand
          if (priceOptionSelected === "leastExpensive"){
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              product_category: categoryOptionSelected,
              price_greater_than: 0,
              price_less_than: 25
            })
          }else{
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              product_category: categoryOptionSelected,
              price_greater_than: 25,
              price_less_than: 1000
            })
          }
        }else if(typeOptionSelected != 0 && brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected == 0){
          // has type, category, no brand or price
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              product_category: categoryOptionSelected,
            })
        }else if(typeOptionSelected != 0 && brandOptionSelected == 0 && categoryOptionSelected == 0 && priceOptionSelected != 0){
          // has type, price, no brand or category
          if (priceOptionSelected === "leastExpensive"){
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              price_greater_than: 0,
              price_less_than: 25
            })
          }else{
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              price_greater_than: 25,
              price_less_than: 1000
            })
          }
        }else if(typeOptionSelected != 0 && brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has type, price, no brand or category
          if (priceOptionSelected === "leastExpensive"){
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              price_greater_than: 0,
              price_less_than: 25
            })
          }else{
            url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              price_greater_than: 25,
              price_less_than: 1000
            })
          }
        }else if (typeOptionSelected == 0 && brandOptionSelected != 0 && categoryOptionSelected == 0 && priceOptionSelected == 0) {
        // searching by brand ONLY
        url.search = new URLSearchParams({
          brand: brandOptionSelected
        });
        // change name in header to match brand selection
        const nameCapitalized = app.changeToTitle(brandOptionSelected)
        document.getElementById('productTitleContainer').innerHTML = `<h2>Imperial Glamour Products ~ ${nameCapitalized}`;
        }
        // call API
        app.apiCall(url);
      }
    })
  })
}// end of app.listenForSelectChanges


// method to take results from API call and display them on the product page
app.displayImages = (arrayData) => {
  // clear any images in the gallery
    const imageList = document.getElementById("ulImages"); 
    imageList.innerText = '';

  // find the images ul and assign to variable
  const imagesUl = document.querySelector("ul.images");

  // take the data from the API and iterate through it
  arrayData.forEach((item) => {
    // create a list item element
    const li = document.createElement("li");
   
    // create an image item
    const img = document.createElement("img");
    const div = document.createElement("div");
    const para = document.createElement("p");
    const h2heading = document.createElement("h2");
    const h3heading = document.createElement("h3");
    const h4heading = document.createElement("h4");
    const button = document.createElement("button");

    // add the content we need to the image element
    img.src = item.api_featured_image;
    li.width = "350";
    img.width = "350";
    li.height = "450";
    li.className = "smallImg";
    h2heading.innerText = item.name;
    h3heading.innerText = item.name;
    h4heading.innerText = item.brand; 
    img.alt = item.description;
    para.innerText = img.alt;
    div.className = "detail";
    button.innerHTML = "Close"
    
    

  
     // append the img element to the list item
    li.appendChild(img);
    li.appendChild(h2heading);
    li.appendChild(div);
    div.appendChild(h3heading);
    div.appendChild(h4heading);
    div.appendChild(para);
    div.appendChild(button);
    // append the li to the gallery ul
    imagesUl.appendChild(li);

    li.addEventListener("click", function () {
      li.classList.toggle("open");
      img.classList.toggle("opened");
      button.classList.toggle("show");
    });
  })
}// end of display images

app.changeScreenMode = () => {
  // options for user to change color scheme
  const darkModeOnBttn = document.querySelector("#first");
  const darkModeOffBttn = document.querySelector("#second");
  const normalizeBttn = document.querySelector("#third");
  let htmlElement = document.documentElement;
  
  darkModeOnBttn.addEventListener("click", function () {
    htmlElement.setAttribute("data-theme", "dark");
  });
  
  darkModeOffBttn.addEventListener("click", function () {
    htmlElement.setAttribute("data-theme", "christmas");
  });
  
  normalizeBttn.addEventListener("click", function () {
    htmlElement.setAttribute("data-theme", "light");
  });
}


app.init = () => {

  app.changeScreenMode();
  // change product category to match received value from home page
  app.getReceivedType();
  app.setInitialProductTypeOption(app.receivedValue);

  // listen for user changes to selects
  app.listenForSelectChanges();
}


// call init
app.init();
