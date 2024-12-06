const bcrypt = require("bcrypt");
const readline = require("readline");

// Create an interface to read input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Simulate a stored hashed password (this would normally come from a database)
const storedPassword = "userPassword123"; // This is the password we want to hash and compare
const saltRounds = 10;

// Hash the password and store the result
bcrypt.hash(storedPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  console.log("Stored password hash:", hashedPassword);

  // Prompt the user to enter the password for verification
  rl.question("Please enter your password to verify: ", (inputPassword) => {
    // Compare the entered password with the stored hash
    bcrypt.compare(inputPassword, hashedPassword, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
      } else if (result) {
        console.log("Password is correct!");
      } else {
        console.log("Incorrect password.");
      }

      // Close the readline interface
      rl.close();
    });
  });
});
