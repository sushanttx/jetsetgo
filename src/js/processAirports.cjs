// Import necessary libraries: 'fs' for file system operations and 'papaparse' for CSV parsing.
const fs = require('fs');
const Papa = require('papaparse');

// --- Configuration ---
// Define the input and output file paths. Change these if your files have different names.
const CSV_FILE_PATH = '../data/world-airports.csv';
const JSON_OUTPUT_PATH = '../data/allAirports.json';

console.log('🚀 Starting airport data processing...');

try {
  // Read the CSV file content from your disk.
  const csvFileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');

  // Parse the CSV data into a JavaScript object. 'header: true' is key!
  const { data } = Papa.parse(csvFileContent, {
    header: true,       // Treats the first row as headers.
    skipEmptyLines: true, // Ignores any blank lines in the file.
  });

  // Transform the parsed data into the desired format.
  const airports = data.map(row => {
    // Skip rows that don't have an IATA code, as it's a key piece of information.
    if (!row.iata_code) {
      return null;
    }

    // Use a Set to automatically handle duplicate search terms.
    const searchTerms = new Set();

    // Add core identifiers to the search terms.
    searchTerms.add(row.iata_code);
    searchTerms.add(row.municipality);
    searchTerms.add(row.country_name);

    // Add individual words from the airport's full name.
    if (row.name) {
      row.name.split(' ').forEach(term => term && searchTerms.add(term));
    }

    // Add terms from the 'keywords' column, if they exist.
    if (row.keywords) {
      row.keywords.split(',').forEach(keyword => {
        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) searchTerms.add(trimmedKeyword);
      });
    }

    // Return the final, structured object for this airport.
    return {
      code: row.iata_code,
      name: row.name,
      city: row.municipality,
      country: row.country_name,
      searchTerms: [...searchTerms].filter(Boolean), // Convert Set to array and remove empty values.
    };
  }).filter(Boolean); // Cleans up any null entries from skipped rows.

  // Prepare the final JSON structure.
  const finalJsonOutput = { airports };

  // Write the formatted JSON data to the output file.
  // JSON.stringify with a '2' for spacing makes the file human-readable.
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(finalJsonOutput, null, 2));

  console.log(`✅ Success! Processed ${airports.length} airports.`);
  console.log(`🌍 Your new file has been saved as ${JSON_OUTPUT_PATH}`);

} catch (error) {
  // Handle potential errors, like the CSV file not being found.
  console.error('❌ An error occurred:', error.message);
}