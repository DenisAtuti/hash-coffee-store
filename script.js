// MENU TAGGLE
const menuIcon = document.getElementById("menuIcon");
const burger = document.getElementById("burger");
const productDisplay = document.querySelector(".products");

menuIcon.addEventListener("click", () => {
  burger.classList.toggle("active");
  menuIcon.classList.toggle("active");
  productDisplay.classList.toggle("active");
});

// when cart icon is clicked on the main page
function cartIconPressed() {
  const cartIcon = document.querySelector(".cart-icon")
  cartIcon.addEventListener("click", () =>{
    localStorage.setItem("active","active")
    location.href= "item.html"
  })
}
cartIconPressed() 
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

window.onload = function () {
  getMenu();
  getBestSellers();
  createProductContainer();
  // productSlideNow();
};

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

// GETTING DATA FROM THE SERVER

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
  displayProductMenuItem()
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

  getBestSellerItem();
}





// CREATION PRODUCT ELEMENTS
function getServerData(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function createProductContainer() {
  let url = "http://localhost:8080/api/products/brands";
  getServerData(url).then((brands) => {
    brands.forEach((brand) => {
      let url2 = `http://localhost:8080/api/products/brand/${brand}`;
      
      getServerData(url2).then((products) => {
        const productClass = brand.replace(/\s/g, '-');
        const productContainer = document.querySelector(".products");
        const newDiv = document.createElement("div");
        newDiv.classList.add("product-container");
        newDiv.innerHTML = `
            <div class="product-header">
              <h4 class="product-brand-name">${brand}</h4>
              <p class="tagline">Simply the best</p>
            </div>
            <div class="product-slider-container ${productClass}">
          `;
        productContainer.appendChild(newDiv);
        products.forEach((item) => {
          const productSliderContainer = document.querySelector(
            `.product-slider-container.${productClass}`
            );

          const newDiv2 = document.createElement("div");

          newDiv2.classList.add("product-slider");
          newDiv2.setAttribute("id",`${item.id}`)
          // newDiv2.innerHTML = "<h2>work please</h2>"
          newDiv2.innerHTML = `
                  <div class="product-slider-image">
                      <img src=${item.imageUrl} alt="">
                  </div>
                <div class="product-slider-header">
                    <div class="roast">
                        <p>${item.roast}</p>
                        <p>${item.profile}</p>
                    </div>
                    <div class="product-name">${item.productName}</div>
                    <div class="price">$ ${item.price}</div>
                </div>
          `;

          productSliderContainer.appendChild(newDiv2);
          // console.log(item);
        });
        productSlideNow(productClass)
      });
    });
  });
}

// ALL PRODUCTS SLIDERS

function productSlideNow(shit) {
  const productSlider = $("." + shit);
  productSlide(productSlider);
  displayProductItem()
}

function slickSliderProductResize(windowWidth) {
  var answer;
  switch (true) {
    case windowWidth >= 1440:
      answer = 2;
      break;
    case windowWidth >= 1024:
      answer = 2;
      break;
    case windowWidth <= 768:
      answer = 1;
      break;
    // case windowWidth <= 600:
    //   answer = 1;
    //   break;
    default:
      answer = 1;
  }
  return answer;
}
function productSlide(container) {
  let windowWidth = document.body.clientWidth;
  let showSlides = slickSliderProductResize(windowWidth);

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

// ADD TO CURT
function displayProductItem() {
  const productItem = document.querySelectorAll(".product-slider")
  // console.log(productItem);
  productItem.forEach(item =>{
    item.addEventListener("click",(e) =>{
      const itemName = item.querySelector(".product-name").innerHTML
      localStorage.setItem("productName",itemName)
      window.location.href = "item.html"
      //  console.log(item);
      })
    })
}

// GET MENU ITEMS
function displayProductMenuItem(){
  const brands = document.querySelectorAll(".brand")
  brands.forEach(brand =>{
    brand.addEventListener("click",() =>{
      const brandName = brand.querySelector(".brand-header").innerHTML;
      drawBodyBasedonBrand(brandName)
      
    })
  })
}

// CREATING BODY BASED ON BRAND

function drawBodyBasedonBrand(brandName) {
  burger.classList.remove("active")
  productDisplay.classList.remove("active")

  productDisplay.innerHTML =""
  const newDiv = document.createElement("div")
  newDiv.classList.add("brand-product-container")
  newDiv.innerHTML = `
        <div class="brand-product-header">
            <h2>${brandName}</h2>
            <p>Simply the Best</p>
        </div>
        <div class="brand-product-wrapper">
  `

  productDisplay.appendChild(newDiv)

  const url = `http://localhost:8080/api/products/brand/${brandName}`;
  console.log(brandName);
  getServerData(url).then(data =>{
    data.forEach(item =>{
      const brandProductWrapper = document.querySelector(".brand-product-wrapper");
      const newDiv2 = document.createElement("div")
      newDiv2.classList.add("brand-product")
      newDiv2.innerHTML = `
            <div class="brand-product-image">
              <img src="${item.imageUrl}" alt="${item.productName}">
            </div>
            <div class="brand-product-roast">
              <p>${item.roast}</p>
              <p>${item.profile}</p>
            </div>
            <div class="brand-product-name">${item.productName}</div>
            <div class="brand-product-price">$ ${item.price}</div>
           
      `
      // <div class="brand-add-cart">Add to cart</div>
      brandProductWrapper.appendChild(newDiv2);
      // showItemBasedOnBrand();
    })
    showItemBasedOnBrand();
  }) 
}

function showItemBasedOnBrand() {
  const brandProduct = document.querySelectorAll(".brand-product")
  brandProduct.forEach(brand =>{
    brand.addEventListener("click",()=>{
      const itemName = brand.querySelector(".brand-product-name").innerHTML
      localStorage.setItem("productName",itemName);
      window.location.href = "item.html"
    })
  })
}

// ADDING BEST SELLER TO CART PAGE

function getBestSellerItem() {
  const bestSellerContainer = document.querySelectorAll(".best-seller")
  // localStorage.removeItem("productName")
  bestSellerContainer.forEach(item =>{
    item.addEventListener("click",()=>{
      const itemName = item.querySelector(".best-seller-span > h4").innerHTML
      localStorage.setItem("productName",itemName);
      window.location.href = "item.html"
      console.log(item);
    })
  })
}

// UPDATING CART COUNT

function cartNumberUpdate() {
  let cartCount = localStorage.getItem("cartCount");
  const cartNumber = document.querySelector(".cartNumber")

  if (cartCount) {
     cartNumber.innerText = cartCount
  }else{
     cartNumber.innerText = 0
  }
}

cartNumberUpdate();