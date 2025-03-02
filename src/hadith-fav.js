const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const API_URL = "https://hadithapi.com/api/hadiths";

// ✅ Load Favourite Hadiths
async function loadFavourites() {
    let favourites = JSON.parse(localStorage.getItem("favouriteHadiths")) || [];

    if (favourites.length === 0) {
        document.getElementById("fav-hadith-list").innerHTML = `<p>⚠️ No Favourite Hadiths Yet.</p>`;
        return;
    }

    let container = document.getElementById("fav-hadith-list");
    container.innerHTML = ""; // Clear previous content

    for (let hadithId of favourites) {
        try {
            // ✅ FIX: Correct API call
            const response = await fetch(`${API_URL}?apiKey=${API_KEY}&id=${hadithId}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("📌 Favourite Hadith:", data); // Debugging

            const hadith = data.hadiths?.data?.find(h => h.id == hadithId); // ✅ FIX: Proper extraction

            if (!hadith) {
                console.warn(`⚠️ Hadith ID ${hadithId} not found.`);
                continue; // Skip to the next one
            }

            let div = document.createElement("div");
            div.className = "hadith-item";
            div.innerHTML = `
                <h3>📜 Hadith #${hadith.hadithNumber || hadith.id}</h3>
                <p><strong>📖 Chapter (English):</strong> ${hadith.headingEnglish || "No Data"}</p>
                <p><strong>✍️ Writer:</strong> ${hadith.book?.writerName || "Unknown"}</p>
                <button onclick="removeFromFavourites(${hadith.id})">❌ Remove</button>
            `;
            container.appendChild(div);
        } catch (error) {
            console.error("❌ Fetch error:", error.message);
        }
    }
}

// ✅ Remove Hadith from Favourites
function removeFromFavourites(hadithId) {
    let favourites = JSON.parse(localStorage.getItem("favouriteHadiths")) || [];
    favourites = favourites.filter(id => id !== hadithId);
    localStorage.setItem("favouriteHadiths", JSON.stringify(favourites));
    alert("❌ Hadith removed from Favourites.");
    loadFavourites(); // Refresh list
}

// ✅ Load Favourites on Page Load
document.addEventListener("DOMContentLoaded", loadFavourites);
