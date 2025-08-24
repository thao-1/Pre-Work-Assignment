import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        server: {
            port: 3000
        },
        plugins: [
            {
                name: "api-ask-middleware",
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        if (req.url === "/api/ask") {
                            if (req.method !== "POST") {
                                res.statusCode = 405;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ error: "Method not allowed" }));
                                return;
                            }

                            let body = "";
                            req.on("data", (chunk) => (body += chunk));
                            req.on("end", async () => {
                                try {
                                    const { question } = JSON.parse(body || "{}");
                                    const response = await fetch("https://api.openai.com/v1/chat/completions", {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            model: "gpt-4o-mini",
                                            messages: [{ role: "user", content: question }],
                                        }),
                                    });

                                    const data = await response.json();
                                    res.setHeader("Content-Type", "application/json");
                                    res.end(JSON.stringify({ answer: data.choices?.[0]?.message?.content ?? "" }));
                                } catch (e) {
                                    res.statusCode = 500;
                                    res.setHeader("Content-Type", "application/json");
                                    res.end(JSON.stringify({ error: e.message }));
                                }
                            });
                            return;
                        }

                        next();
                    });
                },
            },
        ],
    };
});