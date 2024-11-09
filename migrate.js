const MongoClient = require("mongodb").MongoClient;
const mysql = require("mysql2/promise");

// MongoDB Atlas connection settings
const mongoUrl =
  "mongodb+srv://dessysattic_admin:dessysatticAdmin@cluster0-dsy.aq4bh.mongodb.net/dessysattic_admin?retryWrites=true&w=majority&appName=Cluster0-DSY";
const mongoDbName = "dessysattic_admin"; // Replace with your actual database name

// MySQL connection settings
const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "@@@081Gps",
  database: "dessysattic",
};

async function migrate() {
  try {
    // Connect to MongoDB Atlas
    const mongoClient = await MongoClient.connect(mongoUrl);
    const mongoDb = mongoClient.db(mongoDbName);

    // Connect to MySQL
    const mysqlConnection = await mysql.createConnection(mysqlConfig);

    // Get all collections in the MongoDB database
    const collections = await mongoDb.collections();

    for (const collection of collections) {
      const collectionName = collection.collectionName;
      const data = await collection.find().toArray();

      if (data.length === 0) {
        console.log(`Skipping empty collection: ${collectionName}`);
        continue;
      }

      // Dynamically extract field names from the first document in the collection
      const fields = Object.keys(data[0]);
      const mysqlFields = fields.map((field) => `\`${field}\` TEXT`).join(", ");

      // Create a MySQL table dynamically based on the fields of the collection
      await mysqlConnection.execute(`
        CREATE TABLE IF NOT EXISTS \`${collectionName}\` (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ${mysqlFields}
        )
      `);

      // Insert MongoDB data into the MySQL table
      for (const item of data) {
        const values = fields.map((field) => item[field] || null);
        const placeholders = fields.map(() => "?").join(", ");

        await mysqlConnection.execute(
          `INSERT INTO \`${collectionName}\` (${fields
            .map((f) => `\`${f}\``)
            .join(", ")}) VALUES (${placeholders})`,
          values
        );
      }

      console.log(`Data migration for collection ${collectionName} complete.`);
    }

    // Close connections
    await mongoClient.close();
    await mysqlConnection.end();
    console.log("All collections migrated successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

migrate().catch(console.error);
