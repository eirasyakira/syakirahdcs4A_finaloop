const API_KEY = "$2y$10$imRVx8ZhnDdBGcKCABQ95ePS8VhQ6gFzUnWyIbR4xeYsGFDrGcnvC";
const HADITHS_API_URL = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}`;

async function fetchHadiths() {
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get("chapter");

    if (!chapterId) {
        document.getElementById("hadith-list").innerHTML = `<p>⚠️ Invalid Chapter ID.</p>`;
        return;
    }

    try {
        const response = await fetch(`${HADITHS_API_URL}&chapter=${chapterId}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log("📌 Hadiths in Chapter:", data);

        const hadiths = data.hadiths?.data || [];
        if (!Array.isArray(hadiths) || hadiths.length === 0) {
            throw new Error("❌ No hadiths found.");
        }

        displayHadiths(hadiths);
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        document.getElementById("hadith-list").innerHTML = `<p>Error loading Hadiths. Please try again.</p>`;
    }
}

function displayHadiths(hadiths) {
    let container = document.getElementById("hadith-list");
    container.innerHTML = "";

    hadiths.forEach(hadith => {
        let div = document.createElement("div");
        div.className = "hadith-item";
        div.innerHTML = `
            <h3>📜 Hadith #${hadith.id}</h3>
            <p><strong>📘 Book Name:</strong> ${hadith.book?.bookName || "Unknown"}</p>
            <p><strong>📍 Chapter:</strong> ${hadith.chapter?.chapterEnglish || "No Data"}</p>
            <p><strong>📝 Hadith:</strong> ${hadith.hadithEnglish}</p>
            <button onclick="viewHadithDetail(${hadith.id})">📜 View Detail</button>
        `;
        container.appendChild(div);
    });
}

// ✅ Function to redirect to hadith-detail.html with Hadith ID
function viewHadithDetail(hadithId) {
    window.location.href = `hadith-detail.html?id=${hadithId}`;
}

// ✅ Load Hadiths when page loads
document.addEventListener("DOMContentLoaded", fetchHadiths);
