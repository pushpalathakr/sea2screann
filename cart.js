function loadCart() {

let stallId = localStorage.getItem("selectedStall");
let cart = JSON.parse(localStorage.getItem("cart_" + stallId)) || [];
    let container = document.getElementById("cartContainer");

    if (!container) return;

    container.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Cart is empty ❌</p>";
        return;
    }

    cart.forEach((item, index) => {

        let price = parseInt(item.price.replace("₹", ""));
        total += price;

        container.innerHTML += `
            <div>
                <h4>${item.name}</h4>
                <p>Price: ${item.price}</p>
                <button onclick="removeItem(${index})">❌ Remove</button>
            </div>
        `;
    });

    document.getElementById("totalPrice").innerText = "Total: ₹" + total;
}

function removeItem(index) {

    let stallId = localStorage.getItem("selectedStall");
    let cart = JSON.parse(localStorage.getItem("cart_" + stallId)) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart_" + stallId, JSON.stringify(cart));

    loadCart();
}
function placeOrder() {

    let stallId = localStorage.getItem("selectedStall"); // 🔥 FIX HERE FIRST

    let cart = JSON.parse(localStorage.getItem("cart_" + stallId)) || [];
    console.log("🛒 Cart:", cart);

    if (cart.length === 0) {
        alert("Cart is empty ❌");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let user = (localStorage.getItem("username") || "guest").toLowerCase();

    if (!stallId) {
        alert("Stall not selected ❌");
        return;
    }

    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

    let admin = "admin";

    if (stall && stall.createdBy) {
        admin = stall.createdBy.toLowerCase();
    }

    let newOrder = {
        id: Date.now(),
        user: user,
        items: cart,
        status: "pending",
        stallId: stallId,
        admin: admin
    };

    orders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart_" + stallId);

    alert("Order placed successfully ✅");

    window.location.href = "userOrders.html";
}
function goBack() {
    window.history.back();
}

window.addEventListener("load", loadCart);