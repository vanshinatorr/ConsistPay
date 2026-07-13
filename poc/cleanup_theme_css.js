const fs = require("fs");
const path = require("path");

const themePath = path.join(__dirname, "../front-end/src/styles/theme.css");

if (fs.existsSync(themePath)) {
  let content = fs.readFileSync(themePath, "utf8");
  // Replace all instances of ':not(:has(.auth-page))' with empty string
  const originalLength = content.length;
  content = content.replace(/:not\(:has\(\.auth-page\)\)/g, "");
  fs.writeFileSync(themePath, content, "utf8");
  console.log(`Successfully cleaned theme.css. Original length: ${originalLength}, New length: ${content.length}`);
} else {
  console.log("theme.css not found!");
}
