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


app.getProductType = () => {
  // get <li className="type"></li>
  const typeLi = document.querySelector('.sideMenu');
  console.log(typeLi);
  // listen for user's selection of li
  typeLi.addEventListener('click', function(e){
    console.log('clicked');
  });
}



app.init = () => {
  // 
  app.getProductType();
}



// call init
app.init();