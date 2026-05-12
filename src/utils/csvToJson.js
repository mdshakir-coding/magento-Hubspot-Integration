import fs from "fs";
import path from "path";

// 1. Define the path to your file
// path.join helps ensure the slashes are correct for your operating system
const filePath = path.join(
  process.cwd(),
  "file",
  "Orders Jan 1 2023 - Apr 17 2026_042026CM_fixed05-07 2.csv"
);

function csvToJson() {
  const csvString = fs.readFileSync(filePath, "utf8");
  // Trim the string to remove extra spaces/newlines at the ends and split into rows
  const lines = csvString.trim().split(/\r?\n/);

  if (lines.length === 0 || lines[0] === "") return [];

  // Get the headers from the first row
  const headers = lines[0].split(",").map((header) => header.trim());
  const result = [];

  // Loop through the remaining rows
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];

    if (!currentLine.trim()) continue; // Skip empty lines

    // Split by commas, but IGNORE commas inside double quotes
    const values = currentLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let value = values[j] ? values[j].trim() : "";

      // Clean up the value by removing surrounding double quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/""/g, '"'); // Also handle escaped quotes
      }

      obj[headers[j]] = value;
    }
    result.push(obj);
  }

  return result;
}

export { csvToJson };
