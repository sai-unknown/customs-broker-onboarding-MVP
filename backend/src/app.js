import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is running",
    });
});

export default app;