async function createAccount() {
  const username = document.getElementById("username").value;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("userId", data.id);
  location.href = "dashboard.html";
}

async function login() {
  const username = document.getElementById("username").value;
  const res = await fetch(`/api/users/${username}`);
  const data = await res.json();

  if (!res.ok) return alert("User not found");

  localStorage.setItem("userId", data.id);
  location.href = "dashboard.html";
}
