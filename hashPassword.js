// Import the bcrypt module
const bcrypt = require("bcryptjs");

// Hash the password with a salt rounds of 10
bcrypt.hash("@@@081Dessy", 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  console.log("Hashed Password:", hash);

  // Example: Compare the plain password with the hashed password
  bcrypt.compare("@@@081Dessy", hash, (err, result) => {
    if (err) {
      console.error("Error comparing password:", err);
      return;
    }
    console.log("Password match result:", result);
  });
});
