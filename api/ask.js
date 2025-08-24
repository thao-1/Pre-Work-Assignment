export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed"});
    }

    try {
        const { question } = req.body || {};
        if (!question) {
            return res.status(400).json({ error: "Missing 'question' in request body" });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: "OPENAI_API_KEY is not set on the server" });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: question }],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            return res.status(response.status).json({ error: err });
        }

        const data = await response.json();
        res.status(200).json({ answer: data.choices?.[0]?.message?.content ?? "" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}