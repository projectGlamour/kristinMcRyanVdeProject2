const app = {};

app.apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";



app.getProductType = () => {
  // get all product buttons
  const buttonList = document.querySelectorAll("button[id^=product");
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


app.loadProductPage = () => {
  // change the header to include the product type
  app.loadProductPageTitle();

}
app.loadProductPageTitle = () => {
  // get h2 on product page
  const spanElement = document.querySelector('span');
  // const h2Element = document.querySelector('h2');
  spanElement.textContent = app.productTypeSelected;
}

app.init = () => {
  // 
  // app.formFilter();

  app.getProductType();
}



// call init
app.init();

const buttonclick = document.querySelectorAll(".type");

document.querySelectorAll('.type').forEach(item => {
  item.addEventListener('mouseenter', play => {
    
  let audio = document.getElementById("SB1");
  audio.play();

  })
})
