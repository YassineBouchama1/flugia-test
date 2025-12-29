(async function() {
 
    const JSON_URL = "https://cdn.jsdelivr.net/gh/YassineBouchama1/flugia-test@main/config.json";
    const LIB_URL = "https://cdn.n8nchatui.com/v1/pole-embed-yard.js";

    try {
        console.log("Flugia: Fetching dynamic configuration...");

        // 2. Fetch your JSON config
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Failed to load config.json");
        const configData = await response.json();

        // 3. Import the Chatbot library
        const { default: Chatbot } = await import(LIB_URL);

        // 4. Initialize using the data from config.json
        Chatbot.init({
            n8nChatUrl: configData.n8nChatUrl,
            metadata: configData.metadata,
            theme: configData.theme
        });

        console.log("Flugia: Chatbot initialized successfully!");

    } catch (error) {
        console.error("Flugia Loader Error:", error);
    }
})();
