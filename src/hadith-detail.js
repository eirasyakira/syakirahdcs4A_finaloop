const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const API_URL = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}`;

// ✅ Fetch a Single Hadith by ID
async function fetchHadithDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const hadithId = urlParams.get("id");

    if (!hadithId) {
        document.getElementById("hadith-detail-container").innerHTML = `<p>⚠️ Invalid Hadith ID.</p>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}&id=${hadithId}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 Hadith Detail API Response:", data);

        const hadith = data.hadiths?.data?.find(h => h.id == hadithId);

        if (!hadith) {
            throw new Error("❌ Hadith not found.");
        }

        displayHadithDetail(hadith);
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        document.getElementById("hadith-detail-container").innerHTML = `<p>⚠️ Error loading Hadith.</p>`;
    }
}

// ✅ Display the Hadith Detail
function displayHadithDetail(hadith) {
    let container = document.getElementById("hadith-detail-container");
    container.innerHTML = `
        <div class="hadith-detail-box">
            <h3>📜 Hadith #${hadith.hadithNumber || hadith.id}</h2>
            <h1>${hadith.headingEnglish}</h1>
            <p><strong>📚 Volume:</strong> ${hadith.volume || "Unknown"}</p>
            <p><strong>📖 Book Name:</strong> ${hadith.book?.bookName || "Unknown"}</p>
            <p><strong>📖 Chapter:</strong> ${hadith.chapter?.chapterEnglish || "N/A"}</p>
            <p><strong>📍 Narrator:</strong> ${hadith.englishNarrator || "Unknown"}</p>
            <p><strong>📜 Hadith (English):</strong> ${hadith.hadithEnglish}</p>
            <p><strong>📖 Hadith (Arabic):</strong> ${hadith.hadithArabic || "N/A"}</p>
            <p><strong>✅ Status:</strong> ${hadith.status || "Unknown"}</p>
            
            <div class="buttons">
                <button onclick="addToFavourites(${hadith.id})">⭐ Add to Favourites</button>
                <button onclick="window.history.back()">🔙 Go Back</button>
            </div>
        </div>
    `;
}

// ✅ Function to Add Hadith to Favourites
function addToFavourites(hadithId) {
    let favourites = JSON.parse(localStorage.getItem("favouriteHadiths")) || [];

    if (!favourites.includes(hadithId)) {
        favourites.push(hadithId);
        localStorage.setItem("favouriteHadiths", JSON.stringify(favourites));
        alert("✅ Hadith added to Favourites!");
    } else {
        alert("⚠️ Hadith already in Favourites.");
    }
}

// ✅ Load Hadith Detail on Page Load
document.addEventListener("DOMContentLoaded", fetchHadithDetail);
