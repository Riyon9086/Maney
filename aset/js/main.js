// ===== STORAGE =====
let transactions = [];

function saveData() {
  localStorage.setItem("moneyData", JSON.stringify(transactions));
}

function loadData() {
  const data = localStorage.getItem("moneyData");
  if (data) {
    transactions = JSON.parse(data);
  }
}

loadData();


// ===== ELEMENT =====
const input = document.getElementById("chatInput");
const button = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");
const dashboardBtn = document.getElementById("dashboardBtn");

const btnIncome = document.getElementById("btnIncome");
const btnExpense = document.getElementById("btnExpense");
const btnSaldo = document.getElementById("btnSaldo");

// ===== EVENT =====
button.addEventListener("click", sendMessage);
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

btnIncome.addEventListener("click", () => {
  sendQuickMessage("total pendapatan");
});

btnExpense.addEventListener("click", () => {
  sendQuickMessage("jumlah pengeluaran");
});

btnSaldo.addEventListener("click", () => {
  sendQuickMessage("saldo");
});


// ===== MAIN FUNCTION =====
function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  // tampil user chat
  addMessage(text, "user");

  // parsing
  const result = parseMessage(text);

  let botReply = "";

  // simpan data kalau valid
  if (result.type === "expense" || result.type === "income") {
  transactions.push({
    id: Date.now(),
    ...result
  });
  saveData();
  }  

  if (result.type === "expense") {
    botReply = `Noted, ${result.item} -Rp${result.amount.toLocaleString()}.`;
  } else if (result.type === "income") {
    botReply = `Noted, dapet Rp${result.amount.toLocaleString()} dari ${result.item}.`;
  } else if (text.toLowerCase().includes("saldo")) {
    const summary = getSummary();
    botReply = `Saldo lu: Rp${summary.total.toLocaleString()} Pemasukan: Rp${summary.income.toLocaleString()} \n Pengeluaran: Rp${summary.expense.toLocaleString()}`;
  } else {
    botReply = `Gw bingung 😭 coba tulis kayak "beli kopi 2rb"`;
  }

  addMessage(botReply, "bot");

  input.value = "";
}


// ===== QUICK BUTTON =====
function sendQuickMessage(text) {
  addMessage(text, "user");

  let botReply = "";
  const summary = getSummary();

  if (text === "total pendapatan") {
    botReply = `Total pendapatan: Rp${summary.income.toLocaleString()} 💸`;
  }

  if (text === "jumlah pengeluaran") {
    botReply = `Total pengeluaran: Rp${summary.expense.toLocaleString()} 😭`;
  }

  if (text === "saldo") {
    botReply = `Jumlah Saldo: Rp${summary.total.toLocaleString()}`;
  }

  addMessage(botReply, "bot");
}


// ===== PARSER =====
function parseMessage(text) {
  text = text.toLowerCase();

  const expenseKeywords = ["beli", "bayar", "jajan"];
  const incomeKeywords = ["dapet", "gaji", "dikasih"];

  let type = "unknown";

  for (let word of expenseKeywords) {
    if (text.includes(word)) type = "expense";
  }

  for (let word of incomeKeywords) {
    if (text.includes(word)) type = "income";
  }

  // ambil angka
  let amount = 0;
  const numberMatch = text.match(/(\d+)\s?(rb|ribu|k)?/);

  if (numberMatch) {
    amount = parseInt(numberMatch[1]);

    if (numberMatch[2]) {
      const unit = numberMatch[2];
      if (unit === "rb" || unit === "ribu" || unit === "k") {
        amount *= 1000;
      }
    }
  }

  // ambil item
  let item = "sesuatu";

  if (type === "expense") {
    const match = text.match(/beli (.+?) (\d+)/);
    if (match) item = match[1];
  }

  if (type === "income") {
    const match = text.match(/(dapet|gaji|dikasih) (.+?) (\d+)/);
    if (match) item = match[2];
  }

  return { type, amount, item };
}


// ===== SUMMARY =====
function getSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    if (t.type === "expense") expense += t.amount;
  });

  return {
    income,
    expense,
    total: income - expense
  };
}


// ===== HELPER =====
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;

  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===== DASHBOARD ====
dashboardBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});