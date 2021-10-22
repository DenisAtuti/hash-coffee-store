window.addEventListener("load",()=>{
   getMenu();
   getBestSellers();
   const itemName =  localStorage.getItem("productName");
   getItemFromServer(itemName)
   
})

// MENU FACTIONALITY
const menuIcon = document.getElementById("menuIcon");
const burger = document.getElementById("burger");
// const productDisplay = document.querySelector(".products");

menuIcon.addEventListener("click", () => {
  burger.classList.toggle("active");
  menuIcon.classList.toggle("active");
//   productDisplay.classList.toggle("active");
});

// BRANDS SLINDER
function slickSliderResize(windowWidth) {
   var answer;
   switch (true) {
     case windowWidth >= 1440:
       answer = 4;
       break;
     case windowWidth >= 1024:
       answer = 3;
       break;
     case windowWidth >= 768:
       answer = 2;
       break;
     case windowWidth <= 600:
       answer = 1;
       break;
     default:
       answer = 1;
   }
   return answer;
 }
 
 
 function slide(container) {
   let windowWidth = document.body.clientWidth;
   let showSlides = slickSliderResize(windowWidth);
   // console.log(showSlides);
   // console.log(windowWidth);
 
   container.slick({
     autoplay: true,
     autoplaySpeed: 1500,
     arrows: true,
     prevArrow: '<button type="button" class="slick-prev"></button>',
     nextArrow: '<button type="button" class="slick-next"></button>',
     centerMode: true,
     slidesToShow: showSlides,
     slidesToScroll: showSlides,
   });
 }

 async function getProducts() {
   let url = "http://localhost:8080/api/products/all";
 
   try {
     let response = await fetch(url);
     return await response.json();
   } catch (error) {
     console.log(error);
   }
 }
 
 async function getMenu() {
   const brandContainer = document.getElementById("brand-slider");
 
   let products = await getProducts();
 
   products.forEach((item) => {
     if (item.main) {
       const newDiv = document.createElement("div");
 
       newDiv.classList.add("brand");
 
       newDiv.innerHTML = `<span class="brand-header">${item.brand}</span>
                           <div class="brand-image">
                             <img src="${item.imageUrl}" alt="${item.productName}">
                           </div>`;
       brandContainer.appendChild(newDiv);
     }
   });
 
   const brandSlider = $("#brand-slider");
   slide(brandSlider);
 }
 
 // BEST SELLER MENU
 async function getBestSellers() {
   const bestSellerContainer = document.getElementById("best-seller-slider");
   let products = await getProducts();
   const sortedData = products
     .sort((a, b) => (a.id > b.id ? 1 : -1))
     .slice(0, 10);
   // console.log(sortedData);
 
   sortedData.forEach((product) => {
     const newDiv = document.createElement("div");
 
     newDiv.classList.add("best-seller");
 
     newDiv.innerHTML = `<div class="best-seller-image">
                               <img src="${product.imageUrl}" alt="${product.productName}">
                           </div>
                           <span class="best-seller-span">
                               <p class="profile">${product.profile}</p>
                               <h4>${product.productName}</h4>
                           </span>`;
     bestSellerContainer.appendChild(newDiv);
   });
 
   const bestSellerSlider = $("#best-seller-slider");
   slide(bestSellerSlider);
 }


function getItemFromServer(itemName){
   const url = `http://localhost:8080/api/products/item/${itemName}`
   getServerData(url).then(data =>{
      displayItem(data)
      
   });
}

function getServerData(url) {
   return fetch(url)
     .then((response) => {
      //  if (response.ok) {
         return response.json();
      //  }
     })
     .then((data) => {
       return data;
     })
     .catch((error) => {
       console.log(error);
     });
 }

function displayItem(item) {
   const itemContainer = document.querySelector(".item-container")
   const newDiv = document.createElement("div")
   newDiv.classList.add("item-wrapper")
   newDiv.innerHTML = `
               <div class="item-brand-header">
               <h2 class="brand-name">${item.brand}</h2>
               <p class="brand-tagline">Simply the best</p>
            </div>
            <div class="item-card">
               <div class="image-container">
                  <img src="${item.imageUrl}" alt="">
               </div>
               <div class="item-header">
                  <div class="item-roast">
                     <p>${item.roast}</p>
                     <p>${item.profile}</p>
                  </div>
                  <div class="item-name">${item.productName}</div>
                  <div class="item-price">$ ${item.price}</div>
               </div>
               <button id="Button" class="add-cart">Add to cart</button>
            </div>
   `
   itemContainer.appendChild(newDiv);
   document.getElementById("Button").disabled = true;
}

// window.addEventListener("resize",()=>{
//    alert(document.body.clientWidth);
// })