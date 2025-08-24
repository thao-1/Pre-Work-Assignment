const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const answerDiv = document.getElementById("answer");


// Fetch breed info + image

async function searchBreed(query) {
    try {
        const breeds = await fetch("https://api.thedogapi.com/v1/breeds")
            .then(res => res.json());
        
        const match = breeds.find(b => b.name.toLowerCase().includes(query.toLowerCase()));
        if (!match) {
            resultDiv.innerHTML = `<p>Breed not found. Try again.</p>`;
            return;
        }

        const image = await fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${match.id}`)
            .then(res => res.json());

        resultDiv.innerHTML = `
          <h3>${match.name}</h3>
          <img src="${image[0]?.url}" alt="${match.name}" />
          <p><strong>Temperament:</strong> ${match.temperament || "N/A"}</p>
          <p><strong>Life span:</strong> ${match.life_span}</p>
          <p><strong>Weight:</strong> ${match.weight.metric} kg</p>
          <p><strong>Height:</strong> ${match.height.metric} cm</p>
        `;
    }   catch (err) {
        resultDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
}

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) searchBreed(query);
});

// Ask OpenAI backend

async function askAI(question) {
    const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    const data = await res.json();
    return data.answer || "Sorry, I couldn't find an answer";
}

askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (!question) return;
    answerDiv.innerHTML = "Thinking....";
    const response = await askAI(question);
    answerDiv.innerHTML = response;
});