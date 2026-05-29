require("dotenv").config({ path: ".env" });
const { notifyNewBooking } = require("./lib/notifications");

async function run() {
    try {
        console.log("Mocking a booking...");
        await notifyNewBooking(
            {
                id: "mock123",
                customerName: "Test Guest",
                customerEmail: "tapan.workmail@gmail.com",
                customerPhone: "8133819414",
                checkIn: new Date().toISOString(),
                checkOut: new Date(Date.now() + 86400000).toISOString(),
            },
            { name: "Mock Room", price: 1000 }
        );
        console.log("Done successfully.");
    } catch (err) {
        console.error("FATAL ERROR IN NOTIFICATIONS:", err);
    }
}

run();
