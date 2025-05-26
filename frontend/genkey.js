
const BACKEND_URL = "https://your-backend.onrender.com";
const STORE_SECRET_KEY = "*45GtrpQY8hz..."; // Giữ nguyên từ bản gốc
const MIN_BALANCE = 50000;

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

async function getBalance() {
  try {
    const res = await fetch(`${BACKEND_URL}/balance`);
    const data = await res.json();
    return data.balance;
  } catch (e) {
    alert("❌ Không thể kết nối đến máy chủ!");
    return 0;
  }
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const serial = document.getElementById("serialInput").value.trim();
  const expireDate = document.getElementById("expireInput").value;

  if (!serial || !expireDate) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const balance = await getBalance();
  if (balance < MIN_BALANCE) {
    alert(`⚠️ Số dư hiện tại là ${balance} VND. Cần ít nhất ${MIN_BALANCE} VND.`);
    return;
  }

  const checksumCode = checksum(serial);
  const expireTimestamp = Math.floor(new Date(expireDate).getTime() / 1000);
  const raw = `${checksumCode}|${expireTimestamp}`;
  const encrypted = encrypt(raw, STORE_SECRET_KEY);

  document.getElementById("result").value = encrypted;
});
