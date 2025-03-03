const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const API_URL = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}`;

let allHadiths = [];

// ✅ Fetch Hadiths
async function fetchHadiths() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allHadiths = data.hadiths?.data || [];

        populateCategories();
        displayHadiths(allHadiths);
    } catch (error) {
        console.error("Error fetching Hadiths:", error);
    }
}

// ✅ Populate Reflection Categories
function populateCategories() {
    let categoryDropdown = document.getElementById("reflection-category");
    
    // Check if the dropdown exists
    if (!categoryDropdown) {
        console.error("Dropdown element not found. Ensure <select id='reflection-category'> exists in HTML.");
        return;
    }

    let categories = new Set(allHadiths.map(h => h.headingEnglish));

    // Clear previous options before adding new ones
    categoryDropdown.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });
}

// ✅ Filter by Category
function filterByCategory() {
    let categoryDropdown = document.getElementById("reflection-category");
    
    // Ensure dropdown exists before filtering
    if (!categoryDropdown) return;

    let selectedCategory = categoryDropdown.value;
    let filteredHadiths = selectedCategory === "all" ? allHadiths : allHadiths.filter(h => h.headingEnglish === selectedCategory);

    displayHadiths(filteredHadiths);
}

// ✅ Display Hadiths
function displayHadiths(hadiths) {
    let container = document.getElementById("hadith-list");
    
    // Ensure container exists before displaying hadiths
    if (!container) {
        console.error("Hadith container element not found.");
        return;
    }

    container.innerHTML = "";

    hadiths.forEach(hadith => {
        let div = document.createElement("div");
        div.className = "hadith-item";
        div.innerHTML = `
            <h3>📜 ${hadith.headingEnglish}</h3>
            <p><strong>📖 Book:</strong> ${hadith.book?.bookName || "Unknown"}</p>
            <p>${hadith.hadithEnglish || "No Hadith Available"}</p>
        `;
        container.appendChild(div);
    });
}

// ✅ Ensure DOM is Loaded Before Running Script
document.addEventListener("DOMContentLoaded", () => {
    let categoryDropdown = document.getElementById("reflection-category");

    if (!categoryDropdown) {
        console.error("Dropdown element not found on page load.");
        return;
    }

    fetchHadiths();
    categoryDropdown.addEventListener("change", filterByCategory);
});
