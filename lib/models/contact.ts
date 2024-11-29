import { query } from "@/lib/database";

// Define the attributes for the Contact interface
interface ContactAttributes {
  id: number;
  name: string;
  email: string;
  message: string;
  date: Date;
}

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
  createContact,
  getAllContacts,
  deleteContact,
};
