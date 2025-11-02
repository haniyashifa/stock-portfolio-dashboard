// ------------------------------
// Lab 02 | Stock Portfolio Dashboard
// Author: Haniya Shifa
// ------------------------------

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    portfolio: [
      { ticker: "AAPL", shares: 15, price: 175 },
      { ticker: "MSFT", shares: 10, price: 330 },
    ],
  },
  {
    id: 2,
    name: "John Miller",
    email: "john@example.com",
    portfolio: [
      { ticker: "TSLA", shares: 8, price: 250 },
      { ticker: "AMZN", shares: 5, price: 130 },
    ],
  },
];

let selectedUser = null;
let selectedStock = null;

// DOM Elements
const userList = document.getElementById("userList");
const stockList = document.getElementById("stockList");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const stockDetails = document.getElementById("stockDetails");
const saveButton = document.getElementById("saveUser");
const deleteButton = document.getElementById("deleteUser");

// Render users
function renderUserList() {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.email})`;
    li.addEventListener("click", () => selectUser(user, li));
    userList.appendChild(li);
  });
  populateExistingUsers();
}

// Select user
function selectUser(user, li) {
  selectedUser = user;
  document.querySelectorAll("#userList li").forEach(li => li.classList.remove("selected"));
  li.classList.add("selected");
  userNameInput.value = user.name;
  userEmailInput.value = user.email;
  renderPortfolio(user.portfolio);
  stockDetails.innerHTML = "Select a stock to view details.";
}

// Render portfolio
function renderPortfolio(portfolio) {
  stockList.innerHTML = "";
  portfolio.forEach((stock) => {
    const li = document.createElement("li");
    li.textContent = `${stock.ticker} - ${stock.shares} shares`;
    li.addEventListener("click", () => showStockDetails(stock, li));
    stockList.appendChild(li);
  });
}

// Show stock details
function showStockDetails(stock, li) {
  document.querySelectorAll("#stockList li").forEach(li => li.classList.remove("selected"));
  li.classList.add("selected");
  selectedStock = stock;
  stockDetails.innerHTML = `
    <h3>${stock.ticker}</h3>
    <p>Shares: ${stock.shares}</p>
    <p>Price: $${stock.price}</p>
    <p>Total Value: $${(stock.shares * stock.price).toFixed(2)}</p>
  `;
}

// Save edited user
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (selectedUser) {
    selectedUser.name = userNameInput.value;
    selectedUser.email = userEmailInput.value;
    alert("✅ User information updated!");
    renderUserList();
  }
});

// Delete user
deleteButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (selectedUser) {
    const index = users.indexOf(selectedUser);
    users.splice(index, 1);
    selectedUser = null;
    userNameInput.value = "";
    userEmailInput.value = "";
    stockList.innerHTML = "";
    stockDetails.innerHTML = "User deleted.";
    alert("🗑 User deleted successfully!");
    renderUserList();
  }
});

// ------------------------------
// Add User
// ------------------------------
const addUserForm = document.getElementById("addUserForm");
const newUserName = document.getElementById("newUserName");
const newUserEmail = document.getElementById("newUserEmail");
const stockSelect = document.getElementById("stockSelect");
const shareCount = document.getElementById("shareCount");
const clearFormBtn = document.getElementById("clearFormBtn");

addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = newUserName.value.trim();
  const email = newUserEmail.value.trim();
  const ticker = stockSelect.value;
  const shares = parseInt(shareCount.value);

  if (!name || !email || !ticker || !shares) {
    alert("⚠️ Please fill all fields before adding a user!");
    return;
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    portfolio: [{ ticker, shares, price: getRandomPrice() }],
  };

  users.push(newUser);
  renderUserList();
  alert(`🎉 Added new user: ${name} with ${shares} shares of ${ticker}`);
  addUserForm.reset();
});

clearFormBtn.addEventListener("click", () => addUserForm.reset());

// Helper: Generate random stock price
function getRandomPrice() {
  return Math.floor(Math.random() * 400) + 50;
}

// ------------------------------
// Manage Shares
// ------------------------------
const manageForm = document.getElementById("manageSharesForm");
const existingUserSelect = document.getElementById("existingUserSelect");
const existingStockSelect = document.getElementById("existingStockSelect");
const manageShareCount = document.getElementById("manageShareCount");
const addSharesBtn = document.getElementById("addSharesBtn");
const removeSharesBtn = document.getElementById("removeSharesBtn");

function populateExistingUsers() {
  existingUserSelect.innerHTML = '<option value="">-- Choose a user --</option>';
  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.name;
    existingUserSelect.appendChild(opt);
  });
}

addSharesBtn.addEventListener("click", () => {
  const userId = parseInt(existingUserSelect.value);
  const stock = existingStockSelect.value;
  const shares = parseInt(manageShareCount.value);
  if (!userId || !stock || !shares) {
    alert("⚠️ Please select a user, stock, and shares!");
    return;
  }

  const user = users.find((u) => u.id === userId);
  let existingStock = user.portfolio.find((s) => s.ticker === stock);

  if (existingStock) {
    existingStock.shares += shares;
    alert(`📈 Added ${shares} shares to ${stock} for ${user.name}`);
  } else {
    user.portfolio.push({ ticker: stock, shares, price: getRandomPrice() });
    alert(`✅ ${stock} added to ${user.name}'s portfolio!`);
  }

  renderPortfolio(user.portfolio);
  renderUserList();
});

removeSharesBtn.addEventListener("click", () => {
  const userId = parseInt(existingUserSelect.value);
  const stock = existingStockSelect.value;
  const shares = parseInt(manageShareCount.value);
  if (!userId || !stock || !shares) {
    alert("⚠️ Please select a user, stock, and shares!");
    return;
  }

  const user = users.find((u) => u.id === userId);
  let existingStock = user.portfolio.find((s) => s.ticker === stock);

  if (!existingStock) {
    alert(`⚠️ ${stock} not found in ${user.name}'s portfolio!`);
    return;
  }

  if (existingStock.shares <= shares) {
    user.portfolio = user.portfolio.filter((s) => s.ticker !== stock);
    alert(`🗑 Removed ${stock} from ${user.name}'s portfolio`);
  } else {
    existingStock.shares -= shares;
    alert(`📉 Removed ${shares} shares from ${stock}`);
  }

  renderPortfolio(user.portfolio);
  renderUserList();
});

renderUserList();
