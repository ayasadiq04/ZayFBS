const navUl = document.querySelector('nav ul');
const nav   = document.querySelector('nav');
 
const hamburger = document.createElement('button');
hamburger.innerHTML   = '☰';
hamburger.className   = 'hamburger';
hamburger.setAttribute('aria-label', 'Ouvrir le menu');
hamburger.setAttribute('aria-expanded', 'false');
nav.appendChild(hamburger);
 
hamburger.addEventListener('click', () => {
  const isOpen = navUl.classList.toggle('open');
  hamburger.innerHTML = isOpen ? '✕' : '☰';
  hamburger.setAttribute('aria-expanded', isOpen);
});
 
// Fermer le menu quand on clique sur un lien
navUl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navUl.classList.remove('open');
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
 
// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navUl.classList.remove('open');
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
 
 
/*  2. BOUTON HERO → scroll smooth */
const heroBtn = document.querySelector('.hero-btn');
if (heroBtn) {
  heroBtn.addEventListener('click', () => {
    document.querySelector('#fermes').scrollIntoView({ behavior: 'smooth' });
  });
}
 
 
/* 3. NAVBAR ACTIVE LINK AU SCROLL*/
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul li a');
 
function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }

  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + current);
  });
}
 
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();
 
 
/*  4. PANIER (compteur + notification)*/
let cartItems = JSON.parse(localStorage.getItem('zayfbs_cart') || '[]');
 
const cartIcon = document.querySelector('.cart');
const badge    = document.createElement('span');
badge.className   = 'cart-badge';
badge.textContent = cartItems.length || '0';
badge.style.display = cartItems.length > 0 ? 'flex' : 'none';
cartIcon.appendChild(badge);
 
function addToCart(productName, price) {
  cartItems.push({ name: productName, price: price, id: Date.now() });
  localStorage.setItem('zayfbs_cart', JSON.stringify(cartItems));
  updateBadge();
  showCartNotification(productName);
}
 
function updateBadge() {
  badge.textContent  = cartItems.length;
  badge.style.display = cartItems.length > 0 ? 'flex' : 'none';
  badge.classList.add('bounce');
  setTimeout(() => badge.classList.remove('bounce'), 400);
}
 
function showCartNotification(productName) {
  const notif       = document.createElement('div');
  notif.className   = 'cart-notif';
  notif.textContent = `✓ "${productName}" ajouté au panier`;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 400);
  }, 2500);
}
 
// Ouvrir un mini-panier au clic sur l'icône
cartIcon.style.cursor = 'pointer';
cartIcon.addEventListener('click', toggleMiniCart);
 
function toggleMiniCart() {
  let existing = document.querySelector('.mini-cart');
  if (existing) { existing.remove(); return; }
 
  const mini   = document.createElement('div');
  mini.className = 'mini-cart';
 
  if (cartItems.length === 0) {
    mini.innerHTML = '<p class="mini-cart-empty">Votre panier est vide.</p>';
  } else {
    const total = cartItems.reduce((sum, i) => sum + (i.price || 0), 0);
    mini.innerHTML = `
      <h4>Mon panier (${cartItems.length})</h4>
      <ul>
        ${cartItems.map(item => `
          <li>
            <span>${item.name}</span>
            <span>${item.price ? item.price + ' MAD' : ''}</span>
          </li>`).join('')}
      </ul>
      <div class="mini-cart-total">Total : <strong>${total} MAD</strong></div>
      <button class="mini-cart-clear" onclick="clearCart()">Vider le panier</button>
    `;
  }
 
  document.querySelector('header').appendChild(mini);
  setTimeout(() => mini.classList.add('open'), 10);
 
  document.addEventListener('click', function closeMini(e) {
    if (!mini.contains(e.target) && !cartIcon.contains(e.target)) {
      mini.remove();
      document.removeEventListener('click', closeMini);
    }
  });
}
 
function clearCart() {
  cartItems = [];
  localStorage.setItem('zayfbs_cart', JSON.stringify(cartItems));
  updateBadge();
  document.querySelector('.mini-cart')?.remove();
}
 
// Exposer globalement pour les boutons produits
window.addToCart   = addToCart;
window.clearCart   = clearCart;
 
 
/* 5. ANIMATION APPARITION AU SCROLL
   (Intersection Observer) */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
 
document.querySelectorAll('.card, .process-card, .cert-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
 
 
/* 6. NAVBAR TRANSPARENTE → OPAQUE AU SCROLL */
const header = document.querySelector('header');
 
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });
 
 
/*
   7. SMOOTH SCROLL POUR TOUS LES ANCRES */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
/* ZayFBS - products.js */

/* DATA — produits depuis le HTML*/
const PRODUCTS_DATA = [
  { id: 1, name: 'Zayto Premium Gold',    price: 120, image: 'images/Premium gold.png' },
  { id: 2, name: 'Zayto Bio Naturel',     price: 200, image: 'images/bio naturel.png' },
  { id: 3, name: 'Zayto Beldi Tradition', price: 100, image: 'images/beldi tradition.png' },
  { id: 4, name: 'Zayto Fresh Press',     price: 80,  image: 'images/fresh press.png' },
  { id: 5, name: 'Zayto Intense Flavor',  price: 90,  image: 'images/intense favor.png' },
];

/*  CART STATE */
let cart = JSON.parse(localStorage.getItem('zayfbs_cart_v2') || '[]');
// cart = [{ id, name, price, image, qty }, ...]

function saveCart() {
  localStorage.setItem('zayfbs_cart_v2', JSON.stringify(cart));
}

function getItem(id) {
  return cart.find(i => i.id === id);
}

function addItem(product) {
  const existing = getItem(product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  animateCartBtn(product.id);
  showToast(`✓ "${product.name}" ajouté au panier`);
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = getItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeItem(id);
  } else {
    saveCart();
    renderCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/* RENDER CART SIDEBAR */
function renderCart() {
  const sidebar   = document.querySelector('.cart-sidebar');
  const itemsZone = sidebar.querySelector('.cart-items-zone');
  const totalEl   = sidebar.querySelector('.total-price');

  itemsZone.innerHTML = '';

  if (cart.length === 0) {
    itemsZone.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
    totalEl.textContent = '0 DH';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price} DH</div>
        <div class="quantity-control">
          <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
          <span class="qty-value">${String(item.qty).padStart(2,'0')}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
        </div>
      </div>
      <button class="remove-item-btn" data-id="${item.id}" title="Supprimer">✕</button>
    `;
    itemsZone.appendChild(el);
  });

  totalEl.textContent = total + ' DH';

  // Events qty + remove
  itemsZone.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      changeQty(id, action === 'plus' ? 1 : -1);
    });
  });

  itemsZone.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
  });

  updateNavBadge();
}

/* INIT CART SIDEBAR HTML */
function initCartSidebar() {
  const sidebar = document.querySelector('.cart-sidebar');
  sidebar.innerHTML = `
    <h3 class="cart-title">Votre Panier</h3>
    <div class="cart-items-zone"></div>
    <div class="cart-total">
      <span>Total :</span>
      <span class="total-price">0 DH</span>
    </div>
    <button class="checkout-btn" id="checkout-btn">Commander</button>
    <button class="clear-cart-btn" id="clear-cart-btn">Vider le panier</button>
  `;

  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (confirm('Vider tout le panier ?')) clearCart();
  });

  renderCart();
}

/* BOUTONS "AJOUTER AU PANIER" sur les cards- */
function initAddToCartBtns() {
  document.querySelectorAll('.add-to-cart').forEach((btn, index) => {
    const product = PRODUCTS_DATA[index];
    if (!product) return;

    btn.setAttribute('data-id', product.id);

    btn.addEventListener('click', () => {
      addItem(product);
    });
  });
}

function animateCartBtn(productId) {
  const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
  if (!btn) return;
  btn.classList.add('added');
  btn.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = '<i class="fas fa-plus"></i> Ajouter au panier';
  }, 1500);
}

/*  BOUTONS EDIT / DELETE sur les cards */
function initActionBtns() {
  document.querySelectorAll('.product-card').forEach((card, index) => {
    const product  = PRODUCTS_DATA[index];
    const editBtn  = card.querySelectorAll('.action-btn')[0];
    const trashBtn = card.querySelectorAll('.action-btn')[1];

    if (editBtn)  editBtn.addEventListener('click',  () => openEditModal(card, product));
    if (trashBtn) trashBtn.addEventListener('click', () => deleteProductCard(card, product));
  });
}

/*  DELETE PRODUCT CARD */
function deleteProductCard(card, product) {
  if (!confirm(`Supprimer "${product.name}" ?`)) return;
  card.style.transition = 'opacity 0.3s, transform 0.3s';
  card.style.opacity    = '0';
  card.style.transform  = 'scale(0.9)';
  setTimeout(() => card.remove(), 300);
  removeItem(product.id);
  showToast(`🗑 "${product.name}" supprimé`);
}

/* EDIT MODAL */
function openEditModal(card, product) {
  const existing = document.getElementById('edit-modal');
  if (existing) existing.remove();

  const titleEl = card.querySelector('.product-title');
  const priceEl = card.querySelector('.price');
  const descEl  = card.querySelector('.product-description');

  const modal = document.createElement('div');
  modal.id    = 'edit-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Modifier le produit</h3>
        <label>Nom
          <input id="edit-name" type="text" value="${titleEl.textContent}">
        </label>
        <label>Prix (DH)
          <input id="edit-price" type="number" value="${parseInt(priceEl.textContent)}">
        </label>
        <label>Description
          <textarea id="edit-desc">${descEl.textContent.trim()}</textarea>
        </label>
        <div class="modal-actions">
          <button id="modal-save">Enregistrer</button>
          <button id="modal-cancel">Annuler</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('modal-cancel').addEventListener('click', () => modal.remove());
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) modal.remove();
  });

  document.getElementById('modal-save').addEventListener('click', () => {
    const newName  = document.getElementById('edit-name').value.trim();
    const newPrice = parseInt(document.getElementById('edit-price').value);
    const newDesc  = document.getElementById('edit-desc').value.trim();

    if (!newName || isNaN(newPrice) || newPrice <= 0) {
      alert('Merci de remplir tous les champs correctement.');
      return;
    }

    titleEl.textContent = newName;
    priceEl.textContent = newPrice + ' DH';
    descEl.textContent  = newDesc;

    // Mettre à jour PRODUCTS_DATA
    product.name  = newName;
    product.price = newPrice;

    // Mettre à jour dans le panier si présent
    const inCart = getItem(product.id);
    if (inCart) {
      inCart.name  = newName;
      inCart.price = newPrice;
      saveCart();
      renderCart();
    }

    modal.remove();
    showToast(`✏️ "${newName}" modifié avec succès`);
  });
}

/*  AJOUTER UN NOUVEAU PRODUIT */
function initAddProductBtn() {
  document.querySelector('.add-product-btn').addEventListener('click', openAddModal);
}

function openAddModal() {
  const existing = document.getElementById('add-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id    = 'add-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Nouveau produit</h3>
        <label>Nom
          <input id="new-name" type="text" placeholder="Nom du produit">
        </label>
        <label>Prix (DH)
          <input id="new-price" type="number" placeholder="Prix">
        </label>
        <label>Description
          <textarea id="new-desc" placeholder="Description du produit"></textarea>
        </label>
        <label>Image (URL ou chemin)
          <input id="new-img" type="text" placeholder="images/monfichier.png">
        </label>
        <div class="modal-actions">
          <button id="modal-add-save">Ajouter</button>
          <button id="modal-add-cancel">Annuler</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('modal-add-cancel').addEventListener('click', () => modal.remove());
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) modal.remove();
  });

  document.getElementById('modal-add-save').addEventListener('click', () => {
    const name  = document.getElementById('new-name').value.trim();
    const price = parseInt(document.getElementById('new-price').value);
    const desc  = document.getElementById('new-desc').value.trim();
    const img   = document.getElementById('new-img').value.trim() || 'images/Premium gold.png';

    if (!name || isNaN(price) || price <= 0 || !desc) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const newId = Date.now();
    const newProduct = { id: newId, name, price, image: img };
    PRODUCTS_DATA.push(newProduct);

    const grid = document.querySelector('.products-grid');
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity   = '0';
    card.style.transform = 'scale(0.9)';
    card.innerHTML = `
      <img src="${img}" alt="${name}" class="product-image">
      <div class="product-content">
        <h3 class="product-title">${name}</h3>
        <p class="product-description">${desc}</p>
        <div class="product-footer">
          <span class="price">${price} DH</span>
          <button class="add-to-cart" data-id="${newId}">
            <i class="fas fa-plus"></i> Ajouter au panier
          </button>
          <div class="product-actions">
            <button class="action-btn"><i class="fas fa-edit"></i></button>
            <button class="action-btn"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Animate in
    setTimeout(() => {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity    = '1';
      card.style.transform  = 'scale(1)';
    }, 10);

    // Bind events on new card
    card.querySelector('.add-to-cart').addEventListener('click', () => addItem(newProduct));
    card.querySelectorAll('.action-btn')[0].addEventListener('click', () => openEditModal(card, newProduct));
    card.querySelectorAll('.action-btn')[1].addEventListener('click', () => deleteProductCard(card, newProduct));

    modal.remove();
    showToast(`✓ "${name}" ajouté !`);
  });
}

/*  CHECKOU */
function handleCheckout() {
  if (cart.length === 0) {
    showToast('⚠️ Votre panier est vide !');
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = cart.map(i => `• ${i.name} x${i.qty} = ${i.price * i.qty} DH`).join('\n');
  alert(`Commande confirmée !\n\n${lines}\n\nTotal : ${total} DH\n\nMerci pour votre achat !`);
  clearCart();
}

/*  NAV BADGE (icône panier header) */
function updateNavBadge() {
  let badge = document.querySelector('.nav-cart-badge');
  const cartDiv = document.querySelector('header .cart');
  if (!cartDiv) return;

  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'nav-cart-badge';
    cartDiv.style.position = 'relative';
    cartDiv.appendChild(badge);
  }

  const total = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent  = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

/* TOAST NOTIFICATION*/
function showToast(message) {
  const toast = document.createElement('div');
  toast.className   = 'zayfbs-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* HAMBURGER MENU (mobile) */
function initHamburger() {
  const navUl = document.querySelector('nav ul');
  const nav   = document.querySelector('nav');
  const btn   = document.createElement('button');
  btn.innerHTML = '☰';
  btn.className = 'hamburger';
  nav.appendChild(btn);

  btn.addEventListener('click', () => {
    const open = navUl.classList.toggle('open');
    btn.innerHTML = open ? '✕' : '☰';
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navUl.classList.remove('open');
      btn.innerHTML = '☰';
    }
  });
}

/*CSS DYNAMIQUE (modal + toast + badge) */
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Toast */
    .zayfbs-toast {
      position: fixed; bottom: 28px; right: 28px;
      background: #0d2818; color: #c4d4a8;
      padding: 12px 20px; border-radius: 10px;
      font-size: 13px; border-left: 4px solid #c4d4a8;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      opacity: 0; transform: translateY(12px);
      transition: opacity .3s, transform .3s;
      z-index: 9999; max-width: 280px;
    }
    .zayfbs-toast.show { opacity: 1; transform: translateY(0); }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 9998;
    }
    .modal-box {
      background: #f5f5dc; border-radius: 12px;
      padding: 28px; width: 360px; max-width: 90vw;
      display: flex; flex-direction: column; gap: 14px;
    }
    .modal-box h3 { color: #0d2818; font-size: 16px; }
    .modal-box label {
      display: flex; flex-direction: column; gap: 5px;
      font-size: 12px; color: #444; font-weight: 600;
    }
    .modal-box input,
    .modal-box textarea {
      border: 1px solid #aaa; border-radius: 6px;
      padding: 8px 10px; font-size: 13px;
      font-family: inherit; background: #fff;
      color: #0d2818; outline: none;
    }
    .modal-box textarea { min-height: 80px; resize: vertical; }
    .modal-box input:focus,
    .modal-box textarea:focus { border-color: #0d2818; }
    .modal-actions { display: flex; gap: 10px; }
    .modal-actions button {
      flex: 1; padding: 10px; border-radius: 8px;
      border: none; cursor: pointer; font-size: 13px; font-weight: 600;
      transition: background .2s;
    }
    #modal-save, #modal-add-save {
      background: #0d2818; color: #c4d4a8;
    }
    #modal-save:hover, #modal-add-save:hover { background: #1a4a30; }
    #modal-cancel, #modal-add-cancel {
      background: #ddd; color: #333;
    }
    #modal-cancel:hover, #modal-add-cancel:hover { background: #ccc; }

    /* Add-to-cart button state */
    .add-to-cart.added { background: #1a6e3a !important; }

    /* Remove item btn in cart */
    .remove-item-btn {
      background: none; border: none;
      color: #c4d4a8; cursor: pointer;
      font-size: 14px; opacity: 0.5;
      transition: opacity .2s; align-self: flex-start;
    }
    .remove-item-btn:hover { opacity: 1; }

    /* Clear cart btn */
    .clear-cart-btn {
      width: 100%; background: transparent;
      border: 1px solid #1a4a30; color: #c4d4a8;
      padding: 8px; border-radius: 6px;
      font-size: 12px; cursor: pointer;
      margin-top: 8px; transition: background .2s;
    }
    .clear-cart-btn:hover { background: #1a4a30; }

    /* Empty cart msg */
    .cart-empty {
      text-align: center; font-size: 13px;
      color: #c4d4a8; opacity: 0.6;
      padding: 20px 0;
    }

    /* Nav cart badge */
    .nav-cart-badge {
      position: absolute; top: -5px; right: -5px;
      background: #c4d4a8; color: #0d2818;
      border-radius: 50%; width: 17px; height: 17px;
      display: none; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700;
    }

    /* Hamburger */
    .hamburger {
      display: none; background: none; border: none;
      color: white; font-size: 22px; cursor: pointer;
    }
    @media (max-width: 768px) {
      .hamburger { display: block; }
      nav ul {
        display: none; flex-direction: column;
        position: absolute; top: 56px; left: 0; right: 0;
        background: #0f3d1c; padding: 10px 0; z-index: 999;
        margin-left: 0 !important;
      }
      nav ul.open { display: flex; }
      nav ul li { padding: 10px 5%; margin: 0; }
    }
  `;
  document.head.appendChild(style);
}

/*INIT*/
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  initCartSidebar();
  initAddToCartBtns();
  initActionBtns();
  initAddProductBtn();
  initHamburger();
  updateNavBadge();
});