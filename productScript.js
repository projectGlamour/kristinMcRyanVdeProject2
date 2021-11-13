const receivedValue = localStorage.getItem("ProductValueSentFromHome");
console.log(`This is the value from home page ${receivedValue}`)
// adding product category from home page to header
document.getElementById('productTitleContainer').innerHTML = 
`<h2>Imperial Glamour Products ~ ${receivedValue}`;


function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

app.setProductTypeOption = (value) => {
  // change matching option to selected
  document.getElementById(value).selected = true; 
  console.log(`This value of the product type that the option is changed to ${value}`)
  
  // change category 
  app.generateProductCategories(value);

}

// takes the product type from the home page and changes the option of product type select then calls API to generate first call
app.setInitialProductTypeOption = (productName) => {
  // change to value
  const value = app.changeToValue(productName);
  console.log(`This is the converted value of the product sent from home page ${value}`)

  // change matching option to selected
  app.setProductTypeOption(value);

  // generate initial API call for product type
  app.productTypeApiCall(value);
}// end of app.setInitialProductTypeOption


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
    
  // go through product array that equals value of result to assign options for product category
  const chosenCategory = productCategoryArrays[result];
  console.log(`this is the result sent to app.generateProductCategories ${result}`)
  console.log(`This is the category chosen inside app.generateProductCategories ${chosenCategory}`);
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


// API call for product type only
app.productTypeApiCall = (value) => {
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
} // end of app.productTypeApiCall


// listen for user changes to selects and call API for changes
app.listenForSelectChanges = () => {
  //get select elements
  const selectElements = document.querySelectorAll("select");

  // loop through selectElements and add event listeners
  selectElements.forEach((element) => {
    element.addEventListener("change", (event) => {
     
      const result = event.target.classList;
      console.log(`assigning option event listeners to ${result}`);
      
      // get values of selected options in form
      const typeOptionSelected = document.querySelector("#productType option:checked").value;
      const brandOptionSelected = document.querySelector("#brand option:checked").value;
      const categoryOptionSelected = document.querySelector("#category option:checked").value;
      const priceOptionSelected = document.querySelector("#price option:checked").value;

      if (result.contains("productSelect")){
        // user selected a new product type
        // call API for new product type
        console.log(`includes productSelect`)
        app.productTypeApiCall(typeOptionSelected);

        // change product in header to match selection
        const nameCapitalized = app.changeToTitle(typeOptionSelected)
        document.getElementById('productTitleContainer').innerHTML = `<h2>Imperial Glamour Products ~ ${nameCapitalized}`;

        // //clear previous category options 
        const optionsToRemove = document.querySelectorAll(".added");
        optionsToRemove.forEach(event => event.remove());

        // change the category according to product type
        app.setProductTypeOption(typeOptionSelected);

        // reset other selects to 0
        document.getElementById("brand").selectedIndex = 0;
        document.getElementById("price").selectedIndex = 0;
      

      }else {
        console.log(`selected filter other than product`)

        let url = new URL(`${app.apiUrl}`);
        // let params = new URLSearchParams(url.search);
        console.log(typeOptionSelected, brandOptionSelected, categoryOptionSelected, priceOptionSelected)

        if(brandOptionSelected != 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has brand, category and price selected
          console.log("has brand, category and price selected")
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
        }else if(brandOptionSelected != 0 && categoryOptionSelected != 0 && priceOptionSelected == 0){
          // has brand and category selected, no price
          console.log("has brand and category selected, no price")
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
              product_category: categoryOptionSelected
            })
        }else if(brandOptionSelected != 0 && categoryOptionSelected == 0 && priceOptionSelected == 0){
          // has brand selected, no category or price
          console.log("has brand selected, no category or price")
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              brand: brandOptionSelected,
            })
        }else if(brandOptionSelected != 0 && categoryOptionSelected == 0 && priceOptionSelected != 0){
          // has brand and price selected but no category
          console.log("has brand and price selected but no category")
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
        }else if(brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has category and price selected but no brand
          console.log("has category and price selected but no brand")
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
        }else if(brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected == 0){
          // has category, no brand or price
          console.log("has category, no brand or price")
          url.search = new URLSearchParams({
              product_type: typeOptionSelected,
              product_category: categoryOptionSelected,
            })
        }else if(brandOptionSelected == 0 && categoryOptionSelected != 0 && priceOptionSelected != 0){
          // has price, no brand or category
          console.log("has price, no brand or category")
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
        }

        console.log(url)

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
    const button = document.createElement("button");

    // add the content we need to the image element
    img.src = item.api_featured_image;
    li.width = "350";
    img.width = "350";
    li.height = "450";
    li.className = "smallImg";
    h2heading.innerText = item.name;
    img.alt = item.description;
    para.innerText = img.alt;
    div.className = "detail";
    button.innerHTML = "Close"
    
    

  
     // append the img element to the list item
    li.appendChild(img);
    li.appendChild(h2heading);
    li.appendChild(div);
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

app.init = () => {
  // change product category to match received value from home page
  app.setInitialProductTypeOption(receivedValue);

  // listen for user changes to selects
  app.listenForSelectChanges();
  
}


// call init
app.init();
