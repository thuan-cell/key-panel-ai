
const BACKEND_URL = "https://key-panel-ai3.onrender.com";
const MIN_BALANCE = 50000;
const STORE_SECRET_KEY = "*45GtrpQY8hzL9alhfjkshjdgsdjhiufbv_XZ$!@^&*()+|[]{}<>~l5eWJ@PgfaM#casjskdlj80y8907851uhkggbOPw1Fkc41t%z5a^dfg&hjk3";


function checksum(str) {
  let a = 1, c = 0;
  if (!str) return a;
  a = 0;
  for (let h = str.length - 1; h >= 0; h--) {
    let o = str.charCodeAt(h);
    a = (a << 6 & 268435455) + o + (o << 14);
    c = a & 266338304;
    if (c !== 0) a ^= c >> 21;
  }
  return String(a);
}

function strToHex(str) {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

function encrypt(data, salt) {
  return strToHex(Array.from(data).map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length))
  ).join(''));
}

function generateCode() {
  const serial = document.getElementById("serialInput").value.trim();
  const expireDate = document.getElementById("expireInput").value;

  if (!serial || !expireDate) {
    alert("Vui lòng nhập Serial và ngày hết hạn!");
    return;
  }

  const checksumCode = checksum(serial);
  const expireTimestamp = Math.floor(new Date(expireDate).getTime() / 1000);
  const raw = `${checksumCode}|${expireTimestamp}`;
  const encrypted = encrypt(raw, STORE_SECRET_KEY);

  document.getElementById("result").value = encrypted;

  saveActivationToHistory({
    inputString: serial,
    licenseKey: encrypted,
    remainingBalance: null,
    transactionCode: null
  });
}

function saveActivationToHistory(data) {
  let activationHistory = JSON.parse(localStorage.getItem('activationHistory')) || [];
  const historyItem = {
    inputString: data.inputString,
    licenseKey: data.licenseKey,
    timestamp: data.timestamp || Math.floor(Date.now() / 1000),
    remainingBalance: data.remainingBalance,
    transactionCode: data.transactionCode || generateRandomId()
  };
  activationHistory.unshift(historyItem);
  if (activationHistory.length > 50) {
    activationHistory = activationHistory.slice(0, 50);
  }
  localStorage.setItem('activationHistory', JSON.stringify(activationHistory));

  if (document.getElementById('historyContainer').style.display === 'block') {
    loadActivationHistory();
  }
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 10);
}

function loadActivationHistory() {
  const historyItems = document.getElementById('historyItems');
  const activationHistory = JSON.parse(localStorage.getItem('activationHistory')) || [];
  historyItems.innerHTML = '';
  if (activationHistory.length === 0) {
    historyItems.innerHTML = '<p>Chưa có lịch sử kích hoạt nào.</p>';
    return;
  }

  activationHistory.forEach(item => {
    const date = new Date(item.timestamp * 1000).toLocaleString('vi-VN');
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="date">📅 ${date}</div>
      <div class="input">🔖 Chuỗi nhập: ${item.inputString}</div>
      <div class="key">🔑 Khóa: ${item.licenseKey}</div>
    `;
    historyItems.appendChild(div);
  });
}

function toggleHistory() {
  const container = document.getElementById('historyContainer');
  if (container.style.display === 'block') {
    container.style.display = 'none';
  } else {
    container.style.display = 'block';
    loadActivationHistory();
  }
}

function clearHistory() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử kích hoạt?')) {
    localStorage.removeItem('activationHistory');
    loadActivationHistory();
  }
}

// Tự động gán nút tạo key nếu dùng addEventListener thay vì onclick trong HTML
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('generateBtn');
  if (btn) btn.addEventListener('click', generateCode);
});




document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateBtn');
  const serialInput = document.getElementById('serialInput');
  const expireInput = document.getElementById('expireInput');
  const resultTextarea = document.getElementById('result');
  const logoutButton = document.getElementById('logoutBtn');
  const historyToggleButton = document.getElementById('historyToggleButton');
  const historyContainer = document.getElementById('historyContainer');

  // Hàm disable chỉ khóa nút tạo mã, không ẩn các thành phần khác
  function disableGenerate() {
    generateButton.disabled = true;
  }
  function enableGenerate() {
    generateButton.disabled = false;
  }

  // Kiểm tra số dư
  // Kiểm tra số dư
 const BIN_ID = "683abf6e8960c979a5a364cc";
  const API_KEY = "$2a$10$neuJOkSf/vIDc29/lArDz.7ChrunFea17sXAZLvRsJyztpIV0oJkG";

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateBtn');

  function disableGenerate() {
    generateButton.disabled = true;
  }

  function enableGenerate() {
    generateButton.disabled = false;
  }

  const userEmail = localStorage.getItem("currentUserEmail");

  if (!userEmail) {
    Swal.fire("Lỗi", "Không tìm thấy email người dùng. Vui lòng đăng nhập lại.", "error");
    disableGenerate();
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    headers: {
      'X-Master-Key': API_KEY
    }
  })
    .then(res => res.json())
    .then(data => {
      const userData = data.record.users[userEmail];
      const balance = userData?.balance ?? 0;

      if (balance < 50000) {
        Swal.fire("Không đủ số dư", "Không thể tạo key. Vui lòng liên hệ admin.", "warning");
        disableGenerate();
      } else {
        enableGenerate();
      }
    })
    .catch((err) => {
      console.error("Lỗi kiểm tra số dư:", err);
      Swal.fire("Lỗi", "Không thể kiểm tra số dư từ máy chủ", "error");
      disableGenerate();
    });
});

});
