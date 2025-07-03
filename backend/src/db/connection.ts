import { connect, disconnect } from "mongoose";

// Establishes a connection to the MongoDB database using the URI from environment variables
async function connectToDatabase() {
    try {
        // Connect to MongoDB using the URI from environment variables
        await connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not Connect To MongoDB");
    }
}

// Gracefully disconnects from the MongoDB database
async function disconnectFromDatabase() {
    try {
        // Disconnect from MongoDB
        await disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect From MongoDB");
    }
}

export { connectToDatabase, disconnectFromDatabase }
