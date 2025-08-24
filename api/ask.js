export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed "});
    }

    try {
        const { question } = req.body;

        const response = await fetch ("https://api.openai.cpm/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ProcessingInstruction.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: question }]
            })
        });
        
        const data = await response.json();
        res.status(200).json({answer: data.choices[0].message.content });       
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
}