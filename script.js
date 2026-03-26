

// copy ONLY keys (minimal)
let menuData = window.menuData || {};
// 🔍 SEARCH
function searchFish(inputText = null) {

    let input = inputText 
        ? inputText.toLowerCase().trim()
        : document.getElementById("search").value.toLowerCase().trim();

    input = input.replace(/[.,!?]/g, "");

    let cards = document.getElementsByClassName("card");
    let found = false;

    if (input === "") {
        for (let card of cards) {
            card.style.display = "block";
        }
        document.getElementById("noResult").style.display = "none";
        return;
    }

    for (let card of cards) {
        let text = (card.textContent || "").toLowerCase();

        let match = text.includes(input);

        if (!match) {
            let words = input.split(" ");
            match = words.some(word => text.includes(word));
        }

        card.style.display = match ? "block" : "none";
        if (match) found = true;
    }

    document.getElementById("noResult").style.display = found ? "none" : "block";
}
function startVoice() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice search not supported ❌ Use Chrome");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    let mic = document.querySelector(".mic");

    recognition.lang = "en-IN"; // better for Indian accent
    recognition.start();

    mic.classList.add("active");

    // ✅ SUCCESS
    recognition.onresult = function(event) {

        let text = event.results[0][0].transcript.trim();

        if (!text) {
            alert("Voice not recognized ❌ Try again");
            return;
        }

        document.getElementById("search").value = text;
        applyAllFilters(); // 🔥 updated function
    };

    // ❌ NO SPEECH
    recognition.onnomatch = function() {
        alert("No matching speech found ❌");
    };

    // ❌ ERROR HANDLING
    recognition.onerror = function(event) {

        if (event.error === "no-speech") {
            alert("No speech detected ❌ Speak louder");
        }
        else if (event.error === "audio-capture") {
            alert("Microphone not working ❌");
        }
        else if (event.error === "not-allowed") {
            alert("Microphone permission denied ❌");
        }
        else {
            alert("Voice error: " + event.error);
        }

        mic.classList.remove("active");
    };

    // ✅ END
    recognition.onend = function() {
        mic.classList.remove("active");
    };
}
function toggleClear() {
    let input = document.getElementById("search");
    document.querySelector(".clear").style.display = input.value ? "inline" : "none";
}

function clearSearch() {
    document.getElementById("search").value = "";
    searchFish();
}
function applySort() {

    let value = document.getElementById("sortSelect").value;
    let cards = document.querySelectorAll(".card");

    // RESET
    cards.forEach(card => card.style.display = "block");
	// 🆕 0. NEW ARRIVAL
if (value === "new") {

    cards.forEach(card => {

        let stallId = card.getAttribute("onclick").match(/'(.*?)'/)[1];

        let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

        let hasNewFish = storedMenu.some(item =>
            item.type === "fish" &&
            item.createdAt &&
            (Date.now() - item.createdAt < 86400000)
        );

        console.log("FINAL CHECK:", stallId, hasNewFish);

        card.style.display = hasNewFish ? "block" : "none";
    });
}
    // ⭐ 1. TOP RATED
    if (value === "top") {

        cards.forEach(card => {
            let rating = parseFloat(card.getAttribute("data-rating"));

            if (rating < 4.5) {
                card.style.display = "none";
            }
        });
    }

    // 🐟 2. SHOW ONLY FISH
if (value === "fish") {

    cards.forEach(card => {

        let stallId = card.getAttribute("data-id");

        let defaultMenu = menuData[stallId] || [];
        let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

        let allItems = [...defaultMenu, ...storedMenu];

        let hasFish = allItems.some(item => item.type === "fish");

        card.style.display = hasFish ? "block" : "none";
    });
}

if (value === "crabs") {

    cards.forEach(card => {

        let stallId = card.getAttribute("data-id");

        let defaultMenu = menuData[stallId] || [];
        let storedMenu = JSON.parse(localStorage.getItem("menu_" + stallId)) || [];

        let allItems = [...defaultMenu, ...storedMenu];

        let hasCrab = allItems.some(item => item.type === "crab");

        card.style.display = hasCrab ? "block" : "none";
    });
}

    // 🏪 4. SHOW ALL STALLS
    if (value === "stalls") {
        cards.forEach(card => card.style.display = "block");
    }

    // 💰 5. PRICE SORT (LOW → HIGH / HIGH → LOW)
   if (value === "priceLow" || value === "priceHigh") {

    let container = document.getElementById("listings");
    let cardArray = Array.from(cards);

    cardArray.sort((a, b) => {

        let idA = a.getAttribute("onclick").match(/'(.*?)'/)[1];
        let idB = b.getAttribute("onclick").match(/'(.*?)'/)[1];

        // ✅ GET BOTH DEFAULT + STORED MENU
        let defaultA = menuData[idA] || [];
        let storedA = JSON.parse(localStorage.getItem("menu_" + idA)) || [];
        let menuA = [...defaultA, ...storedA];

        let defaultB = menuData[idB] || [];
        let storedB = JSON.parse(localStorage.getItem("menu_" + idB)) || [];
        let menuB = [...defaultB, ...storedB];

        // ✅ GET LOWEST PRICE FROM MENU
        let getPrice = (menu) => {
            if (!menu.length) return 0;

            let prices = menu.map(item =>
                parseInt((item.price || "₹0").replace("₹", "")) || 0
            );

            return Math.min(...prices); // 🔥 lowest price
        };

        let priceA = getPrice(menuA);
        let priceB = getPrice(menuB);

        return value === "priceLow"
            ? priceA - priceB
            : priceB - priceA;
    });

    // 🔥 REORDER UI
    container.innerHTML = "";
    cardArray.forEach(card => container.appendChild(card));
}
}
// 🎯 FILTER + SORT
function applyAllFilters() {

    let input = document.getElementById("search").value.toLowerCase().trim();
    input = input.replace(/[.,!?]/g, "");

    let selectedLocation = document.getElementById("locationSelect").value.toLowerCase().trim();
    let ratingFilter = parseFloat(document.getElementById("ratingSelect").value) || 0;
let topRated = document.getElementById("topRated").checked;

    let cards = document.getElementsByClassName("card");
    let found = false;

    // 🔥 STEP 1: CHECK FULL MATCH FIRST
    let fullMatchFound = false;

    for (let card of cards) {
        let text = (card.textContent || "").toLowerCase();

        if (text.includes(input) && input.length > 3) {
            fullMatchFound = true;
            break;
        }
    }

    // 🔥 STEP 2: APPLY FILTER
    for (let card of cards) {

        let text = (card.textContent || "").toLowerCase();
        let location = (card.getAttribute("data-location") || "").toLowerCase();
	let cardRating = parseFloat(card.getAttribute("data-rating")) || 0;

// ⭐ RATING FILTER
let matchRating = cardRating >= ratingFilter;

// ⭐ TOP RATED
if (topRated && cardRating < 4.5) {
    matchRating = false;
}
        let matchSearch = false;

        if (fullMatchFound) {
            // ✅ STRICT MATCH
            matchSearch = text.includes(input);
        } else {
            // ✅ PARTIAL MATCH
            let words = input.split(" ");
            matchSearch = input === "" || words.some(word => text.includes(word));
        }

        // 📍 LOCATION FILTER
        let matchLocation = selectedLocation === "all" || location === selectedLocation;

        let show = matchSearch && matchLocation && matchRating;

        card.style.display = show ? "block" : "none";

        if (show) found = true;
    }

    document.getElementById("noResult").style.display = found ? "none" : "block";
}
function changeLanguage() {
    let lang = document.getElementById("languageSelect").value;

    if (lang === "kn") document.getElementById("title").innerText = "🐟 ಸೀ ಟು ಸ್ಕ್ರೀನ್";
    else if (lang === "hi") document.getElementById("title").innerText = "🐟 सी टू स्क्रीन";
    else if (lang === "ur") document.getElementById("title").innerText = "🐟 سی ٹو اسکرین";
    else document.getElementById("title").innerText = "🐟 Sea2Screen";
}
function filterByLocation() {

    let selected = document.getElementById("locationSelect").value.toLowerCase().trim();
    let cards = document.getElementsByClassName("card");

    for (let card of cards) {

        let location = card.getAttribute("data-location").toLowerCase().trim();

        if (selected === "all" || location === selected) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}
// 👤 PROFILE
function setupProfile() {

    let loginType = localStorage.getItem("loginType");

    let profileBox = document.getElementById("profileBox");
    let letter = document.getElementById("profileLetter");
    let role = document.getElementById("profileRole");

    if (loginType === "user" && localStorage.getItem("isLoggedIn") === "true") {
        let userId = localStorage.getItem("userId");
        letter.innerText = userId.charAt(0).toUpperCase();
        role.innerText = "User";
        profileBox.style.display = "flex";
    }

    else if (loginType === "admin" && localStorage.getItem("adminLoggedIn") === "true") {
        let adminUser = localStorage.getItem("adminUser");
        letter.innerText = adminUser.charAt(0).toUpperCase();
        role.innerText = "Admin";
        profileBox.style.display = "flex";
    }

    // ✅ ADD THIS BLOCK HERE
    else if (loginType === "superadmin" && localStorage.getItem("superAdminLoggedIn") === "true") {
        letter.innerText = "S";
        role.innerText = "Super Admin";
        profileBox.style.display = "flex";
    }

    else {
        profileBox.style.display = "none";
    }
}


// 🐟 LOAD STALLS (FINAL FIX)
function loadStalls() {
    let isSuperAdmin = localStorage.getItem("loginType") === "superadmin";
    let container = document.getElementById("listings");
    if (!container) return;

   

    for (let key in localStorage) {

        if (key.startsWith("stall_")) {

            let stall = JSON.parse(localStorage.getItem(key));
            if (!stall || !stall.id) continue;
		let loginType = localStorage.getItem("loginType");

// 👤 USER → only approved
if (loginType === "user" && stall.status !== "approved") continue;

// 👑 SUPER ADMIN → sees everything (no filter)

// 🔒 Hide inactive for everyone except super admin
if (stall.active === false && loginType !== "superadmin") continue;
	   
            // ✅ FIX: check using ID
            if (document.querySelector(`[data-id="${stall.id}"]`)) continue;

            let card = document.createElement("div");
            card.className = "card";
	let statusText = "";

if (loginType === "admin" || loginType === "superadmin") {
    statusText = `<p><strong>Status:</strong> ${
        stall.status === "pending" ? "⏳ Pending" : "✅ Approved"
    }</p>`;
}

            let loc = (stall.location || "unknown").toLowerCase();

            let rating = stall.rating || 4.0; // default

card.setAttribute("data-location", loc);
card.setAttribute("data-id", stall.id);
card.setAttribute("data-rating", rating);

           card.innerHTML = `
    <img src="${stall.image || ''}">
    <h2>${stall.name}</h2>
    <p>📍 ${stall.location || 'Not available'}</p>
    <p>⭐ 4.0</p>
    <p class="open">🟢 Open until ${stall["open until"] || 'N/A'}</p>

    <p>📞 <a href="tel:${stall.phone || ''}">Call</a></p>
    <a href="${stall.map || '#'}" target="_blank">📍 Map</a>

    <a href="${stall.whatsappLink || '#'}" target="_blank">
        <button class="order-btn">WhatsApp</button>
    </a>

    ${statusText}
`;

	  if (isSuperAdmin) {
    let toggleBtn = document.createElement("button");

    // 🔥 Set button text based on status
    toggleBtn.innerText = stall.active === false ? "Unhide ✅" : "Hide ❌";

    toggleBtn.onclick = function(e) {
        e.stopPropagation();

        // 🔄 Toggle active state
        stall.active = stall.active === false ? true : false;

        localStorage.setItem("stall_" + stall.id, JSON.stringify(stall));

        location.reload(); // refresh UI
    };

    card.appendChild(toggleBtn);
   let loginType = localStorage.getItem("loginType");
let adminUser = localStorage.getItem("adminUser");

// 👑 SUPER ADMIN → delete any
if (loginType === "superadmin") {

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete 🗑️";

    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        localStorage.removeItem("stall_" + stall.id);
        location.reload();
    };

    card.appendChild(deleteBtn);
}

// 🧑‍💼 ADMIN → only own
else if (loginType === "admin" && stall.createdBy === adminUser) {

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete 🗑️";

    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        localStorage.removeItem("stall_" + stall.id);
        location.reload();
    };

    card.appendChild(deleteBtn);
}
}

if (stall.active === false) {
    card.style.opacity = "0.5";
}
if (stall.status === "pending") {
    card.style.border = "2px solid orange";
}
if (isSuperAdmin && stall.status === "pending") {
    let approveBtn = document.createElement("button");
    approveBtn.innerText = "Approve ✅";

    approveBtn.onclick = function(e) {
        e.stopPropagation();

        stall.status = "approved";
        localStorage.setItem("stall_" + stall.id, JSON.stringify(stall));

        location.reload();
    };

    card.appendChild(approveBtn);
}
            // ✅ FIX: store ID
            card.addEventListener("click", function (e) {

                if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;

                localStorage.setItem("selectedStall", stall.id);
                window.location.href = "stall.html";
            });

            container.appendChild(card);
        }

    }
}


// 🔄 LOAD
window.addEventListener("load", function () {
    setupProfile();
    loadStalls();
});


// 🔗 NAVIGATION
function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("superAdminLoggedIn");
    localStorage.removeItem("loginType");

    alert("Logged out successfully ✅");
    window.location.href = "login.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

function goHome() {
    window.location.href = "index.html";
}

// ✅ FIXED
function openStall(id) {

    let value = document.getElementById("sortSelect").value;

    localStorage.setItem("selectedStall", id);

    if (value === "fish") {
        localStorage.setItem("filterType", "fish");
    }

    window.location.href = "stall.html";
}

function goToManage() {
    window.location.href = "manage_stalls.html";
}

function openLogo() {
    document.getElementById("logoPopup").classList.add("active");
}

function closeLogo() {
    document.getElementById("logoPopup").classList.remove("active");
}