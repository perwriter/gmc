# GMC Verification Tool

This project provides an API to verify GMC (General Medical Council) registration numbers. The tool uses **Playwright** to scrape the GMC website and extract details about a given GMC registration number, including the registrant's name and GMC number.

## Features

- **API-based Verification**: A POST API endpoint to verify GMC numbers.
- **Scraping with Playwright**: Uses Playwright to automate the process of scraping the GMC website.
- **Caching**: Stores results in memory for a faster response on subsequent requests for the same GMC number.
- **Error Handling**: Proper error handling and status codes for various edge cases, such as missing GMC numbers or scraping failures.

## Requirements

- **Node.js** (v16 or above)
- **Playwright** (v1.18 or above)
- **Next.js** (v12 or above)

## Installation

Follow these steps to set up the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/perwriter/gmc.git
   cd gmc-verification-tool
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   Playwright requires specific browser binaries to function properly. You can install them using:

   ```bash
   npx playwright install
   ```

## Usage

### Running the API

To run the project locally:

1. Start the Next.js server:

   ```bash
   npm run dev
   ```

   This will start the server on `http://localhost:3000`.

2. The API endpoint is available at:

   ```
   POST /api/verify
   ```

   You can send a POST request to this endpoint with a JSON body containing the `gmcNumber` you want to verify. For example:

   ```json
   {
     "gmcNumber": "1234567"
   }
   ```

   The response will contain the registrant's name and GMC number:

   ```json
   {
     "registrantNameId": "Dr. John Doe",
     "gmcNumberId": "1234567"
   }
   ```

   If the GMC number is invalid or not found, the API will return an error:

   ```json
   {
     "error": "Unable to extract name or number"
   }
   ```

### API Errors

- **400 Bad Request**: If the `gmcNumber` is not provided in the request.
- **500 Internal Server Error**: If there is an issue with scraping the GMC website (e.g., if the page structure changes or if there are connectivity issues).

## Development

### Running the Project Locally

To run the project locally for development:

1. Clone the repository and install dependencies as mentioned above.
2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:3000`.

### Running Tests

You can add tests for this project by using your preferred testing library. For Playwright, you can write tests using the `playwright-test` package or integrate it with other testing frameworks.

## Contributing

We welcome contributions to this project! If you have suggestions or improvements, please fork the repository and submit a pull request.

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement your changes.
4. Submit a pull request describing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

