 let stallId = localStorage.getItem("selectedStall"); // ✅ ADD THIS



let stallData = {
    hassan_fish_market: {
        name: "Hassan Fish Market",
        img: "hassan_fish_market.jpeg",
        location: "Near City Market",
        rating: "⭐ 4.3",
        time: "Open until 8:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Hassan+City+Market"
    },

    malnad_fish_center: {
        name: "Malnad Fish Center",
        img: "malnad_fish_center.jpeg",
        location: "Vidyanagar",
        rating: "⭐ 4.5",
        time: "Open until 7:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Vidyanagar+Hassan"
    },

    fishermans_choice: {
        name: "Fisherman’s Choice",
        img: "fishermans_choice.jpeg",
        location: "Bangalore Road",
        rating: "⭐ 4.7",
        time: "Open until 10:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Bangalore+Road+Hassan"
    },

    img1: {
        name: "Manglore Fish",
        img: "img1.png",
        location: "KR Puram Hassan",
        rating: "⭐ 3.5",
        time: "Open until 9:30 PM",
        map: "https://www.google.com/maps/search/?api=1&query=KR+Puram+Hassan"
    },

    m_a_r_sea_food: {
        name: "Manglore A R Sea Food",
        img: "m_a_r_sea_food.jpeg",
        location: "Sampige Road",
        rating: "⭐ 4.0",
        time: "Open until 9:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Sampige+Road+Hassan"
    },

    fish_hunters: {
        name: "Fish Hunters",
        img: "fish_hunters.jpeg",
        location: "MG Road",
        rating: "⭐ 5.0",
        time: "Open until 8:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=MG+Road+Hassan"
    },

    yagachi_fish_land: {
        name: "Yagachi Fish Land",
        img: "yagachi_fish_land.jpeg",
        location: "Kandali",
        rating: "⭐ 4.2",
        time: "Open until 11:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Kandali+Hassan"
    },

    fresh_fish_center: {
        name: "Sham Fish Center",
        img: "fresh_fish_center.jpeg",
        location: "Vidyanagar",
        rating: "⭐ 4.0",
        time: "Open until 11:30 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Vidyanagar+Hassan"
    },

    manglore_fresh_fish_center: {
        name: "Manglore Fresh Fish Center",
        img: "manglore_fresh_fish_center.jpeg",
        location: "Salgame Road",
        rating: "⭐ 3.9",
        time: "Open until 9:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Salgame+Road+Hassan"
    },

    ahamad_manglore_sea_fish: {
        name: "Ahad Manglore Sea Fish",
        img: "ahamad_manglore_sea_fish.jpeg",
        location: "Goruru Road",
        rating: "⭐ 3.6",
        time: "Open until 8:00 PM",
        map: "https://www.google.com/maps/search/?api=1&query=Goruru+Road+Hassan"
    }
};

// ⭐ LOAD REVIEWS
function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem(stallId + "_reviews")) || [];
    let reviewDiv = document.getElementById("reviewsList");

    if (!reviewDiv) return;

    reviewDiv.innerHTML = "";

    reviews.forEach(r => {
        reviewDiv.innerHTML += `
            <div style="background:#fff;padding:10px;margin:8px;border-radius:8px">
                <p>⭐ ${r.rating}</p>
                <p>📝 ${r.text}</p>
            </div>
        `;
    });
}

// ➕ ADD REVIEW
function addReview() {

    let loginType = localStorage.getItem("loginType");

    if (loginType !== "user") {
        alert("Only users can add reviews ❌");
        return;
    }

    let text = document.getElementById("reviewInput").value.trim();
    let rating = localStorage.getItem(stallId + "_rating");

    if (!text || !rating) {
        alert("Please add review and rating ⭐");
        return;
    }

    let reviews = JSON.parse(localStorage.getItem(stallId + "_reviews")) || [];

    reviews.push({
        text: text,
        rating: rating
    });

    localStorage.setItem(stallId + "_reviews", JSON.stringify(reviews));

    document.getElementById("reviewInput").value = "";
    loadReviews();
}

// ⭐ RATE
function rate(value) {

    let loginType = localStorage.getItem("loginType");

    if (loginType !== "user") {
        alert("Only users can rate ❌");
        return;
    }

    let stars = document.querySelectorAll(".star");

    stars.forEach((s, index) => {
        s.classList.toggle("active", index < value);
    });

    localStorage.setItem(stallId + "_rating", value);
}


// ⭐ SHOW RATING
function calculateAverage() {
    let rating = localStorage.getItem(stallId + "_rating");

    if (!rating) return;

    document.getElementById("avgRating").innerText =
        "Your Rating: ⭐ " + rating;
}


// 🗑 DELETE (FIXED)
function deleteStall() {

    let id = localStorage.getItem("selectedStall");
    let stall = JSON.parse(localStorage.getItem("stall_" + id));

    let loginType = localStorage.getItem("loginType");
    let currentAdmin = localStorage.getItem("adminUser");

    if (!stall.createdBy) {
        stall.createdBy = currentAdmin; // fix old data
    }

    // ❌ USERS
    if (loginType !== "admin") {
        alert("Only admin can delete ❌");
        return;
    }

    // ❌ OTHER ADMIN
    if ((stall.createdBy || "").toLowerCase() !== (currentAdmin || "").toLowerCase()) {
        alert("You can only delete your own stall ❌");
        return;
    }

    // ✅ DELETE
    if (confirm("Delete this stall?")) {

        localStorage.removeItem("stall_" + id);
        localStorage.removeItem(id + "_reviews");
        localStorage.removeItem(id + "_rating");

        alert("Stall deleted ✅");
        window.location.href = "index.html";
    }
}

// 🔙 HOME
function goHome() {
    window.location.href = "index.html";
}


window.addEventListener("load", function () {

    // 🚀 LOAD STALL DETAILS
    let stored = localStorage.getItem("stall_" + stallId);
    let stall;


    if (stored) {
        stall = JSON.parse(stored);

        document.getElementById("stallName").innerText = stall.name;
        document.getElementById("stallImage").src = stall.image;

        let loginType = localStorage.getItem("loginType");
        let currentAdmin = localStorage.getItem("adminUser");

        let deleteBtn = document.getElementById("deleteBtn");

        if (deleteBtn) {
            if (
                loginType !== "admin" ||
                (stall.createdBy || "").toLowerCase() !== (currentAdmin || "").toLowerCase()
            ) {
                deleteBtn.style.display = "none";
            }
        }

        document.getElementById("stallLocation").innerText = "📍 " + (stall.location || "N/A");
        document.getElementById("stallRating").innerText = "⭐ 4.0";
        document.getElementById("stallTime").innerText =
            "Open until " + (stall["open until"] || "N/A");
        document.getElementById("stallMap").href = stall.map || "#";

        loadPhotos();
    }

    // ✅ STATIC STALL
    else if (stallData[stallId]) {

        stall = stallData[stallId];

        document.getElementById("stallName").innerText = stall.name;
        document.getElementById("stallImage").src = stall.img;
        document.getElementById("stallLocation").innerText = "📍 " + stall.location;
        document.getElementById("stallRating").innerText = stall.rating;
        document.getElementById("stallTime").innerText = stall.time;
        document.getElementById("stallMap").href = stall.map;

        loadPhotos();
    }

    else {
        alert("Stall not found ❌");
        window.location.href = "index.html";
        return;
    }

    // ✅ COMMON FUNCTIONS
    loadMenu();
    loadQuickInfo();
    loadReviews();
    calculateAverage();
    checkOrderStatus(); // ⭐ IMPORTANT
	loadOverview();
    // ✅ ADMIN MENU BOX
    let loginType = localStorage.getItem("loginType");

    if (loginType === "admin") {
        let box = document.getElementById("adminMenuBox");
        if (box) box.style.display = "block";
    }

    // ❌ HIDE REVIEW FOR NON-USER
    if (loginType !== "user") {

        let reviewBox = document.getElementById("reviewInput");
        if (reviewBox) reviewBox.style.display = "none";

        let reviewBtn = document.getElementById("reviewBtn");
        if (reviewBtn) reviewBtn.style.display = "none";

        let ratingBox = document.getElementById("ratingBox");
        if (ratingBox) ratingBox.style.display = "none";
    }

    // ✅ LOAD FIRST TAB ONLY ONCE
    setTimeout(() => {
        let firstTab = document.querySelector(".tabs button");
        if (firstTab) {
            showTab('overview', firstTab);
        }
    }, 100);

});
function showTab(tab, el) {

    // remove active class
    document.querySelectorAll(".tabs button").forEach(btn => {
        btn.classList.remove("active");
    });

    el.classList.add("active");

    // hide all tabs
    document.querySelectorAll(".tab-content").forEach(div => {
        div.style.display = "none";
    });

    // show only selected tab
    document.getElementById(tab).style.display = "block";

    // ✅ SHOW ADMIN MENU BUTTON ONLY IN MENU TAB
    if (tab === "menu") {
        let loginType = localStorage.getItem("loginType");
        let box = document.getElementById("adminMenuBox");

        if (loginType === "admin" && box) {
            box.style.display = "block";
        }
    }

    // ✅ SHOW QUICK EDIT BUTTON ONLY IN QUICK TAB
    if (tab === "quick") {
        let loginType = localStorage.getItem("loginType");
       let quickEditBtn = document.getElementById("editQuickBtn");

if (loginType === "admin" && quickEditBtn) {
    quickEditBtn.style.display = "block";
}
    }
}
function uploadPhoto() {

    let loginType = localStorage.getItem("loginType");

    if (loginType !== "admin" && loginType !== "superadmin") {
        alert("Only admin can upload photos ❌");
        return;
    }

    let input = document.getElementById("photoUpload");
    let files = input.files;

    if (!files || files.length === 0) {
        alert("Please choose image ❌");
        return;
    }

    let adminUser = localStorage.getItem("adminUser");

    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

    // ✅ CREATE IF NOT EXISTS
    if (!stall) {
        let s = stallData[stallId] || {};

        stall = {
            id: stallId,
            name: s.name,
            image: s.img,
            location: s.location,
            map: s.map,
            photos: [],
            createdBy: adminUser || "admin"
        };

        localStorage.setItem("stall_" + stallId, JSON.stringify(stall));
    }

    let loaded = 0;

    for (let file of files) {

        let reader = new FileReader();

        reader.onload = function(e) {

            let latest = JSON.parse(localStorage.getItem("stall_" + stallId)) || stall;

            if (!latest.photos) latest.photos = [];

            latest.photos.push(e.target.result);
            loaded++;

            if (loaded === files.length) {

                // ✅ SAVE UPDATED DATA
                localStorage.setItem("stall_" + stallId, JSON.stringify(latest));

                loadPhotos(); // refresh UI
                alert("Images uploaded successfully ✅");
                input.value = "";
            }
        };

        reader.readAsDataURL(file);
    }
}
function loadPhotos() {

    let gallery = document.getElementById("photoGallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    // ✅ GET FROM STORAGE FIRST
    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

    // ✅ FALLBACK TO STATIC DATA
    if (!stall) {
        stall = stallData[stallId] || {};
    }

    if (!stall) return;

    let loginType = localStorage.getItem("loginType");
    let currentAdmin = localStorage.getItem("adminUser");

    // ✅ MAIN IMAGE
    if (stall.image) {
        let img = document.createElement("img");
        img.src = stall.image;
        img.style.width = "150px";
        img.style.margin = "5px";
        gallery.appendChild(img);
    }

    // ✅ PHOTOS (VISIBLE FOR ALL USERS)
    if (stall.photos && stall.photos.length > 0) {

        stall.photos.forEach((photo, index) => {

            let wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.display = "inline-block";
            wrapper.style.margin = "5px";

            let img = document.createElement("img");
            img.src = photo;
            img.style.width = "150px";
            img.style.borderRadius = "10px";

            wrapper.appendChild(img);

            // 🔒 ONLY ADMIN CAN DELETE (NOT HIDE PHOTO)
            if (
                loginType === "admin" &&
                (stall.createdBy || "").toLowerCase() === (currentAdmin || "").toLowerCase()
            ) {
                let btn = document.createElement("button");

                btn.innerText = "❌";
                btn.style.position = "absolute";
                btn.style.top = "5px";
                btn.style.right = "5px";

                btn.onclick = function () {
                    deletePhoto(index);
                };

                wrapper.appendChild(btn);
            }

            gallery.appendChild(wrapper);
        });
    }
}
function openUpload() {
    document.getElementById("photoUpload").click();
}

function approveStall() {

    let stallId = localStorage.getItem("selectedStall");
    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

    if (!stall) return;

    stall.status = "approved";

    localStorage.setItem("stall_" + stallId, JSON.stringify(stall));

    alert("Stall approved ✅");
    location.reload();
}
function goHome() {
    localStorage.removeItem("selectedStall"); // 🔥 fix
    window.location.href = "index.html";
}


let menuData = {
    hassan_fish_market: [
        {
            name: "Bangde Fish (Mackerel)",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹560",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
        {
            name: "Kane Fish (Ladyfish)",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1370",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
        {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        }
    ],
	malnad_fish_center: [
        {
            name: "Bangde Fish",
		type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹530",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },
        {
            name: "Catla Fish",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹240",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
        {
            name: "Kane Fish",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1300",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
	{
            name: "Trevally Fish (Caranx spp)",
	type: "fish", 
            img: "Trevally_Fish.jpeg",
            qty: "1 Kg",
            price: "₹330",
            expire: "2 Days",
            desc: `Trevally Fish – Caranx spp.
Medium to large marine fish
Popular in Karnataka, Kerala, Goa, Maharashtra
Firm flesh with rich, slightly strong flavor
Ideal for fry, grilling, and curries
Good source of protein and omega-3 fatty acids
Common in coastal cuisine.`
        },
	{
            name: "Ribbon FishRibbon Fish",
	type: "fish", 
            img: "Ribbon_Fish.jpeg",
            qty: "1 Kg",
            price: "₹700",
            expire: "2 Days",
            desc: `Ribbon Fish – Trichiurus lepturus
Long, thin, ribbon-like marine fish
Popular in Karnataka, Goa, Maharashtra, Kerala
Soft, delicate flesh
Ideal for crispy fry and curries
Good source of protein with moderate omega-3
Common in coastal cuisine.`
        }
    ],
	fishermans_choice: [
        {
            name: "Kane Fish (Ladyfish)",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1370",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
        {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	{
            name: "Black Tuna ",
	type: "fish", 
            img: "Black_Tuna.jpeg",
            qty: "1 Kg",
            price: "₹720",
            expire: "2 Days",
            desc: `Black Tuna – Euthynnus affinis
Medium-sized marine fish (also called Kawakawa)
Popular in Karnataka, Kerala, Goa, Maharashtra
Firm, dark flesh with strong flavor
Rich in protein and omega-3 fatty acids
Common in coastal seafood dishes.`
        }, 
	{
            name: "Rani Fish (Pink Perch) ",
	type: "fish", 
            img: "Rani_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Rani Fish (Pink Perch) – Nemipterus japonicus
Small to medium marine fish
Popular in Karnataka, Kerala, Goa, Maharashtra
Light pink color with delicate, soft flesh
Mild taste, ideal for fry and curries
Good source of protein and essential nutrients
Common in coastal cuisine`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        }

    ],

    img1: [
        {
            name: "Bangde Fish (Mackerel)",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹560",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        },
	 {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	 {
            name: "Indian Oil Sardine",
	type: "fish", 
            img: "Indian_Oil_Sardine.jpeg",
            qty: "1 Kg",
            price: "₹300",
            expire: "2 Days",
            desc: `Indian Oil Sardine – Sardinella longiceps
Small, oily marine fish (locally called Mathi / Pedvey)
Popular in Karnataka, Kerala, Goa, Maharashtra
Strong flavor with soft, edible bones
Ideal for curry, fry, and pickle
Very rich in omega-3, protein, calcium.`
        },
	{
            name: "Rani Fish (Pink Perch) ",
	type: "fish", 
            img: "Rani_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Rani Fish (Pink Perch) – Nemipterus japonicus
Small to medium marine fish
Popular in Karnataka, Kerala, Goa, Maharashtra
Light pink color with delicate, soft flesh
Mild taste, ideal for fry and curries
Good source of protein and essential nutrients
Common in coastal cuisine`
        }

    ],

    m_a_r_sea_food: [
         {
            name: "Bangde Fish",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹530",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },
        {
            name: "Catla Fish",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹240",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
        {
            name: "Kane Fish",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1300",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
	 {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	 {
            name: "Indian Oil Sardine",
	type: "fish", 
            img: "Indian_Oil_Sardine.jpeg",
            qty: "1 Kg",
            price: "₹300",
            expire: "2 Days",
            desc: `Indian Oil Sardine – Sardinella longiceps
Small, oily marine fish (locally called Mathi / Pedvey)
Popular in Karnataka, Kerala, Goa, Maharashtra
Strong flavor with soft, edible bones
Ideal for curry, fry, and pickle
Very rich in omega-3, protein, calcium.`
        }
    ],

    fish_hunters: [
         {
            name: "Bangde Fish (Mackerel)",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹560",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
        {
            name: "Kane Fish (Ladyfish)",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1370",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
        {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        }
    ],

    yagachi_fish_land: [
        {
            name: "Kane Fish (Ladyfish)",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1370",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
        {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	{
            name: "Black Tuna ",
	type: "fish", 
            img: "Black_Tuna.jpeg",
            qty: "1 Kg",
            price: "₹720",
            expire: "2 Days",
            desc: `Black Tuna – Euthynnus affinis
Medium-sized marine fish (also called Kawakawa)
Popular in Karnataka, Kerala, Goa, Maharashtra
Firm, dark flesh with strong flavor
Rich in protein and omega-3 fatty acids
Common in coastal seafood dishes.`
        }, 
	{
            name: "Rani Fish (Pink Perch) ",
	type: "fish", 
            img: "Rani_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Rani Fish (Pink Perch) – Nemipterus japonicus
Small to medium marine fish
Popular in Karnataka, Kerala, Goa, Maharashtra
Light pink color with delicate, soft flesh
Mild taste, ideal for fry and curries
Good source of protein and essential nutrients
Common in coastal cuisine`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        }
    ],

    fresh_fish_center: [
         {
            name: "Kane Fish",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1300",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
	 {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	 {
            name: "Indian Oil Sardine",
	type: "fish", 
            img: "Indian_Oil_Sardine.jpeg",
            qty: "1 Kg",
            price: "₹300",
            expire: "2 Days",
            desc: `Indian Oil Sardine – Sardinella longiceps
Small, oily marine fish (locally called Mathi / Pedvey)
Popular in Karnataka, Kerala, Goa, Maharashtra
Strong flavor with soft, edible bones
Ideal for curry, fry, and pickle
Very rich in omega-3, protein, calcium.`
        },
	{
            name: "Rani Fish (Pink Perch) ",
	type: "fish", 
            img: "Rani_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Rani Fish (Pink Perch) – Nemipterus japonicus
Small to medium marine fish
Popular in Karnataka, Kerala, Goa, Maharashtra
Light pink color with delicate, soft flesh
Mild taste, ideal for fry and curries
Good source of protein and essential nutrients
Common in coastal cuisine`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        }
    ],

    manglore_fresh_fish_center: [
         {
            name: "Bangde Fish (Mackerel)",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹560",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
	 {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        },
	 {
            name: "Indian Oil Sardine",
	type: "fish", 
            img: "Indian_Oil_Sardine.jpeg",
            qty: "1 Kg",
            price: "₹300",
            expire: "2 Days",
            desc: `Indian Oil Sardine – Sardinella longiceps
Small, oily marine fish (locally called Mathi / Pedvey)
Popular in Karnataka, Kerala, Goa, Maharashtra
Strong flavor with soft, edible bones
Ideal for curry, fry, and pickle
Very rich in omega-3, protein, calcium.`
        }
    ],

    ahamad_manglore_sea_fish: [
        {
            name: "Bangde Fish (Mackerel)",
	type: "fish", 
            img: "Bangude_fish.jpeg",
            qty: "1 Kg",
            price: "₹560",
            expire: "2 Days",
            desc: `Bangude (Indian Mackerel) – Rastrelliger kanagurta
Popular, nutrient-rich oily fish
Common in Karnataka (Tulu: Bangude), Goa, Maharashtra (Bangda)
High in omega-3 (DHA/EPA).`
        },

        {
            name: "Boothai Fish (Silver Belly)",
	type: "fish", 
            img: "Boothai_Fish.jpeg",
            qty: "500 g",
            price: "₹100",
            expire: "1 Day",
            desc: `Boothai Fish (Silver Belly) – Leiognathus spp.
Small coastal fish,
Popular in Karnataka, Kerala, Goa, Maharashtra.
Mild taste and soft texture,
Rich in protein with moderate omega-3,
Simple and affordable everyday fish.`
        },
        {
            name: "Catla Fish (Indian Carp)",
	type: "fish", 
            img: "Catla_Fish.jpeg",
            qty: "1 Kg",
            price: "₹250",
            expire: "2 Days",
            desc: ` Catla Fish (Indian Carp) – Catla catla
Popular freshwater fish,
Widely consumed in India, especially West Bengal, Odisha, Karnataka, Andhra Pradesh
Rich taste with soft, fatty head.
Good source of protein, omega-3, and nutrients.`
        },
        {
            name: "Kane Fish (Ladyfish)",
	type: "fish", 
            img: "Kane_Fish.jpeg",
            qty: "1 Kg",
            price: "₹1370",
            expire: "2 Days",
            desc: `Kane Fish (Ladyfish) – Elops machnata.
Widely consumed in Karnataka (Kane), Kerala, Goa, Maharashtra.
Firm flesh with mild, slightly sweet taste,
Rich in protein and essential nutrients,
Common in coastal cuisine.`
        },
        {
            name: "Jalebi Fish (Ribbon Fish)",
	type: "fish", 
            img: "Jalebi_Fish.jpeg",
            qty: "1 Kg",
            price: "₹100",
            expire: "2 Days",
            desc: `Jalebi Fish (Ribbon Fish) – Trichiurus lepturus
Widely consumed in Karnataka, Goa, Maharashtra, Kerala
Long, shiny, ribbon-like body
Good source of protein with moderate omega-3.`
        }
    ]

};	
function loadMenu() {

    let container = document.getElementById("menuContainer");
    if (!container) return;
    container.innerHTML = "";

    let defaultMenu = menuData[stallId] || [];
    let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

    // 🔥 ADD TYPE + TIME
    let items = [
        ...defaultMenu.map(item => ({ ...item, type: "default", createdAt: 0 })),
        ...storedMenu.map(item => ({ ...item, type: "custom" }))
    ];
	

	items = items.filter(item => item && item.name && item.img);

    if (items.length === 0) {
        container.innerHTML = "<p>No menu available</p>";
        return;
    }

    let loginType = localStorage.getItem("loginType");

    items = sortMenuData(items); // 🔥 ADD THIS LINE

items.forEach((item, index) => {

        // 🔥 ADMIN ACTIONS
        let actions = "";
        if (loginType === "admin") {
            actions = `
                <button onclick="editFish(${index})">✏ Edit</button>
                <button onclick="deleteFish(${index})">🗑 Delete</button>
            `;
        }

        // 🔥 ONLY USER CAN SEE CART
        let cartBtn = "";
        if (loginType === "user") {
            cartBtn = `
                <button onclick="addToCart(${index})">🛒 Add to Cart</button>
            `;
        }

        // 🔥 NEW BADGE (24 HOURS)
        let isNew = item.createdAt && (Date.now() - item.createdAt < 86400000);

        let card = `
            <div class="menu-card" data-time="${item.createdAt || 0}">
                
                <img src="${item.img}" onclick="openImage(this.src)">

                <h4>
                    ${item.name}
                    ${isNew ? "<span class='new-badge'>NEW</span>" : ""}
                </h4>

                <p><b>Quantity:</b> ${item.qty}</p>
                <p><b>Price:</b> ${item.price}</p>
                <p><b>Expire:</b> ${item.expire}</p>
                <p>${item.desc}</p>

                ${actions}
                ${cartBtn}
            </div>
        `;

        container.innerHTML += card;
    });
}


window.addEventListener("load", function () {

    loadMenu();
    loadQuickInfo();
    loadReviews();
    calculateAverage();
	checkOrderStatus();
	loadOverview();
    let loginType = localStorage.getItem("loginType");

    if (loginType === "admin") {
        let box = document.getElementById("adminMenuBox");
        if (box) box.style.display = "block";
    }

    // ✅ ADD HERE (VERY IMPORTANT)
    let firstTab = document.querySelector(".tabs button");
    if (firstTab) {
        showTab('overview', firstTab);
    }
let chooseBtn = document.getElementById("chooseBtn");
let uploadBtn = document.getElementById("uploadBtn");

if (chooseBtn && uploadBtn) {

    // 👤 USER → allow upload
    if (loginType === "user") {
        chooseBtn.style.display = "inline-block";
        uploadBtn.style.display = "inline-block";
    }

    // 👨‍💼 ADMIN → allow upload
    else if (loginType === "admin") {
        chooseBtn.style.display = "inline-block";
        uploadBtn.style.display = "inline-block";
    }

    // 👑 SUPER ADMIN → allow upload
    else if (loginType === "superadmin") {
        chooseBtn.style.display = "inline-block";
        uploadBtn.style.display = "inline-block";
    }

    // ❌ NOT LOGGED IN
    else {
        chooseBtn.style.display = "none";
        uploadBtn.style.display = "none";
    }}
let currentAdmin = localStorage.getItem("adminUser");
let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

let quickEditBtn = document.getElementById("editQuickBtn");

if (loginType === "admin" && quickEditBtn) {
    quickEditBtn.style.display = "block";
}

// 🛒 CART BUTTON CONTROL


let cartBtn = document.getElementById("cartBtn");

if (cartBtn) {
    if (loginType !== "user") {
        cartBtn.style.display = "none";
    }
}
let goToNew = localStorage.getItem("goToNewFish");

if (goToNew === "true") {

    // ✅ open MENU tab automatically
    let menuBtn = document.querySelector(".tabs button:nth-child(2)");
    if (menuBtn) {
        showTab("menu", menuBtn);
    }

    // ⏳ wait for menu to load
    setTimeout(() => {

        let cards = document.querySelectorAll(".menu-card");

        for (let card of cards) {

            let time = parseInt(card.getAttribute("data-time"));

            if (time && (Date.now() - time < 86400000)) {

                // 🎯 scroll to first new fish
                card.scrollIntoView({ behavior: "smooth", block: "center" });

                // ✨ highlight effect
                card.style.border = "3px solid red";

                break;
            }
        }

    }, 500);

    localStorage.removeItem("goToNewFish");
}
});
function openImage(src) {
    document.getElementById("imagePopup").style.display = "flex";
    document.getElementById("popupImg").src = src;
}

function closeImage() {
    document.getElementById("imagePopup").style.display = "none";
}
let quickData = {
    hassan_fish_market: {
        phone: "9876543210",
        whatsapp: "9876543210",
        email: "hassanfishmarket@gmail.com",
        open: "08:00",
        close: "21:00",
        address: "Near City Market, Hassan"
    },

    malnad_fish_center: {
        phone: "9123456780",
        whatsapp: "9123456780",
        email: "malnadfish@gmail.com",
        open: "09:00",
        close: "20:00",
        address: "Vidyanagar, Hassan"
    },
	fishermans_choice: {
        phone: "9000000001",
        whatsapp: "9000000001",
        email: "fishermanschoice@gmail.com",
        open: "09:00",
        close: "22:00",
        address: "Bangalore Road, Hassan"
    },

    img1: {
        phone: "9000000002",
        whatsapp: "9000000002",
        email: "manglorefish@gmail.com",
        open: "09:00",
        close: "21:30",
        address: "KR Puram, Hassan"
    },

    m_a_r_sea_food: {
        phone: "9000000003",
        whatsapp: "9000000003",
        email: "marseafood@gmail.com",
        open: "08:00",
        close: "21:00",
        address: "Sampige Road, Hassan"
    },

    fish_hunters: {
        phone: "9000000004",
        whatsapp: "9000000004",
        email: "fishhunters@gmail.com",
        open: "10:00",
        close: "20:00",
        address: "MG Road, Hassan"
    },

    yagachi_fish_land: {
        phone: "9000000005",
        whatsapp: "9000000005",
        email: "yagachifish@gmail.com",
        open: "09:00",
        close: "23:00",
        address: "Kandali, Hassan"
    },

    fresh_fish_center: {
        phone: "9000000006",
        whatsapp: "9000000006",
        email: "shamfish@gmail.com",
        open: "08:00",
        close: "23:30",
        address: "Vidyanagar, Hassan"
    },

    manglore_fresh_fish_center: {
        phone: "9000000007",
        whatsapp: "9000000007",
        email: "manglorefresh@gmail.com",
        open: "09:00",
        close: "21:00",
        address: "Salgame Road, Hassan"
    },

    ahamad_manglore_sea_fish: {
        phone: "9000000008",
        whatsapp: "9000000008",
        email: "ahadfish@gmail.com",
        open: "08:00",
        close: "20:00",
        address: "Goruru Road, Hassan"
    }
};
function loadQuickInfo() {

    let container = document.getElementById("quickContainer");
    if (!container) return;

    let stallId = localStorage.getItem("selectedStall"); // ✅ ALWAYS GET FRESH

    if (!stallId) {
        container.innerHTML = "<p>No stall selected ❌</p>";
        return;
    }

    let storedRaw = localStorage.getItem("quick_" + stallId);
    let data = null;

    try {
        data = JSON.parse(storedRaw);
    } catch (e) {}

    if (!data) data = quickData[stallId];

    if (!data) {
        container.innerHTML = "<p>No info available ❌</p>";
        return;
    }

    let open = data.open || "00:00";
    let close = data.close || "23:59";

    let now = new Date();
    let current = now.getHours() * 60 + now.getMinutes();

    let [oH, oM] = open.split(":").map(Number);
    let [cH, cM] = close.split(":").map(Number);

    let openTime = oH * 60 + oM;
    let closeTime = cH * 60 + cM;

    let status = (current >= openTime && current <= closeTime)
        ? "🟢 Open Now"
        : "🔴 Closed";

    container.innerHTML = `
        <p><b>Status:</b> ${status}</p>
        <p><b>📞 Phone:</b> ${data.phone || "N/A"}</p>
        <p><b>📧 Email:</b> ${data.email || "N/A"}</p>
        <p><b>📍 Address:</b> ${data.address || "N/A"}</p>
    `;
}
function goAddFishPage() {

    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));
    let loginType = localStorage.getItem("loginType");
    let currentAdmin = localStorage.getItem("adminUser");

    if (loginType !== "admin") {
        alert("Only admin can add menu ❌");
        return;
    }

    if (stall && (stall.createdBy || "").toLowerCase() !== (currentAdmin || "").toLowerCase()) {
        alert("You can only add menu to your own stall ❌");
        return;
    }

    localStorage.setItem("selectedStall", stallId);
    window.location.href = "addFish.html";
}
function deleteFish(index) {

    let defaultMenu = menuData[stallId] || [];
    let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

    // 🔥 REMOVE DEFAULT OFFSET
    let customIndex = index - defaultMenu.length;

    if (customIndex < 0) {
        alert("Default fish cannot be deleted ❌");
        return;
    }

    storedMenu.splice(customIndex, 1);

    localStorage.setItem("menu_" + stallId, JSON.stringify(storedMenu));

    alert("Fish deleted ✅");

    loadMenu();
}
function editFish(index) {

    localStorage.setItem("editIndex", index);

    window.location.href = "addFish.html";
}
function addToCart(index) {

    let defaultMenu = menuData[stallId] || [];
    let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

    let items = [...defaultMenu, ...storedMenu];

    let cart = JSON.parse(localStorage.getItem("cart_" + stallId));

    if (!Array.isArray(cart)) {
        cart = [];
    }

    let selectedItem = items[index];

    if (!selectedItem) {
        alert("Item not found ❌");
        return;
    }

    cart.push({
        name: selectedItem.name,
        price: selectedItem.price
    });

    localStorage.setItem("cart_" + stallId, JSON.stringify(cart));

    console.log("✅ Cart after add:", cart);

    alert("Added to cart 🛒");
}


function goCart() {
    window.location.href = "cart.html";
}
function goOrders() {

    let loginType = localStorage.getItem("loginType");

    if (loginType === "admin") {
        window.location.href = "adminOrders.html";
    } 
    else if (loginType === "user") {
        window.location.href = "userOrders.html";
    } 
    else {
        alert("Please login first ❌");
        window.location.href = "index.html";
    }
}
function editQuickInfo() {

    let stallId = localStorage.getItem("selectedStall"); // ✅ ADD THIS

    let storedRaw = localStorage.getItem("quick_" + stallId);
    let stored = null;

    try {
        stored = JSON.parse(storedRaw);
    } catch (e) {}

    let data = stored || quickData[stallId] || {};

    let phone = prompt("Enter Phone:", data.phone || "");
    let email = prompt("Enter Email:", data.email || "");
    let address = prompt("Enter Address:", data.address || "");

    let open = prompt("Open Time (HH:MM):", data.open || "09:00");
    let close = prompt("Close Time (HH:MM):", data.close || "21:00");

    let updated = {
        ...data,
        phone,
        email,
        address,
        open,
        close
    };

    localStorage.setItem("quick_" + stallId, JSON.stringify(updated));

    alert("Quick Info Updated ✅");

    loadQuickInfo();
}
function deletePhoto(index) {

    let stall = JSON.parse(localStorage.getItem("stall_" + stallId));

    if (!stall || !stall.photos) return;

    let loginType = localStorage.getItem("loginType");
    let currentAdmin = localStorage.getItem("adminUser");

    // ❌ NOT ADMIN
    if (loginType !== "admin") {
        alert("Only admin can delete ❌");
        return;
    }

    // ❌ NOT OWNER ADMIN
    if ((stall.createdBy || "").toLowerCase() !== (currentAdmin || "").toLowerCase()) {
        alert("You can only delete your own stall photos ❌");
        return;
    }

    // ✅ CONFIRM DELETE
    if (!confirm("Delete this photo?")) return;

    stall.photos.splice(index, 1);

    localStorage.setItem("stall_" + stallId, JSON.stringify(stall));

    alert("Photo deleted ✅");

    loadPhotos();
}
function loadOverview() {

    let stall =
        JSON.parse(localStorage.getItem("stall_" + stallId)) ||
        stallData[stallId];

    if (!stall) return;

    // 📍 BASIC
    document.getElementById("ovLocation").innerText =
        "📍 " + (stall.location || "N/A");

    document.getElementById("ovRating").innerText =
        stall.rating || "⭐ 4.0";

    document.getElementById("ovTime").innerText =
        stall.time || "N/A";

    // 📞 QUICK INFO
    let quick =
        JSON.parse(localStorage.getItem("quick_" + stallId)) ||
        quickData[stallId];

    if (quick) {
        document.getElementById("ovPhone").innerText =
            "📞 " + (quick.phone || "N/A");
    }

    // 🐟 MENU (TOP 2)
    let menu =
        JSON.parse(localStorage.getItem("menu_" + stallId)) ||
        menuData[stallId] ||
        [];

    let box = document.getElementById("ovMenu");
    box.innerHTML = "";

    menu.slice(0, 2).forEach(item => {
        box.innerHTML += `<p>🐟 ${item.name} - ${item.price}</p>`;
    });
}
function sortMenuData(items) {

    let sortValue = document.getElementById("menuSort")?.value;

    if (!sortValue || sortValue === "default") return items;

    let sorted = [...items];

    // 💰 PRICE
    if (sortValue === "priceLow" || sortValue === "priceHigh") {

        sorted.sort((a, b) => {

            let priceA = parseInt((a.price || "₹0").replace("₹", "")) || 0;
            let priceB = parseInt((b.price || "₹0").replace("₹", "")) || 0;

            return sortValue === "priceLow"
                ? priceA - priceB
                : priceB - priceA;
        });
    }

    // 🔤 NAME
    else if (sortValue === "name") {

        sorted.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        );
    }

    // ⚖️ QUANTITY
    else if (sortValue === "qty") {

        sorted.sort((a, b) => {

            let qA = parseFloat(a.qty) || 0;
            let qB = parseFloat(b.qty) || 0;

            return qA - qB;
        });
    }

    // ⏳ EXPIRY
    else if (sortValue === "expire") {

        sorted.sort((a, b) => {

            let eA = parseInt(a.expire) || 0;
            let eB = parseInt(b.expire) || 0;

            return eA - eB;
        });
    }

    // 🆕 NEW ARRIVAL
    else if (sortValue === "new") {

        sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return sorted;
}
function sortMenuItems() {
    loadMenu(); // 🔥 reload menu with new sort
}