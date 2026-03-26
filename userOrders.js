let loginType = localStorage.getItem("loginType");

if (loginType !== "user") {
    alert("Access denied ❌");
    window.location.href = "index.html";
}
function loadUserOrders() {

    let container = document.getElementById("userOrders");
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let user = (localStorage.getItem("username") || "").toLowerCase();

    container.innerHTML = "";

    let userOrders = orders.filter(o => 
        (o.user || "").toLowerCase() === user
    );

    if (userOrders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    userOrders.forEach(order => {

        let itemsHtml = "";

        order.items.forEach(item => {
            itemsHtml += `<p>🐟 ${item.name}</p>`;
        });

        // ✅ SAME DESIGN AS ADMIN (BUT NO BUTTONS)
        container.innerHTML += `
            <div class="order-card">

                <p><b>Order ID:</b> ${order.id}</p>

                ${itemsHtml}

                <p class="status ${order.status}">
                    ${
                        order.status === "pending"
                        ? "⏳ Pending"
                        : order.status === "confirmed"
                            ? "✅ Confirmed"
                            : "❌ Rejected"
                    }
                </p>

            </div>
        `;
    });
}
window.addEventListener("load", loadUserOrders);
setInterval(loadUserOrders, 2000);

function goBack() {
    window.history.back();
}