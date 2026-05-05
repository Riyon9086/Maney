const data = JSON.parse(localStorage.getItem("moneyData")) || [];

let income = 0;
let expense = 0;
let selectedId = null;

data.forEach(t => {
  if (t.type === "income") income += t.amount;
  if (t.type === "expense") expense += t.amount;
});

const total = income - expense;

document.getElementById("totalSaldo").textContent = "Rp" + total.toLocaleString();
document.getElementById("totalIncome").textContent = "Rp" + income.toLocaleString();
document.getElementById("totalExpense").textContent = "Rp" + expense.toLocaleString();

const historyList = document.getElementById("historyList");

function renderHistory() {
  historyList.innerHTML = "";

  data.slice().reverse().forEach(t => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    
    div.innerHTML = `
      <div class="txn-container">
        <span class="txn-amount ${t.type}">
          ${t.type === "income" ? "+" : "-"}Rp${t.amount.toLocaleString()}
        </span>
        <div class="txn-info">
          <span class="txn-item">${t.item}</span>
        </div>
        <button class="delete-btn" onclick="alertDelete(${t.id})">
          ️<i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    

    historyList.appendChild(div);
  });
}

function alertDelete(id) {
  selectedId = id; // simpen dulu
  const alert = document.getElementById("alert");
  alert.style.display = "block";
  setTimeout(function() {
  alert.style.opacity = "1";
  alert.style.transition = ".3s ease";
  }, 500);
}
function deleteAlert() {
  const alert = document.getElementById("alert");
  alert.style.display = "none";
  alert.style.opacity = "0";
}

function confirmDelete() {
  if (selectedId === null) return;

  let data = JSON.parse(localStorage.getItem("moneyData")) || [];

  data = data.filter(t => t.id !== selectedId);

  localStorage.setItem("moneyData", JSON.stringify(data));

  location.reload();
}
renderHistory();

const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {
  const data = localStorage.getItem("moneyData");

  if (!data) {
    alert("Belum ada data buat di export 😭");
    return;
  }

  // bikin file blob
  const blob = new Blob([data], { type: "application/json" });

  // bikin link download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "money-data.json";

  document.body.appendChild(a);
  a.click();

  // bersihin
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});