function loadOrders() {
    let container = document.getElementById("ordersContainer");
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let currentAdmin = (localStorage.getItem("adminUser") || "").toLowerCase();

    container.innerHTML = "";

    let adminOrders = orders.filter(o =>
        (o.admin || "").toLowerCase() === currentAdmin
    );

    if (adminOrders.length === 0) {
        container.innerHTML = "<p class='empty-msg'>No orders yet</p>";
        return;
    }

    adminOrders.forEach(order => {
        let itemsHtml = "";

        order.items.forEach(item => {
            itemsHtml += `<p>🐟 ${item.name} - ${item.price}</p>`;
        });

        container.innerHTML += `
            <div class="order-card">
                <p><b>Order ID:</b> ${order.id}</p>
                <p>👤 ${order.user}</p>
                ${itemsHtml}

                <p>
                    ${
                        order.status === "pending"
                        ? "⏳ Pending"
                        : order.status === "confirmed"
                        ? "✅ Confirmed"
                        : "❌ Rejected"
                    }
                </p>

                ${
                    order.status === "pending"
                    ? `
                        <button onclick="confirmOrder(${order.id})">✅ Accept</button>
                        <button onclick="rejectOrder(${order.id})">❌ Reject</button>
                      `
                    : ""
                }

                <button onclick="deleteOrder(${order.id})">🗑 Delete</button>
            </div>
        `;
    });
}

function confirmOrder(orderId) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let currentAdmin = (localStorage.getItem("adminUser") || "").toLowerCase();

    orders = orders.map(order => {

        if (
            String(order.id) === String(orderId) &&
            order.status === "pending" &&
            (order.admin || "").toLowerCase() === currentAdmin
        ) {
            order.status = "confirmed";
        }

        return order;
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order confirmed ✅");
    loadOrders();
}

function rejectOrder(orderId) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let currentAdmin = (localStorage.getItem("adminUser") || "").toLowerCase();

    orders = orders.map(order => {

        if (
            String(order.id) === String(orderId) &&
            order.status === "pending" &&
            (order.admin || "").toLowerCase() === currentAdmin
        ) {
            order.status = "rejected";
        }

        return order;
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order rejected ❌");
    loadOrders();
}
function deleteOrder(orderId) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.filter(o => String(o.id) !== String(orderId));

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order deleted 🗑");

    loadOrders();
}

function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Page Loaded");
    loadOrders();
});