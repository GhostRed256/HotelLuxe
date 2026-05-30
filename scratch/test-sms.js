require("dotenv").config({ path: ".env" });

async function testSMS() {
    const apiKey = process.env.FAST2SMS_API_KEY;
    console.log("Key:", apiKey.slice(0, 5) + "...");
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
            "authorization": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            route: "v3",
            sender_id: "FTWSMS",
            message: "Test message",
            language: "english",
            flash: 0,
            numbers: "8133819414",
        }),
    });
    const text = await response.text();
    console.log("F2S Response:", text);
}
testSMS();
