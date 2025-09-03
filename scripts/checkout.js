import { cart } from "../data/cart.js";
import { saveCart } from "../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const today = dayjs();

// Render cart initially
renderCart();
updateOrderSummary();

// Default delivery date based on selected radio
const defaultDelivery = document.querySelector('input[name="delivery"]:checked')?.value || '0';
updateDeliveryDate(defaultDelivery);


// Render Cart Function

function renderCart() {
  let checkoutHtml = '<h2>Shopping Cart</h2>';
  const validCart = cart.filter(item => item && item.id);

  if (validCart.length === 0) {
    checkoutHtml += '<p>Your cart is empty.</p>';
  } else {
    validCart.forEach(item => {
      checkoutHtml += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}">
          <div class="item-details">
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>
            <div class="quantity-wrapper">
              <input type="number" class="quantity-input" min="1" max="50" value="${item.quantity || 1}">
              <button class="confirm-qty">✔</button>
            </div>
            <p class="item-total">Total: ₹${item.price * (item.quantity || 1)}</p>
            <button class="delete-item">Delete</button>
          </div>
        </div>`;
    });
  }

  document.querySelector(".cart-items").innerHTML = checkoutHtml;

  // Quantity confirm buttons
  document.querySelectorAll(".confirm-qty").forEach(button => {
    button.addEventListener("click", (e) => {
      const cartItemDiv = e.target.closest(".cart-item");
      const id = cartItemDiv.dataset.id;
      const input = cartItemDiv.querySelector(".quantity-input");
      let newQ = parseInt(input.value);

      if (newQ < 1) newQ = 1;
      if (newQ > 50) newQ = 50;
      input.value = newQ;

      const itemTotal = cartItemDiv.querySelector(".item-total");
      const cartItem = cart.find(it => it.id == id);
      cartItem.quantity = newQ;
      itemTotal.textContent = `Total: ₹${cartItem.price * cartItem.quantity}`;

      saveCart();
      updateOrderSummary();
      updateDeliveryDate(document.querySelector('input[name="delivery"]:checked')?.value || '0');
    });
  });

  // Delete buttons
  document.querySelectorAll(".delete-item").forEach(button => {
    button.addEventListener('click', (e) => {
      const cartItemDiv = e.target.closest(".cart-item");
      const id = cartItemDiv.dataset.id;

      const updatedCart = cart.filter(it => it.id !== id);
      cart.length = 0;
      cart.push(...updatedCart);

      saveCart();
      cartItemDiv.remove();
      updateOrderSummary();
      updateDeliveryDate(document.querySelector('input[name="delivery"]:checked')?.value || '0');

      if (cart.length === 0) {
        document.querySelector(".cart-items").innerHTML = "<h2>Shopping Cart</h2><p>Your cart is empty.</p>";
        disableDeliveryOptions(true);
      }
    });
  });

  disableDeliveryOptions(validCart.length === 0);
}


// Update Order Summary

function updateOrderSummary() {
  const validCart = cart.filter(item => item && item.id);

  if (validCart.length === 0) {
    document.querySelector('.summary-details').innerHTML = `
      <p>Subtotal: ₹0.00</p>
      <p>Tax (5%): ₹0.00</p>
      <p>Delivery: ₹0.00</p>
      <p><strong>Total: ₹0.00</strong></p>`;
    return;
  }

  let subTotal = 0;
  validCart.forEach(item => subTotal += item.price * (item.quantity || 1));
  let tax = subTotal * 0.05;
  let deliveryTotal = parseFloat(document.querySelector('input[name="delivery"]:checked')?.value || 0);
  let grandTotal = subTotal + tax + deliveryTotal;

  document.querySelector('.summary-details').innerHTML = `
    <p>Subtotal: ₹${subTotal.toFixed(2)}</p>
    <p>Tax (5%): ₹${tax.toFixed(2)}</p>
    <p>Delivery: ₹${deliveryTotal.toFixed(2)}</p>
    <p><strong>Total: ₹${grandTotal.toFixed(2)}</strong></p>`;
}


// Update Delivery Date

function updateDeliveryDate(value) {
  const validCart = cart.filter(item => item && item.id);

  if (validCart.length === 0) {
    document.querySelector('.DelDate').innerHTML = "Delivery Date : -- -- --";
    return;
  }

  let updateDays = 7; // Standard
  if (value === '50') updateDays = 3; // Express
  else if (value === '100') updateDays = 1; // Premium

  const day = today.add(updateDays, 'day').format('dddd, MMMM D');
  document.querySelector('.DelDate').innerHTML = `Delivery Date : ${day}`;
}

// Radio button change listener

document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (cart.length === 0) return; 
    updateOrderSummary();
    updateDeliveryDate(e.target.value);
  });
});


// Disable / Enable radio buttons

function disableDeliveryOptions(disable) {
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.disabled = disable;
  });
  if (disable) {
    document.querySelector('.DelDate').innerHTML = "Delivery Date : -- -- --";
  }
}
