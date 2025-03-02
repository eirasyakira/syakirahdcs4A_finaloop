const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const API_URL = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}`;

let allHadiths = []; // ✅ Declare globally

async function fetchHadiths() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 Full API Response:", data); // Debugging

        // ✅ Store hadiths globally
        allHadiths = data.hadiths?.data || [];

        if (!Array.isArray(allHadiths) || allHadiths.length === 0) {
            throw new Error("❌ No hadiths found in the API response.");
        }

        displayHadiths(allHadiths); // ✅ Display all hadiths on page load
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        document.getElementById("hadith-list").innerHTML = `<p>Error loading Hadiths. Please try again.</p>`;
    }
}

// ✅ Display Hadiths
function displayHadiths(hadiths) {
    let container = document.getElementById("hadith-list");
    container.innerHTML = ""; // Clear previous content

    hadiths.forEach(hadith => {
        let div = document.createElement("div");
        div.className = "hadith-item";
        div.innerHTML = `
            <h3>📜 Hadith #${hadith.id}</h3>
            <p><strong>📖 Book Name:</strong> ${hadith.book?.bookName || "Unknown"}</p>
            <p><strong>📌 English Hadith:</strong> ${hadith.headingEnglish || "No Data"}</p>
            <p><strong>📖 Arabic Chapter:</strong> ${hadith.chapter?.chapterArabic || "No Data"}</p>
            <button onclick="viewHadith(${hadith.id})">📜 View Hadith</button>
        `;
        container.appendChild(div);
    });
}

// ✅ View Hadith Details
function viewHadith(hadithId) {
    window.location.href = `hadith-detail.html?id=${hadithId}`;
}

// ✅ Load Hadiths on Page Load
document.addEventListener("DOMContentLoaded", fetchHadiths);

// ✅ Search Function
function searchHadith() {
    let query = document.getElementById("searchInput").value.toLowerCase();

    if (allHadiths.length === 0) {
        console.warn("❌ Hadith data is not loaded yet.");
        return;
    }

    let results = allHadiths.filter(hadith => 
        (hadith.hadithEnglish && hadith.hadithEnglish.toLowerCase().includes(query)) || 
        (hadith.hadithArabic && hadith.hadithArabic.toLowerCase().includes(query)) ||
        (hadith.englishNarrator && hadith.englishNarrator.toLowerCase().includes(query))
    );

    displaySearchResults(results);
}

// ✅ Display Search Results
function displaySearchResults(hadiths) {
    const resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = `<h3>🔍 Search Results</h3>`;

    if (hadiths.length === 0) {
        resultsDiv.innerHTML += `<p>No Hadiths found for your search.</p>`;
        return;
    }

    hadiths.forEach(hadith => {
        const hadithItem = document.createElement("div");
        hadithItem.className = "search-result-item"; // Apply new CSS class
        hadithItem.innerHTML = `
            <p><strong>📖 Book Name:</strong> ${hadith.book?.bookName || "Unknown"}</p>
            <p><strong>English Narrator:</strong> ${hadith.englishNarrator || "Unknown"}</p>
            <p><strong>Hadith (English):</strong> ${hadith.hadithEnglish || "No Data"}</p>
            <p><strong>Hadith (Arabic):</strong> ${hadith.hadithArabic || "No Data"}</p>
        `;
        resultsDiv.appendChild(hadithItem);
    });
}
