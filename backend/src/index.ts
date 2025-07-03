import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

// Connections and Listeners
// Server configuration constants
const PORT = process.env.PORT || 5000;

// Database connection and server startup sequence
connectToDatabase()
    .then(() => {
        // Start Express server after successful DB connection
        app.listen(PORT, () =>
            console.log("Server Open & Connected To Database")
        );
    })
    .catch(err => console.log(err));
