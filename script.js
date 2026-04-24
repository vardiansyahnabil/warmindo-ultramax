const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwci2Hh78RWSNKDwYArrNoA7Ro7FEfOTI6nGDa73bm6bJte9hKuYxSIQllddJ4N3NIJ/exec";

let cart = {};

function scrollMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function tambah(nama, harga) {
  if (!cart[nama]) cart[nama] = { qty: 0, harga };
  cart[nama].qty++;
  render();
}

function kurang(nama) {
  if (cart[nama]) {
    cart[nama].qty--;
    if (cart[nama].qty <= 0) delete cart[nama];
  }
  render();
}

function render() {
  const listEl = document.getElementById('list');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');
  const floatCart = document.getElementById('floatCart');
  const floatBadge = document.getElementById('floatBadge');

  listEl.innerHTML = '';
  let subtotal = 0;
  let totalQty = 0;

  const keys = Object.keys(cart);

  // Update floating cart
  keys.forEach(item => { totalQty += cart[item].qty; });
  if (totalQty > 0) {
    floatCart.classList.add('visible');
    floatBadge.textContent = totalQty + ' item';
  } else {
    floatCart.classList.remove('visible');
  }

  if (keys.length === 0) {
    cartEmpty.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartContent.style.display = 'block';

  keys.forEach(item => {
    const harga = cart[item].harga;
    const qty = cart[item].qty;
    subtotal += harga * qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <div class="cart-item-name">${item}</div>
        <div class="cart-item-qty">x${qty} &nbsp;·&nbsp; Rp ${(harga * qty).toLocaleString('id-ID')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="cart-item-price">Rp ${(harga * qty).toLocaleString('id-ID')}</span>
        <button class="cart-item-remove" onclick="hapus('${item}')">✕</button>
      </div>
    `;
    listEl.appendChild(div);
  });

  const layanan = 1000;
  subtotalEl.textContent = subtotal.toLocaleString('id-ID');
  totalEl.textContent = (subtotal + layanan).toLocaleString('id-ID');
}

function scrollToCart() {
  document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

function hapus(nama) {
  delete cart[nama];
  render();
}

function checkout() {
  let items = [];
  let subtotal = 0;

  for (let item in cart) {
    items.push(item + " x" + cart[item].qty);
    subtotal += cart[item].qty * cart[item].harga;
  }

  if (items.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked').value;
  const total = subtotal + 1000;

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.join(", "),
      total: "Rp " + total.toLocaleString('id-ID'),
      pembayaran: payment
    })
  }).catch(err => console.log("Gagal kirim ke spreadsheet:", err));

  alert(`Pesanan berhasil dikirim!\nMetode: ${payment}\nTotal: Rp ${total.toLocaleString('id-ID')}`);
  cart = {};
  render();
}

function toggleNav() {
  const nav = document.getElementById('navMenu');
  const burger = document.getElementById('hamburger');
  nav.classList.toggle('open');
  burger.classList.toggle('active');
}

function closeNav() {
  document.getElementById('navMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('active');
}
