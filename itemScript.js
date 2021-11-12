window.addEventListener("load", () => {
  const itemName = localStorage.getItem("productName");
  const activeCart =  localStorage.getItem("active")
  if (itemName) {
     getItemFromServer(itemName);
  }
  if (activeCart) {
     document.querySelector(".model-container").classList.add("active")
  }

})

// displying cart Model
function displayCartModel() {
   const cartIcon = document.querySelector(".cart-icon")
   const closeIcon = document.querySelector(".close-icon")
   const cartModel = document.querySelector(".model-container")

   cartIcon.addEventListener("click", () =>{
      cartModel.classList.toggle("active")
      displayCartItems();
      increaseAndDecreaseCartQuantity()
   })
   closeIcon.addEventListener("click", () =>{
      cartModel.classList.remove("active")
      localStorage.removeItem("active")
   })
   
}
displayCartModel();

function getItemFromServer(itemName) {
  const url = `http://localhost:8080/api/products/item/${itemName}`;
  getServerData(url).then((data) => {
    console.log(data);
    displayItem(data);
  });
}

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

function displayItem(item) {
  const itemContainer = document.querySelector(".item-container");
  const newDiv = document.createElement("div");
  newDiv.classList.add("item-wrapper");
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
   `;
  itemContainer.appendChild(newDiv);
  addCart();
}

// ADD TO CART

function addCart() {
  const addCartBtn = document.querySelector(".add-cart");
  const itemName = document.querySelector(".item-name").innerText;

  const url = `http://localhost:8080/api/products/item/${itemName}`;

  addCartBtn.addEventListener("click", () => {
    let cartCount = localStorage.getItem("cartCount");
    const cartNumber = document.querySelector(".cartNumber");

    if (cartCount) {
      localStorage.setItem("cartCount", parseInt(cartCount) + 1);
      cartNumber.innerText = parseInt(cartCount) + 1;
    } else {
      cartNumber.innerText = 1;
      localStorage.setItem("cartCount", 1);
    }

    getServerData(url).then((data) => {
      data.inCart = 0;
      setItemInCart(data);
      totalCartCost(data);
    });
  });
}
function setItemInCart(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.productName] == undefined) {
      // cartItems[product.inCart] = 1;
      cartItems = {
        ...cartItems,
        [product.productName]: product,
      };
    }
    cartItems[product.productName].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.productName]: product,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  console.log(cartItems);
}

function displayCartItems() {
  let cartItems = localStorage.getItem("productsInCart");
  let cartTotalCost = localStorage.getItem("totalCost");

  const cartContainer = document.querySelector(".model-item-container");
  const cartTotals = document.querySelector(".model-item-checkout");
  cartItems = JSON.parse(cartItems);

  if (cartItems) {
    cartContainer.innerHTML = " ";
    Object.values(cartItems).map((item) => {
      cartContainer.innerHTML += `
         <div class="model-item">
               <div class="model-image">
                  <img src="${item.imageUrl}" alt="${item.productName}">
               </div>
               <div class="model-item-content">
                  <p class="item-profile">${item.profile}</p>
                  <p class="item-brand">${item.brand}</p>
                  <p class="item-name">${item.productName}</p>
                  <div class="item-quantity-btns">
                     <button class="minus">-</button>
                     <button disabled class="quantity">${item.inCart}</button>
                     <button class="plus">+</button>
                  </div>
               </div>
               <div class="model-item-price">
                  <p class="item-price">$ ${item.price * item.inCart},00</p>
                  <button class="item-remove">Remove</button>
               </div>
         </div>
         `;
    });

    cartTotals.innerHTML = `
            <div class="model-item-cost">
               <p>Subtotal</p>
               <p class="cart-total-cost">$ ${cartTotalCost},00</p>
            </div>
            <div class="model-item-taxes">
               Shipping and Taxes are included in the total
            </div>
            <button class="checkout"> Checkout <i class="fas fa-angle-double-right"></i></button>
      `;
  }else{
   cartContainer.innerHTML = "<h2>No Item in the cart</h2>";
   cartTotals.innerHTML = `
            <div class="model-item-cost">
               <p>Subtotal</p>
               <p class="cart-total-cost">$ 00</p>
            </div>
            <div class="model-item-taxes">
               Shipping and Taxes are included in the total
            </div>
            <button> Checkout <i class="fas fa-angle-double-right"></i></button>
      `;
  }
}

displayCartItems();

function totalCartCost(product) {
  let cartTotalCost = localStorage.getItem("totalCost");

  if (cartTotalCost != null) {
    cartTotalCost = parseInt(cartTotalCost);
    localStorage.setItem("totalCost", cartTotalCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function cartNumberUpdate() {
  let cartCount = localStorage.getItem("cartCount");
  const cartNumber = document.querySelector(".cartNumber");

  if (cartCount) {
    cartNumber.innerText = cartCount;
  } else {
    cartNumber.innerText = 0;
  }
}

cartNumberUpdate();

// INCREASING AND DECREASING QUANTITY

function increaseAndDecreaseCartQuantity() {
  const cartItems = document.querySelectorAll(".model-item");

  cartItems.forEach((item) => {
    plusButtonPressed(item);
    minusButtonPressed(item);
    removeButtonPressed(item)
  });
}
increaseAndDecreaseCartQuantity();

function plusButtonPressed(item) {
  const itemsIncartArray = JSON.parse(localStorage.getItem("productsInCart"));

  const productName = item.querySelector(".item-name").innerText;
  const increaseBtn = item.querySelector(".plus");
  const displayBtn = item.querySelector(".quantity");

  const totalLabel = item.querySelector(".item-price");

  increaseBtn.addEventListener("click", () => {
    const quantity = parseInt(displayBtn.innerText);
    const totalQuantity = quantity + 1;
    displayBtn.innerText = totalQuantity;
    itemsIncartArray[productName].inCart = totalQuantity;

    localStorage.setItem("productsInCart", JSON.stringify(itemsIncartArray));

    // updating cart count as we press plus btn
    increasingCartCountPlusBtn();

    // updating total item cost
    updatingCartItemTotal(itemsIncartArray[productName], totalLabel);

    // updating total cart cost
    updatingCartTotal(itemsIncartArray[productName]);
  });
}
function minusButtonPressed(item) {

   
  const itemsIncartArray = JSON.parse(localStorage.getItem("productsInCart"));

  const productName = item.querySelector(".item-name").innerText;
  const decreaseBtn = item.querySelector(".minus");
  const displayBtn = item.querySelector(".quantity");

  const totalLabel = item.querySelector(".item-price");

  decreaseBtn.addEventListener("click", () => {
    const quantity = parseInt(displayBtn.innerText);
    if (quantity <= 1) {
      decreaseBtn.setAttribute("disable");
   }
    const totalQuantity = quantity - 1;
    displayBtn.innerText = totalQuantity;
    itemsIncartArray[productName].inCart = totalQuantity;

    localStorage.setItem("productsInCart", JSON.stringify(itemsIncartArray));

   
   // updating cart count as we press minus btn
    decreasingCartCountMinusBtn(1)

    // updating total item cost
    updatingCartItemTotal(itemsIncartArray[productName], totalLabel);

    // updating total cart cost
    updatingCartTotalMinusBtn(itemsIncartArray[productName])
  });
}

function removeButtonPressed(item) {
   const removeBtn = item.querySelector(".item-remove")
   removeBtn.addEventListener("click", () =>{
      removeBtn.innerHTML = 'removing <i class="fas fa-circle-notch fa-spin"></i>'
      setTimeout(() => {
         const itemsIncartArray = JSON.parse(localStorage.getItem("productsInCart"));
         const productName = item.querySelector(".item-name").innerText;
         const quantity = parseInt(item.querySelector(".quantity").innerText);
         // Decreasing cartCoutBy quantity
         decreasingCartCountMinusBtn(quantity)

         updatingCartTotalRemoveBtn(itemsIncartArray[productName], quantity)

         // delete itemsIncartArray[productName];
         delete itemsIncartArray[productName];


         localStorage.setItem("productsInCart", JSON.stringify(itemsIncartArray));
         item.classList.add("active")
         setTimeout(() => {  
            item.style.display = " none";
         }, 500);

      }, 2000);
      // displayCartItems();
   })
}

function increasingCartCountPlusBtn() {
  let cartCount = localStorage.getItem("cartCount");
  const cartNumber = document.querySelector(".cartNumber");
  localStorage.setItem("cartCount", parseInt(cartCount) + 1);
  cartNumber.innerText = parseInt(cartCount) + 1;
}

function decreasingCartCountMinusBtn(count) {
   let cartCount = localStorage.getItem("cartCount");
   const cartNumber = document.querySelector(".cartNumber");
   localStorage.setItem("cartCount", parseInt(cartCount) - count);
   cartNumber.innerText = parseInt(cartCount) - count;
 }

function updatingCartItemTotal(item, totalLabel) {
  const total = item.price * item.inCart;
  totalLabel.innerText = `$ ${total},00`;
}

function updatingCartTotal(item) {
  let cartTotalCost = parseInt(localStorage.getItem("totalCost")) + item.price;
  const cartTotalLabel = document.querySelector(".cart-total-cost");
  cartTotalLabel.innerText = `$ ${cartTotalCost},00`;
  localStorage.setItem("totalCost", cartTotalCost);
}

function updatingCartTotalMinusBtn(item) {
  let cartTotalCost = parseInt(localStorage.getItem("totalCost")) - item.price;
  const cartTotalLabel = document.querySelector(".cart-total-cost");
  cartTotalLabel.innerText = `$ ${cartTotalCost},00`;
  localStorage.setItem("totalCost", cartTotalCost);
}

function updatingCartTotalRemoveBtn(item, quantity) {
  let cartTotalCost = parseInt(localStorage.getItem("totalCost")) - (item.price * quantity);
  const cartTotalLabel = document.querySelector(".cart-total-cost");
  cartTotalLabel.innerText = `$ ${cartTotalCost},00`;
  localStorage.setItem("totalCost", cartTotalCost);

  console.log(parseInt(localStorage.getItem("totalCost")));
  console.log(quantity);
}

// CHECKING OUT ONCE CHECKOUTBTN IS PRESSSED
function checkoutBtnPressed() {
  const checkoutBtn = document.querySelector(".checkout")
  checkoutBtn.addEventListener("click",()=>{
    window.location.href = "checkout.html"
  })
}
checkoutBtnPressed();
