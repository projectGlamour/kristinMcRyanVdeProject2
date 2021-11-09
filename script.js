// Psuedo code
/*
    save user's product selection in a variable
    use that info to load the title of the product page
    save user preference selections from checkboxes on product page in variables
    use the user's product selection and preference selections in the API call
    display the first 15 products from the API call as images on the bottom of the page
    include details about each product that was received from the API call such as price
*/

const app = {};

app.apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";

// app.priceGreaterThan = null;
// app.priceLessThan = null;
// app.ratingGreaterThan = null;
// app.ratingLessThan = null;


app.getProductType = () => {
  // get all product buttons
  const buttonList = document.querySelectorAll("button[id^=product");
  console.log(buttonList);
  // loop through nodelist of buttons
  buttonList.forEach(buttonItem => {
    // add event listener to each button
    buttonItem.addEventListener("click", function(event){
      // save id of clicked button in variable
      app.productTypeSelected = event.target.value;
      productItemValueSentOver = event.target.value; 
      //go to product page
      // window.location.href="product.html";
      console.log(app.productTypeSelected);

      valueSent();
    })
  })
}

function valueSent() {
  localStorage.setItem("ProductValueSentFromHome", productItemValueSentOver);
  window.location.href = "product.html"; 
}

const darkModeOnBttn = document.querySelector("input");
let htmlElement = document.documentElement;

darkModeOnBttn.addEventListener("click", function () {
    
  canvas.style.backgroundColor = "purple";
 
});
// app.formFilter = () => {//
//   //get form element
//   const formElement = document.querySelector("form");
//   const submitButtonElement = document.querySelector("button[type=submit]");
//   console.log(formElement, submitButtonElement);

//   //add event listener to submit button
//   submitButtonElement.addEventListener("click", function(event){
//     event.preventDefault();
  
//     // get selected brand
//     const brandOption = formElement[0].selectedIndex;
//     //check if brand selected
//     if (brandOption !== 0){
//       // save value of selected brand in variable
//       app.brandSelected = formElement[0][brandOption].value;
//       console.log(app.brandSelected);
//     }else {
//       // assign empty string if no brand selected
//       app.brandSelected = '';
//     }

//     //  get selected price range
//     const priceOption = formElement[1].selectedIndex;
//     //  check which price was selected
//     if (priceOption === 1){
//       // least expensive was selected
//       // assign values for price range
//       app.priceLessThan = 25;
//       app.priceGreaterThan = 0;
//     }else if (priceOption === 2){
//       // most expensive was selected
//       // assign values for price range
//       app.priceGreaterThan = 25;
//       app.priceLessThan = 1000;
//     }else {
//       app.priceLessThan = 1000;
//       app.priceGreaterThan = 0;
//     }

//     // get rating selection
//     const ratingSelecton = formElement[2].selectedIndex;
//     // check rating selected
//     if (ratingSelecton === 1){
//       // two stars was selected
//       app.ratingGreaterThan = 1;
//       app.ratingLessThan = 3;
//     }else if (ratingSelecton === 2){
//       // three stars was selected
//       app.ratingGreaterThan = 2;
//       app.ratingLessThan = 4;
//     }else if (ratingSelecton === 3){
//       // four stars was selected
//       app.ratingGreaterThan = 3;
//       app.ratingLessThan = 10;
//     }

//     console.log(app.brandSelected, app.ratingGreaterThan, app.ratingLessThan, app.priceGreaterThan, app.priceLessThan);

//     // call API
//     app.getResults();
//   })
// } 


// app.getResults = () => {
//   const url = new URL(app.apiUrl);
//   url.search = new URLSearchParams({
//     // pass in variables from form
//     product_type: 'lipstick',
//     brand: app.brandSelected,
//     price_greater_than: app.priceGreaterThan,
//     price_less_than: app.priceLessThan,
//     // rating_greater_than: app.ratingGreaterThan,
//     // rating_less_than: app.ratingLessThan
//   })

//   // pass new url into fetch
//   fetch(url)
//   .then((response) => {
//     // get response from API and return it
//     return response.json();
//   })
//   .then((jsonResponse) => {
//     console.log(jsonResponse);
//   })
//   }


//  ** NOT working yet
app.loadProductPage = () => {
  // change the header to include the product type
  app.loadProductPageTitle();

}
//  ** NOT working yet
app.loadProductPageTitle = () => {
  // get h2 on product page
  const spanElement = document.querySelector('span');
  // const h2Element = document.querySelector('h2');
  console.log(spanElement);
  spanElement.textContent = app.productTypeSelected;
}



app.init = () => {
  // 
  // app.formFilter();

  app.getProductType();
}



// call init
app.init();