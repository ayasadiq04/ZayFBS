//  DATA 
let products = [
  { id: 1, name: "Zayto Premium Gold",    price: 120, image: "images/Premium gold.png",   description: "Une huile d'olive extra vierge de qualité supérieure, extraite à froid à partir des meilleures olives de Fquih Ben Saleh. Son goût fruité et équilibré accompagne parfaitement vos plats traditionnels et modernes." },
  { id: 2, name: "Zayto Bio Naturel",     price: 200, image: "images/bio naturel.png",     description: " Issue de l'agriculture biologique, cette huile d'olive est 100% naturelle, sans additifs ni produits chimiques. Idéale pour une alimentation saine et équilibrée." },
  { id: 3, name: "Zayto Beldi Tradition", price: 100, image: "images/beldi tradition.png", description: "Une huile d'olive authentique produite selon des méthodes artisanales transmises de génération en génération. Elle offre un goût riche et intense typique du terroir marocain." },
  { id: 4, name: "Zayto Fresh Press",     price: 80,  image: "images/fresh press.png",     description: " Pressée à froid immédiatement après la récolte, cette huile conserve toutes ses propriétés nutritionnelles et son arôme naturel pour une fraîcheur incomparable" },
  { id: 5, name: "Zayto Intense Flavor",  price: 90,  image: "images/intense favor.png",   description: " Une huile au caractère fort et légèrement piquant, idéale pour les amateurs de saveurs puissantes et authentiques." },
];

let cart = [];     
let nextId = 6;
let editingId = null;

//  RENDER
function renderProducts() {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='images/Premium gold.png'">
      <div class="product-content">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-footer">
          <span class="price">${p.price} DH</span>
          <button class="add-to-cart" onclick="addToCart(${p.id})">
            <i class="fas fa-plus"></i> Ajouter au panier
          </button>
          <div class="product-actions">
            <button class="action-btn" onclick="openEdit(${p.id})"><i class="fas fa-edit"></i></button>
            <button class="action-btn" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`).join("");
}

function renderCart() {
  const sidebar = document.querySelector(".cart-sidebar");
  if (!sidebar) return;

  const total = cart.reduce((s, i) => {
    const p = products.find(pr => pr.id === i.productId);
    return s + (p ? p.price * i.quantity : 0);
  }, 0);

  const itemsHTML = cart.length === 0
    ? `<p style="text-align:center;opacity:.6;padding:20px 0">Votre panier est vide.</p>`
    : cart.map(item => {
        const p = products.find(pr => pr.id === item.productId);
        if (!p) return "";
        return `
          <div class="cart-item">
            <img src="${p.image}" alt="${p.name}" class="cart-item-image" onerror="this.src='images/Premium gold.png'">
            <div class="cart-item-details">
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-price">${p.price} DH</div>
              <div class="quantity-control">
                <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                <span class="qty-value">${String(item.quantity).padStart(2,"0")}</span>
                <button class="qty-btn" onclick="changeQty(${p.id}, +1)">+</button>
              </div>
            </div>
          </div>`;
      }).join("");

  sidebar.innerHTML = `
    <h3 class="cart-title">Votre Panier</h3>
    ${itemsHTML}
    ${cart.length > 0 ? `
      <div class="cart-total">
        <span>Total :</span>
        <span class="total-price">${total} DH</span>
      </div>
      <button class="checkout-btn" onclick="checkout()">Commander</button>` : ""}
  `;
}

// CART ACTIONS
function addToCart(id) {
  const item = cart.find(i => i.productId === id);
  item ? item.quantity++ : cart.push({ productId: id, quantity: 1 });
  renderCart();
  toast("Produit ajouté au panier ✓");
}

function changeQty(id, delta) {
  const item = cart.find(i => i.productId === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.productId !== id);
  renderCart();
}

function checkout() {
  const total = cart.reduce((s, i) => {
    const p = products.find(pr => pr.id === i.productId);
    return s + (p ? p.price * i.quantity : 0);
  }, 0);
  alert(`Merci pour votre commande ! 🎉\nTotal : ${total} DH`);
  cart = [];
  renderCart();
}

//  PRODUCT ACTIONS 
function deleteProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!p || !confirm(`Supprimer "${p.name}" ?`)) return;
  products = products.filter(pr => pr.id !== id);
  cart = cart.filter(i => i.productId !== id);
  renderProducts();
  renderCart();
  toast("Produit supprimé.");
}

function openAdd() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Ajouter un produit";
  ["mName","mPrice","mImage","mDesc"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("modal").classList.add("open");
}

function openEdit(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("modalTitle").textContent = "Modifier le produit";
  document.getElementById("mName").value  = p.name;
  document.getElementById("mPrice").value = p.price;
  document.getElementById("mImage").value = p.image;
  document.getElementById("mDesc").value  = p.description;
  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

function saveProduct() {
  const name  = document.getElementById("mName").value.trim();
  const price = parseFloat(document.getElementById("mPrice").value);
  const image = document.getElementById("mImage").value.trim();
  const desc  = document.getElementById("mDesc").value.trim();

  if (!name || isNaN(price) || price <= 0 || !desc) {
    toast("Remplissez tous les champs correctement.", "error");
    return;
  }

  if (editingId) {
    const p = products.find(pr => pr.id === editingId);
    Object.assign(p, { name, price, image: image || p.image, description: desc });
    toast("Produit modifié ✓");
  } else {
    products.push({ id: nextId++, name, price, image: image || "images/Premium gold.png", description: desc });
    toast("Produit ajouté ✓");
  }

  closeModal();
  renderProducts();
}

// TOAST 
function toast(msg, type = "success") {
  document.getElementById("toast")?.remove();
  const el = document.createElement("div");
  el.id = "toast";
  el.textContent = msg;
  el.style.cssText = `
    position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(10px);
    background:${type === "error" ? "#7a1a1a" : "#0d2818"}; color:#c4d4a8;
    padding:11px 24px; border-radius:8px; font-size:13px;
    z-index:9999; opacity:0; transition:all .3s; pointer-events:none;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = "1"; el.style.transform = "translateX(-50%) translateY(0)";
  }));
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 400); }, 2500);
}

// ─── INIT
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  document.querySelector(".add-product-btn")?.addEventListener("click", openAdd);
  document.querySelector(".hero-btn")?.addEventListener("click", () => location.href = "products.html");
  document.querySelector(".cart")?.addEventListener("click", () => {
    if (!location.pathname.includes("products")) location.href = "products.html";
  });

  document.getElementById("modal")?.addEventListener("click", e => {
    if (e.target.id === "modal") closeModal();
  });
});