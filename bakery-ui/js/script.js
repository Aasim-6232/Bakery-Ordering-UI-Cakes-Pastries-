/* =========================
   FILTER LOGIC
========================= */
const filterButtons = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product-card');

if (filterButtons.length && products.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      products.forEach(product => {
        product.style.display =
          category === 'all' || product.classList.contains(category)
            ? 'block'
            : 'none';
      });
    });
  });
}

/* =========================
   CART SYSTEM
========================= */

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function findItem(cart, id) {
  return cart.find(item => item.id === id);
}

/* ADD ITEM */
function addToCart(id, name, price, image, details = null) {
  let cart = getCart();
  let item = findItem(cart, id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, name, price: Number(price), qty: 1, image, details });
  }

  saveCart(cart);
  renderCart();
  updateCartCount();

  // UI feedback on products page
  const btn = document.querySelector(`.add-to-cart[data-id="${id}"]`);
  if (btn) {
    btn.innerText = 'Added to Cart ✓';
    btn.classList.add('added');
  }
}

/* REMOVE ITEM */
function removeFromCart(id) {
  let cart = getCart();
  let item = findItem(cart, id);

  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

/* =========================
   PRODUCTS PAGE (Toggle Add/Remove)
========================= */

const cartButtons = document.querySelectorAll('.add-to-cart');

if (cartButtons.length) {

  cartButtons.forEach(button => {

    const id = button.dataset.id;

    // Restore state on page load
    const cart = getCart();
    if (cart.find(i => i.id === id)) {
      button.innerText = 'Remove from Cart';
      button.classList.add('added');
    }

    button.addEventListener('click', () => {

      let cart = getCart();
      let existingItem = cart.find(i => i.id === id);

      if (existingItem) {
        // REMOVE ITEM COMPLETELY
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        renderCart();
        updateCartCount();

        button.innerText = 'Order Now';
        button.classList.remove('added');

      } else {
        // ADD ITEM
        addToCart(
          button.dataset.id,
          button.dataset.name,
          button.dataset.price,
          button.dataset.image
        );

        button.innerText = 'Remove from Cart';
        button.classList.add('added');
      }

    });

  });

}

/* =========================
   CART PAGE
========================= */
function renderCart() {
  const cartList = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countDisplay = document.getElementById('cart-count-display');

  if (!cartList) return;

  const cart = getCart();
  cartList.innerHTML = '';

  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    totalItems += item.qty;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" class="cart-item-img">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        ${item.details ? `<small style="display:block;color:#666;font-size:0.8rem;">${item.details}</small>` : ""}
        <span>₹${item.price} × ${item.qty}</span>
      </div>
      <div class="cart-controls">
        <button onclick="removeFromCart('${item.id}')">−</button>
        <span>${item.qty}</span>
        <button onclick="addToCart('${item.id}','${item.name}',${item.price},'${item.image}')">+</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  if (totalEl) totalEl.innerText = total;
  if (countDisplay) countDisplay.innerText = totalItems;
}

/* =========================
   NAVBAR COUNT
========================= */
function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;

  let count = 0;
  cart.forEach(item => count += item.qty);
  countEl.innerText = `(${count})`;
}

/* =========================
   INIT
========================= */
renderCart();
updateCartCount();


/* =========================
   CUSTOM CAKE LIVE BUILDER
========================= */

const flavourSelect = document.getElementById('flavour');
const toppingInputs = document.querySelectorAll('.checkbox-group input');
const messageInput = document.getElementById('message');

const cakeBase = document.getElementById('cake-base');
const cakeText = document.getElementById('cake-text');

const toppingLayers = {
  chips: document.getElementById('layer-chips'),
  nuts: document.getElementById('layer-nuts'),
  fruits: document.getElementById('layer-fruits'),
  sprinkles: document.getElementById('layer-sprinkles')
};

const basePrices = {
  chocolate: 500,
  vanilla: 450,
  redvelvet: 550,
  butterscotch: 480
};

const toppingPrices = {
  chips: 40,
  nuts: 50,
  fruits: 60,
  sprinkles: 30
};

const cakeTypePrices = {
  egg: 0,
  eggless: 40
};

let cakeKg = 1;
const kgDisplay = document.getElementById("kg-value");
const minusBtn = document.getElementById("kg-minus");
const plusBtn = document.getElementById("kg-plus");

if(minusBtn && plusBtn){
  minusBtn.addEventListener("click",()=>{
    if(cakeKg > 0.5){
      cakeKg -= 0.5;
      kgDisplay.innerText = cakeKg;
      calculateCustomPrice();
    }
  });
  plusBtn.addEventListener("click",()=>{
    if(cakeKg < 5){
    cakeKg += 0.5;
    kgDisplay.innerText = cakeKg;
    calculateCustomPrice();
    }
  });
}

let currentCustomPrice = 0;

function calculateCustomPrice() {
  const flavour = flavourSelect.value;

  if (!basePrices[flavour]) {
    currentCustomPrice = 0;
    document.getElementById("custom-price").innerText = 0;
    return;
  }

  let total = basePrices[flavour] * cakeKg;

  // add egg / eggless price
  const cakeType = document.querySelector('input[name="cake-type"]:checked')?.value;
  if (cakeType) {
    total += cakeTypePrices[cakeType];
  }

  // add topping prices
  toppingInputs.forEach(input => {
    if (input.checked) {
      total += toppingPrices[input.value] || 0;
    }
  });

  currentCustomPrice = total;

  const priceDisplay = document.getElementById("custom-price");
  if (priceDisplay) priceDisplay.innerText = total;
}

function resetCakeVisuals() {

  // Hide base
  cakeBase.style.display = "none";
  cakeBase.src = "";

  // Hide all topping layers
  Object.values(toppingLayers).forEach(layer => {
    layer.style.display = "none";
    layer.src = "";
  });

  // Clear message text
  cakeText.innerText = "";
  messageInput.value = "";

  // Uncheck toppings
  toppingInputs.forEach(input => {
    input.checked = false;
  });
}

if (flavourSelect) {

  /* FLAVOUR CHANGE */
  flavourSelect.addEventListener('change', () => {
    const flavour = flavourSelect.value;
    const placeholder = document.getElementById("cake-placeholder");
    const addBtn = document.getElementById("add-custom-cake");

    if (!flavour) {
    resetCakeVisuals();
    placeholder.style.display = "flex";

    toppingInputs.forEach(input => {
      input.disabled = true;
    });

    messageInput.disabled = true;
    addBtn.disabled = true;

    calculateCustomPrice();
    return;
    }

    cakeBase.src = `images/custom/base/${flavour}.png`;
    cakeBase.style.display = "block";
    placeholder.style.display = "none";

    // ENABLE everything
    toppingInputs.forEach(input => {
    input.disabled = false;
    });

    messageInput.disabled = false;
    addBtn.disabled = false;
    calculateCustomPrice();
  });

  /* MULTI-TOPPING SUPPORT */
  toppingInputs.forEach(input => {
    input.addEventListener('change', () => {

      const topping = input.value;

      if (input.checked) {
        toppingLayers[topping].src =
          `images/custom/toppings/${topping}.png`;
        toppingLayers[topping].style.display = "block";
      } else {
        toppingLayers[topping].style.display = "none";
        toppingLayers[topping].src = "";
      }

      calculateCustomPrice();
    });
  });

  const cakeTypeInputs = document.querySelectorAll('input[name="cake-type"]');

  cakeTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
      calculateCustomPrice();
    });
  });

  /* MESSAGE */
  messageInput.addEventListener('input', () => {
    cakeText.innerText = messageInput.value;
  });

}

/* =========================
   ADD CUSTOM CAKE TO CART
========================= */

const addCustomBtn = document.getElementById('add-custom-cake');

if (addCustomBtn) {
  addCustomBtn.addEventListener('click', () => {

    const flavour = flavourSelect.value;
    if (!flavour) {
      alert("Please select a cake base.");
      return;
    }

    const selectedToppings = [];
    toppingInputs.forEach(input => {
      if (input.checked) selectedToppings.push(input.value);
    });

    const cakeType = document.querySelector('input[name="cake-type"]:checked')?.value || "egg";
    const message = messageInput.value || "No Message";

    const detailsString =
      `Flavour: ${flavour} | Type: ${cakeType} | Size: ${cakeKg}kg | Toppings: ${selectedToppings.join(", ") || "None"} | Message: "${message}"`;

    addToCart(
      "custom-" + Date.now(),
      "Custom Cake",
      currentCustomPrice,
      `images/custom/base/${flavour}.png`,
      detailsString
    );

    alert("Custom Cake added to cart!");
  });
}