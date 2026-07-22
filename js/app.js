
//========================>> 
// 1. data source
//========================>>
const scooterProducts = [
  [0, 'Scooterama Breeze 200', 349.99, 'Lightweight city scooter.', 'assets/images/scooter1.png'],
  [1, 'Scooterama NightRider X', 499.99, 'Sleek black frame with LED.', 'assets/images/scooter2.png'],
  [2, 'Scooterama Coastline Pro', 429.99, 'Built for longer rides.', 'assets/images/scooter3.png'],
  [3, 'Scooterama Neon Glide', 379.99, 'Bright neon details.', 'assets/images/scooter4.png'],
  [4, 'Scooterama EcoMotion E1', 799.99, 'Electric commuter scooter.', 'assets/images/scooter5.png'],
  [5, 'Scooterama Campus Cruiser', 299.99, 'Compact and easy to carry.', 'assets/images/scooter6.png'],
  [6, 'Scooterama Skyline Air', 459.99, 'Air-filled tires.', 'assets/images/scooter7.png'],
  [7, 'Scooterama RetroWave', 389.99, 'Retro-inspired design.', 'assets/images/scooter8.png']
];

//========================>> 
// 2. app logic
//========================>>

let cart = new Cart(); // Cart.js is loaded first in HTML before app.js so it works
let count = 0;
let menuOpen = false; 

const productCard = document.querySelector('#productCard');
const productCardLeft = document.querySelector('#productCardLeft');
const productCardRight = document.querySelector('#productCardRight');

// create product previews
for (let r = 0; r < scooterProducts.length; r++) {
  let productPreviewDiv = document.createElement('div');
  productPreviewDiv.classList.add('smallProduct');
  productPreviewDiv.setAttribute('onclick', `showCard(${r});`);

  let productPreviewImg = document.createElement('img');
  productPreviewImg.src = scooterProducts[r][4];
  productPreviewImg.classList.add('smallPic');
  productPreviewDiv.appendChild(productPreviewImg);

  let productDesc = document.createElement('p');
  productDesc.innerText = scooterProducts[r][1];
  productPreviewDiv.appendChild(productDesc);

  document.querySelector('#products').appendChild(productPreviewDiv);
}

// menu functions
function toggleMenu() {
  if (!menuOpen) { 
    $('nav').animate({ right: 0 }, 320, 'swing');
    menuOpen = true;
  } else {
    $('nav').animate({ right: -226 }, 260, 'swing');
    menuOpen = false;
  }
}

function closeNav() {
  $('nav').animate({ right: -226 }, 640, 'swing');
  menuOpen = false;
}

// card functions
function showCard(idx) {
  setProduct(idx);
  $('#productCard').animate({ top: 0 }, 320, 'swing');
}

function hideCard() {
  $('#productCard').animate({ top: -1000 }, 220, 'swing');
}

function setProduct(idx) {
  productCardLeft.innerHTML = '';
  productCardRight.innerHTML = '';

  let prodImg = document.createElement('img');
  prodImg.src = scooterProducts[idx][4];
  productCardLeft.appendChild(prodImg);

  let name = document.createElement('h1');
  name.innerText = scooterProducts[idx][1];
  productCardRight.appendChild(name);

  let price = document.createElement('h3');
  price.innerText = `$${scooterProducts[idx][2].toFixed(2)}`;
  productCardRight.appendChild(price);

  let desc = document.createElement('p');
  desc.innerText = scooterProducts[idx][3];
  productCardRight.appendChild(desc);

  let qty = document.createElement('input');
  qty.setAttribute('type', 'text');
  qty.setAttribute('value', 1);
  productCardRight.appendChild(qty);

  let cartBtn = document.createElement('input');
  cartBtn.setAttribute('type', 'button');
  cartBtn.setAttribute('id', idx);
  cartBtn.setAttribute('onclick', `addItem(this.id);`);
  cartBtn.setAttribute('value', 'Add to Cart NOW!');
  productCardRight.appendChild(cartBtn);
}

// cart panel functions 
function showCart() {
  cart.displayCart();
  $('#cartPanel').animate({ bottom: 0 }, 320, 'swing');
}

function hideCart() {
  $('#cartPanel').animate({ bottom: -600 }, 220, 'swing');
}

// add item logic
function addItem(idx) {
  idx = parseInt(idx, 10);
  let qtyInput = productCardRight.querySelector('input[type="text"]');
  let quantity = parseInt(qtyInput.value, 10);
  
  // is quantity greater than or equal to 1? if yes, use it. if no, use 1
  quantity = (quantity >= 1) ? quantity : 1; // the Ternary Operator (Best "Professional" Style)

  
  // creating quantity loop
  // the Cart class will handle grouping these into one line item
  for (let i = 0; i < quantity; i++) {
    let item = new Item(idx);
    cart.addItem(item);
  }

  // update UI & storage
  count = cart.getCartCount();
  document.querySelector('#cartCounter').innerText = count;
  saveCartToLocalStorage();
  hideCard();
}

// clear cart logic
function clearCart() {
  localStorage.removeItem('cart'); 
  hideCart();
  cart.clearItems();
  cart.displayCart();
  count = 0;
  document.querySelector('#cartCounter').innerText = count;
}

//========================>> 
// 3. local storage logic
//========================>>

function saveCartToLocalStorage() {
// if cart doesn't exist, or cart.items doesn't exist then stop.
if (!cart?.items) return;

  let cartString = "";

  // 1. Loop through every item in the cart
  for (let i = 0; i < cart.items.length; i++) {
    let item = cart.items[i];
    let qty = item.quantity || 1; // default to 1 if undefined

    // 2. add the ID to the string 'qty' times
    // if quantity is 2, this loop runs twice: "0;0;"
    for (let j = 0; j < qty; j++) {
       cartString += item.getId() + ";";
    }
  }

  // 3. save the final string
  localStorage.setItem('cart', cartString);
}

// Load on page ready
$(document).ready(function() {
  const savedCart = localStorage.getItem('cart');
  
  if (savedCart) {
    // 1. Remove the last semicolon, THEN split
    // This gives you ["0", "1", "2"] perfectly, with no empty spots.
    const ids = savedCart.slice(0, -1).split(';');

    // 2. Loop through them
    ids.forEach(id => {
      cart.addItem(new Item(parseInt(id, 10)));
    });

    // 3. Update UI
    count = cart.getCartCount();
    document.querySelector('#cartCounter').innerText = count;
  }
});
