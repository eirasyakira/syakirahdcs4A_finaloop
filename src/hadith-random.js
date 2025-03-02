const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const hadithApiUrl = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}`;

async function fetchRandomHadiths() {
    try {
        const response = await fetch(hadithApiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data); // Debugging
        console.log("Hadiths Object:", data.hadiths); // Debugging

        // Extract hadiths from `data.hadiths.data`
        const hadiths = data.hadiths?.data || []; 

        if (!Array.isArray(hadiths) || hadiths.length === 0) {
            throw new Error("No Hadiths found in the API response.");
        }

        const randomHadiths = getRandomHadiths(hadiths, 4);
        displayRandomHadiths(randomHadiths);
    } catch (error) {
        console.error("Fetch error:", error.message);
        document.getElementById("random-hadith-display").innerHTML = `
            <p style="color: red;">Error fetching Hadiths: ${error.message}</p>`;
    }
}

// ✅ Get 4 random Hadiths
function getRandomHadiths(hadiths, count) {
    if (!Array.isArray(hadiths)) return [];
    return hadiths.sort(() => 0.5 - Math.random()).slice(0, count);
}

// ✅ Display Hadiths in 2 Columns (2 per row)
function displayRandomHadiths(hadiths) {
    const randomHadithDisplay = document.getElementById("random-hadith-display");
    randomHadithDisplay.innerHTML = "<h3>📖 Random Hadiths</h3>";

    let row;
    hadiths.forEach((hadith, index) => {
        if (index % 2 === 0) {
            row = document.createElement("div");
            row.className = "hadith-row";
            randomHadithDisplay.appendChild(row);
        }

        const hadithItem = document.createElement("div");
        hadithItem.className = "hadith-item";
        hadithItem.innerHTML = `
            <p><strong>📜 Chapter ID:</strong> ${hadith.id}</p>
            <p><strong>📖 Volume:</strong> ${hadith.volume}</p>
            <p><strong>🔢 Hadith Number:</strong> ${hadith.hadithNumber}</p>
            <p><strong>🗣 English Narrator:</strong> ${hadith.englishNarrator}</p>
            <p><strong>📄 Hadith (English):</strong> ${hadith.hadithEnglish}</p>
            <p><strong>📜 Hadith (Arabic):</strong> ${hadith.hadithArabic}</p>
            <p><strong>📚 Book Slug:</strong> ${hadith.bookSlug}</p>
            <p><strong>✅ Status:</strong> ${hadith.status}</p>
        `;
        row.appendChild(hadithItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchRandomHadiths();
});
