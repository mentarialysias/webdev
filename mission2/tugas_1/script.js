const items = [
    { image: 'assets/nasgor.jpe', name: 'Nasi Goreng', price: 15000 },
    { image: 'assets/migor.jpg', name: 'Mie Goreng', price: 10000 },
    { image: 'assets/miku.jpg', name: 'Mie Rebus', price: 10000 },
    { image: 'assets/seblak.jpg', name: 'Seblak', price: 15000 },
    { image: 'assets/esjer.jpg', name: 'Es Jeruk', price: 7000 },
    { image: 'assets/telem.jpg', name: 'Teh Lemon', price: 9000 },
    { image: 'assets/teh.jpg', name: 'Es Teh', price: 5000 }
];

const cart = [];

const itemsContainer = document.querySelector('.items');
const cartContainer = document.querySelector('.cart');
const totalContainer = document.querySelector('.total');

function updateCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    for (const item of cart) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <div class="price-n-qty">
                    <span class="item-price">Rp ${item.price.toLocaleString()}</span>
                    <span> x </span>
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <button class="remove-item">Remove</button>
            </div>
            <div class="total-per-item">
                <span class="item-total">Rp ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
        cartContainer.appendChild(itemElement);

        total += item.price * item.quantity;

        const removeButton = itemElement.querySelector('.remove-item');
        removeButton.addEventListener('click', () => {
            const shouldRemove = window.confirm(`Apakah Anda yakin ingin menghapus "${item.name}" dari keranjang?`);
        
            if (shouldRemove) {
                const index = cart.indexOf(item);
                if (index !== -1) {
                    cart.splice(index, 1);
                    updateCart();
                }
            }
        });
        


    }

    totalContainer.innerHTML = `
        <pre>Total Pembelian                  Rp ${total.toLocaleString()}
        <pre>Pajak 11%                  Rp ${(total * 0.11).toLocaleString()}
        <pre>Total Bayar                  Rp ${(total * 1.11).toLocaleString()}
        `;
}

for (const item of items) {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.innerHTML = `
        <div class="section3">
        <img src="${item.image}">
        <div class="keterangan">
          <h2 class="item-name">${item.name}</h2>
          <span class="item-price">Rp ${item.price.toLocaleString()}</span>
        </div>
        <div class="tombol">
          <div class="counter">
            <button class="minus">-</button>
            <span class="count">0</span>
            <button class="plus">+</button>
          </div>
          <button class="masukKeranjang">Add to Cart</button>
        </div>
      </div>
    `;

    const quantityInput = itemElement.querySelector('.count');
    const plusButton = itemElement.querySelector('.plus');
    const minusButton = itemElement.querySelector('.minus');
    const masukKeranjangButton = itemElement.querySelector('.masukKeranjang');

    plusButton.addEventListener('click', () => {
        const currentCount = parseInt(quantityInput.textContent);
        quantityInput.textContent = currentCount + 1;
    });

    minusButton.addEventListener('click', () => {
        const currentCount = parseInt(quantityInput.textContent);
        if (currentCount > 0) {
            quantityInput.textContent = currentCount - 1;
        }
    });

    masukKeranjangButton.addEventListener('click', () => {
        const currentCount = parseInt(quantityInput.textContent);

        const existingCartItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingCartItem) {
            existingCartItem.quantity = currentCount;
        } else {
            cart.push({
                image: item.image,
                name: item.name,
                price: item.price,
                quantity: currentCount
            });
        }

        updateCart();

        masukKeranjangButton.disabled = true;
        masukKeranjangButton.textContent = 'Added';

        setTimeout(() => {
            masukKeranjangButton.disabled = false;
            masukKeranjangButton.textContent = 'Add to Cart';
        }, 1000);
    });

    itemsContainer.appendChild(itemElement);
}

updateCart();

const printReceiptButton = document.querySelector('.print-receipt');

printReceiptButton.addEventListener('click', () => {
    const receiptWindow = window.open('', 'Receipt', 'width=300,height=400');
    
    if (receiptWindow) {
        const receiptContent = generateReceiptContent();
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
    } else {
        alert('Mohon izinkan pop-up untuk mencetak struk.');
    }
});

function generateReceiptContent() {
    let receiptContent = `
        <html>
        <head>
            <title>Struk Belanja</title>
            <style>
                /* Gaya CSS untuk tampilan struk */
                /* Anda dapat menyesuaikan gaya sesuai keinginan Anda */
                body {
                    font-family: Arial, sans-serif;
                }
                .receipt {
                    text-align: center;
                }
                .receipt-title {
                    font-size: 20px;
                    font-weight: bold;
                }
                .receipt-details {
                    margin-top: 10px;
                    margin-bottom: 20px;
                }
                .receipt-item {
                    text-align: left;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="receipt-title">Struk Belanja</div>
                <div class="receipt-details">
    `;

    for (const item of cart) {
        receiptContent += `
            <div class="receipt-item">
                ${item.name} x ${item.quantity}: Rp ${(item.price * item.quantity).toLocaleString()}
            </div>
        `;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = total * 0.11;
    const totalPayment = total + tax;

    receiptContent += `
                
                </div>
                <div class="receipt-item">
                    Total Belanja: Rp ${total.toLocaleString()}
                </div>
                <div class="receipt-item">
                    Pajak 11%: Rp ${tax.toLocaleString()}
                </div>
                <div class="receipt-item">
                    Total Bayar: Rp ${totalPayment.toLocaleString()}
                </div>
            </div>
        </body>
        </html>
    `;

    return receiptContent;
}
