// SPA minima con rutas por hash. Los atributos data-test replican los de saucedemo.com
// para que los Tasks/Interactions de Screenplay sean portables.
const app = document.getElementById('app');
const state = { token: sessionStorage.getItem('token'), user: sessionStorage.getItem('user'), cart: { count: 0, items: [] } };

const slug = (name) => name.toLowerCase().replace(/ /g, '-');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Number(n).toFixed(2);

async function api(method, path, body) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(state.token ? { Authorization: 'Bearer ' + state.token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((data && data.message) || 'Error');
    err.status = res.status;
    throw err;
  }
  return data;
}

function go(route) { location.hash = route; }

function header() {
  return `
  <header>
    <div class="logo">Swag Labs</div>
    <nav>
      <button id="react-burger-menu-btn" data-test="open-menu">Menu</button>
      <span id="menu" hidden>
        <a href="#" id="logout_sidebar_link" data-test="logout-sidebar-link">Logout</a>
      </span>
      <a class="cart-link" href="#/cart" data-test="shopping-cart-link">&#128722;${
        state.cart.count > 0 ? `<span class="badge" data-test="shopping-cart-badge">${state.cart.count}</span>` : ''
      }</a>
    </nav>
  </header>`;
}

function bindHeader() {
  document.getElementById('react-burger-menu-btn').onclick = () => {
    const m = document.getElementById('menu');
    m.hidden = !m.hidden;
  };
  document.getElementById('logout_sidebar_link').onclick = async (e) => {
    e.preventDefault();
    try { await api('POST', '/auth/logout'); } catch (_) { /* sesion ya invalida */ }
    sessionStorage.clear();
    state.token = null; state.user = null; state.cart = { count: 0, items: [] };
    go('/');
  };
}

async function refreshCart() { state.cart = await api('GET', '/cart'); }

function renderLogin(error) {
  app.innerHTML = `
  <form class="login" id="login-form">
    <h1>Swag Labs</h1>
    ${error ? `<div class="error" data-test="error">${esc(error)}</div>` : ''}
    <input data-test="username" id="user-name" placeholder="Username" autocomplete="off">
    <input data-test="password" id="password" type="password" placeholder="Password">
    <button class="primary" type="submit" data-test="login-button" id="login-button">Login</button>
    <div class="creds">Usuarios: standard_user, locked_out_user, problem_user<br>Password: secret_sauce</div>
  </form>`;
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await api('POST', '/auth/login', {
        username: document.getElementById('user-name').value,
        password: document.getElementById('password').value,
      });
      state.token = r.token; state.user = r.username;
      sessionStorage.setItem('token', r.token); sessionStorage.setItem('user', r.username);
      go('/inventory');
    } catch (err) { renderLogin(err.message); }
  };
}

async function renderInventory() {
  const [products] = await Promise.all([api('GET', '/products'), refreshCart()]);
  const inCart = new Set(state.cart.items.map((i) => i.id));
  app.innerHTML = `${header()}
  <div class="title" data-test="title">Products</div>
  <div class="list" data-test="inventory-list">
  ${products.map((p) => `
    <div class="item" data-test="inventory-item">
      <a class="name" data-test="inventory-item-name">${esc(p.name)}</a>
      <div data-test="inventory-item-desc">${esc(p.description)}</div>
      <div class="price" data-test="inventory-item-price">${money(p.price)}</div>
      ${inCart.has(p.id)
        ? `<button class="danger" data-test="remove-${slug(p.name)}" data-id="${p.id}" data-action="remove">Remove</button>`
        : `<button data-test="add-to-cart-${slug(p.name)}" data-id="${p.id}" data-action="add">Add to cart</button>`}
    </div>`).join('')}
  </div>`;
  bindHeader();
  app.querySelectorAll('button[data-action]').forEach((b) => {
    b.onclick = async () => {
      const id = b.dataset.id;
      await api(b.dataset.action === 'add' ? 'POST' : 'DELETE', '/cart/' + id);
      renderInventory();
    };
  });
}

async function renderCart() {
  await refreshCart();
  app.innerHTML = `${header()}
  <div class="title" data-test="title">Your Cart</div>
  <div class="list" data-test="cart-list">
  ${state.cart.items.map((p) => `
    <div class="item" data-test="inventory-item">
      <span class="name" data-test="inventory-item-name">${esc(p.name)}</span>
      <div data-test="inventory-item-desc">${esc(p.description)}</div>
      <div class="price" data-test="inventory-item-price">${money(p.price)}</div>
      <button class="danger" data-test="remove-${slug(p.name)}" data-id="${p.id}">Remove</button>
    </div>`).join('')}
  </div>
  <div class="actions">
    <button data-test="continue-shopping" id="continue-shopping">Continue Shopping</button>
    <button class="primary" data-test="checkout" id="checkout">Checkout</button>
  </div>`;
  bindHeader();
  app.querySelectorAll('button[data-id]').forEach((b) => {
    b.onclick = async () => { await api('DELETE', '/cart/' + b.dataset.id); renderCart(); };
  });
  document.getElementById('continue-shopping').onclick = () => go('/inventory');
  document.getElementById('checkout').onclick = () => go('/checkout-step-one');
}

function renderStepOne(error) {
  app.innerHTML = `${header()}
  <div class="title" data-test="title">Checkout: Your Information</div>
  <form class="login" id="info-form" style="margin:0 20px">
    ${error ? `<div class="error" data-test="error">${esc(error)}</div>` : ''}
    <input data-test="firstName" id="first-name" placeholder="First Name">
    <input data-test="lastName" id="last-name" placeholder="Last Name">
    <input data-test="postalCode" id="postal-code" placeholder="Zip/Postal Code">
    <div class="actions" style="padding:0">
      <button type="button" data-test="cancel" id="cancel">Cancel</button>
      <button class="primary" type="submit" data-test="continue" id="continue">Continue</button>
    </div>
  </form>`;
  bindHeader();
  document.getElementById('cancel').onclick = () => go('/cart');
  document.getElementById('info-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/checkout/info', {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        postalCode: document.getElementById('postal-code').value,
      });
      go('/checkout-step-two');
    } catch (err) { renderStepOne(err.message); }
  };
}

async function renderStepTwo() {
  const o = await api('GET', '/checkout/overview');
  await refreshCart();
  app.innerHTML = `${header()}
  <div class="title" data-test="title">Checkout: Overview</div>
  <div class="list" data-test="cart-list">
  ${o.items.map((p) => `
    <div class="item" data-test="inventory-item">
      <span class="name" data-test="inventory-item-name">${esc(p.name)}</span>
      <div class="price" data-test="inventory-item-price">${money(p.price)}</div>
    </div>`).join('')}
  </div>
  <div class="summary">
    <div data-test="subtotal-label">Item total: ${money(o.itemTotal)}</div>
    <div data-test="tax-label">Tax: ${money(o.tax)}</div>
    <div data-test="total-label"><b>Total: ${money(o.total)}</b></div>
  </div>
  <div class="actions">
    <button data-test="cancel" id="cancel">Cancel</button>
    <button class="primary" data-test="finish" id="finish">Finish</button>
  </div>
  <div class="actions"><div class="error" data-test="error" id="finish-error" hidden></div></div>`;
  bindHeader();
  document.getElementById('cancel').onclick = () => go('/inventory');
  document.getElementById('finish').onclick = async () => {
    try {
      await api('POST', '/checkout/finish');
      go('/checkout-complete');
    } catch (err) {
      const box = document.getElementById('finish-error');
      box.textContent = err.message; box.hidden = false;
    }
  };
}

async function renderComplete() {
  await refreshCart();
  app.innerHTML = `${header()}
  <div class="title" data-test="title">Checkout: Complete!</div>
  <div class="summary">
    <h2 data-test="complete-header">Thank you for your order!</h2>
    <p data-test="complete-text">Your order has been dispatched, and will arrive just as fast as the pony can get there!</p>
    <button class="primary" data-test="back-to-products" id="back">Back Home</button>
  </div>`;
  bindHeader();
  document.getElementById('back').onclick = () => go('/inventory');
}

const routes = {
  '/inventory': renderInventory,
  '/cart': renderCart,
  '/checkout-step-one': () => renderStepOne(),
  '/checkout-step-two': renderStepTwo,
  '/checkout-complete': renderComplete,
};

async function router() {
  const route = location.hash.replace(/^#/, '') || '/';
  if (route === '/' ) { return renderLogin(); }
  if (!state.token || !routes[route]) {
    return renderLogin(route !== '/' && !state.token
      ? "Epic sadface: You can only access '" + route + "' when you are logged in." : undefined);
  }
  try { await routes[route](); }
  catch (err) {
    if (err.status === 401) { sessionStorage.clear(); state.token = null; renderLogin(err.message); }
    else app.innerHTML = `<div class="error" data-test="error">${esc(err.message)}</div>`;
  }
}

window.addEventListener('hashchange', router);
router();
