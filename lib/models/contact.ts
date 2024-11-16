import { query } from "@/lib/database";

// Define the attributes for the Contact interface
interface ContactAttributes {
  id: number;
  name: string;
  email: string;
  message: string;
  date: Date;
}

// Initialize the Contact table if it doesn't exist
export const initializeContactTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        message TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await query({ query: createTableQuery });
    console.log("Contact table initialized successfully.");
  } catch (error) {
    console.error("Error initializing the Contact table:", error);
  }
};

// Create a new contact
export const createContact = async (
  contactData: Omit<ContactAttributes, "id" | "date">
) => {
  const { name, email, message } = contactData;
  const insertQuery = `
    INSERT INTO contacts (name, email, message, date)
    VALUES (?, ?, ?, NOW())
  `;

  try {
    const result = await query({
      query: insertQuery,
      values: [name, email, message],
    });
    return result;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

// Fetch all contacts
export const getAllContacts = async (): Promise<ContactAttributes[]> => {
  const selectQuery = `SELECT * FROM contacts`;
  try {
    const result = await query({ query: selectQuery });

    // Ensure the result is an array of RowDataPacket and cast to ContactAttributes[]
    if (Array.isArray(result)) {
      return result as ContactAttributes[];
    }

    // Return an empty array if result is not an array
    return [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// Fetch a contact by ID
export const getContactById = async (id: number): Promise<ContactAttributes | null> => {
  const selectQuery = `SELECT * FROM contacts WHERE id = ?`;
  try {
    const result = await query({ query: selectQuery, values: [id] });

    // If the result is an array, return the first element (contact)
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as ContactAttributes; 
    }

    // Return null if no contact is found
    return null;
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    throw error;
  }
};


// Delete a contact by ID
export const deleteContact = async (id: number) => {
  const deleteQuery = `DELETE FROM contacts WHERE id = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

export default {
  initializeContactTable,
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
};
