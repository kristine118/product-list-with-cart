
let listProductHtml = document.querySelector('.products');
let listCartHtml = document.querySelector('.cart-items-wrapper');
let cartCounter = document.querySelector('#cart-counter');
let cartSummary = document.querySelector('.cart-summary');
let listProducts = [];
let carts = [];


async function getData() {
    // localStorage.removeItem('cart');

    const response = await fetch("data.json");
    const data = await response.json();
    listProducts = data;
    getProduct();

    if(localStorage.getItem('cart')){
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartHtml();

        carts.forEach(item => {
            updateProductBtn(item.id);
        });
    }

}

//PRODUCTS IN HTML
function getProduct() {
    let html = '';

    listProducts.forEach(item => {
        html += `
        <div class="col-sm-3">
              <div class="product_container">
            <div class="image-wrapper">
                <img src="${item.image.desktop}" alt="">
                <div class="cart-control" data-id="${item.id}">
                    <button class="add-cart"
                      data-id="${item.id}"
                      data-name="${item.name}"
                      data-price="${item.price}">
                        <span>🛒</span> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product_info">
                  <span>${item.category}</span>
                  <h2>${item.name}</h2>
                  <p>$ ${item.price}</p>
            </div>
          </div>
        </div>
        `;
    });

    listProductHtml.innerHTML = html;

}
getData();

//ADD CART BUTTON
listProductHtml.addEventListener('click', event => {
    const btn = event.target.closest('.add-cart');

    if (!btn) return;

    const product_id = btn.dataset.id;
    const product_name = btn.dataset.name;
    const product_price = btn.dataset.price;

    // console.log(product_id, product_name, product_price);

    addToCart(product_id, product_name, product_price);
});

//CART LISTS
function addToCart(product_id) {
    let positionProducts = carts.findIndex(item => item.id == product_id);
    const product = listProducts.find(p => p.id == product_id);
    if (positionProducts === -1) {
        carts.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    } else {
        carts[positionProducts].quantity++;
    }
    // console.log(carts);

    addCartHtml();
    addCartToMemory();
    updateProductBtn(product_id);
}

// CART MEMORY
function addCartToMemory(){
    localStorage.setItem('cart', JSON.stringify(carts));
}

function addCartHtml() {
    listCartHtml.innerHTML = '';
    cartSummary.innerHTML = '';

    let totalPrice = 0;
    let quantity = 0;

    const emptyCartImg = document.querySelector('.display-img');

    if (carts.length > 0) {
        emptyCartImg.style.display = 'none';
    } else {
        emptyCartImg.style.display = 'block';
    }


    carts.forEach((item) => {
        let newItem = document.createElement("div");
        newItem.classList.add('cart-items');
        newItem.dataset.id = item.id;

        let positionProduct = listProducts.findIndex(
            product => product.id == item.id
        )

        const total = item.price * item.quantity;

        totalPrice += total;
        quantity += item.quantity;

        newItem.innerHTML = `
        
                <h2 class=item-name>${item.name}</h2>

                <div class="cart-info">
                    <span class="quantity">X ${item.quantity}</span>
                    <span class="price">@ $${item.price}</span>
                    <span class="itemTotal">$${total}</span>

                    <svg class="remove-item"
                    data-id="${item.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z"/></svg>

                </div>
        `;
        listCartHtml.appendChild(newItem);

    });

    cartCounter.textContent = `Your Cart (${quantity})`;


    if (carts.length > 0) {
        cartSummary.innerHTML = `
                  <div class="cart-total-price">
                    <span>Order Total</span>
                    <span class="total-price">$${totalPrice}</span>
                </div>

                <button type="submit" class="confirmBtn">Confirm Order</button>
            `;
    }


}

//REMOVE BUTTON
listCartHtml.addEventListener('click', (item) => {
    const btn = item.target.closest('.remove-item');
    if (!btn) return;

    const id = btn.dataset.id;

    carts = carts.filter(item => item.id != id);

    addCartToMemory();
    addCartHtml();
    updateProductBtn(id);
});


// PLUS AND MINUS STYLE UPDATE
function updateProductBtn(product_id) {
    const cartBtn = document.querySelector(`.cart-control[data-id='${product_id}']`);

    if (!cartBtn) return;
    const cartItem = carts.find(item => item.id == product_id);

    if (!cartItem) {
        const product = listProducts.find(p => p.id == product_id);

        cartBtn.innerHTML = `
        <button class="add-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}">
            <span>🛒</span> Add to Cart
        </button>
    `;
        return;
    }
    cartBtn.innerHTML = `
        <div class="quantity-control" data-id="${product_id}">
            <button class="minus">-</button>
            <span class="quantity">${cartItem.quantity}</span>
            <button class="plus">+</button>
        </div>
    `;

}

//CHANGE QUANTITY BUTTONS
listProductHtml.addEventListener('click', function (event) {
    const plusBtn = event.target.closest('.plus');
    const minusBtn = event.target.closest('.minus');

    if (!plusBtn && !minusBtn) return;

    const parent = event.target.closest('.quantity-control');
    const id = parent.dataset.id;

    if (plusBtn) {
        changeQuantity(id, 'plus');
    }

    if (minusBtn) {
        changeQuantity(id, 'minus');
    }
});

function changeQuantity(product_id, type) {

    let positionCartItem = carts.findIndex(
        value => value.id == product_id
    );

    if (positionCartItem >= 0) {

        if (type === 'plus') {
            carts[positionCartItem].quantity++;
        } else {
            let newQuantity = carts[positionCartItem].quantity - 1;

            if (newQuantity > 0) {
                carts[positionCartItem].quantity = newQuantity;
            } else {
                carts.splice(positionCartItem, 1);
            }
        }
    }

    addCartToMemory();
    addCartHtml();
    updateProductBtn(product_id);

}

//CONFIRM BUTTON
document.addEventListener('click', function (item){
    const confirmBtn = item.target.closest('.confirmBtn');
    if (!confirmBtn) return;

    showOrder();
});
function showOrder() {

    const order = document.querySelector('#order');
    const totalItemPrice = document.querySelector('#total-item-price');
    const orderContainer = document.querySelector('.order-container');

    let totalPrice = 0;
    let itemsHTML = '';

    carts.forEach((item) => {

        const product = listProducts.find(p => p.id == item.id);

        const total = item.price * item.quantity;
        totalPrice += total;

        itemsHTML += `
        <div class="order-items-wrapper">
            <div class="order-img">
                <img src="${product.image.thumbnail}" alt="${item.name}">
            </div>

            <div class="order-items">
                <span class="order-name">${item.name}</span>
                <span class="itemTotal">$${total}</span>

                <div class="order-info">
                    <span class="quantity">${item.quantity}x</span>
                    <span class="price">@ $${item.price}</span>
                </div>
            </div>
        </div>`;
    });

    orderContainer.innerHTML = itemsHTML;

    totalItemPrice.textContent = `$${totalPrice}`;

    order.classList.add('active');

}

//START NEW ORDER BUTTON
document.addEventListener('click', function (item){
    const startBtn = item.target.closest('.start-new');

    if (!startBtn) return;
    startNewOrder();
})
function startNewOrder() {
    const order = document.querySelector('#order');

    carts = [];

    localStorage.removeItem('cart');
    order.classList.remove('active');
    document.querySelector('.order-container').innerHTML = '';
    document.querySelector('#total-item-price').textContent = '$0';

    addCartHtml();

    listProducts.forEach(product => {
        updateProductBtn(product.id);
    });
}

// function updateCart() {
//
//
//     let totalCount = 0;
//
//     const cartCounter = document.querySelector('#cart-counter');
//     if(cartCounter){
//         cartCounter.textContent = `Your Cart (${totalCount})` ;
//     }
//
//     updateProductBtn();
//     addCartHtml();
//
//
// }

