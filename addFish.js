let stallId = localStorage.getItem("selectedStall");

let editIndex = localStorage.getItem("editIndex");

function addFish() {

    let file = document.getElementById("fishImg").files[0];
    let name = document.getElementById("fishName").value;
    let qty = document.getElementById("fishQty").value;
    let price = document.getElementById("fishPrice").value;
    let expire = document.getElementById("fishExpire").value;
    let desc = document.getElementById("fishDesc").value;

    let reader = new FileReader();

    reader.onload = function(e) {

    let img = e.target.result;   // ✅ FIX

    if (!name || !img || !qty || !price) {
        alert("Please fill all fields ❌");
        return;
    }

    let newFish = {
        name: name,
	type: "fish", 
        img: img,
        qty: qty,
        price: price,
        expire: expire,
        desc: desc,
        createdAt: Date.now()
    };

    let menu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

    // ✏ EDIT MODE
    if (editIndex !== null) {
        menu[editIndex] = newFish;
        localStorage.removeItem("editIndex");
    } 
    // ➕ ADD MODE
    else {
        menu.push(newFish);
    }

    localStorage.setItem("menu_" + stallId, JSON.stringify(menu));

    alert("Saved successfully ✅");
    window.location.href = "stall.html";
};

    if (file) {
        reader.readAsDataURL(file);
    } else {
        alert("Upload image ❌");
    }
}

function goBack() {
    window.location.href = "stall.html";
}
