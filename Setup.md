Jest Test Suite Setup and Instructions to Run Project

This guide provides a step-by-step walkthrough for setting up your environment and running individual test files in a Jest test suite.


Prerequisites
Before proceeding, ensure you have the following installed on your computer:
- Node.js (v16 or above)
- npm (comes with Node.js)



Step 1: Install Node.js and npm

    1. Download Node.js: Visit [Node.js Official Website](https://nodejs.org/) and download the LTS version.
    2. Install Node.js:
    - Run the installer.
    - Follow the setup instructions.
    - Ensure you check the box for `Install npm`.

    3. Verify Installation:
    - Open a terminal or command prompt.
    - Run the commands below to confirm installation:
        ```bash
        node -v
        npm -v
        ```
    - The output should display the installed versions of Node.js and npm.



Step 2: Set Up the Project

    1. Clone or Download the Project:
    - Place the project folder (containing the `test` directory) on your machine.

    2. Initialize npm:
    - Navigate to the project folder in the terminal:
        ```bash
        cd /path/to/project
        ```
    - Run:
        ```bash
        npm init -y
        ```
    - This creates a `package.json` file in the project folder.

    3. Install Jest:
    - In the project directory, run:
        ```bash
        npm install --save-dev jest
        ```
    - This installs Jest as a development dependency.

Step 3: Configure Jest

    1. Add a Test Script:
    - Open the `package.json` file.
    - Add the following under the `scripts` section:
        ```json
        "scripts": {
        "test": "jest"
        }
        ```
    - Save the file.

    2. Configure Jest Settings:
    - Create a `jest.config.js` file in the project root:
        ```bash
        touch jest.config.js
        ```
    - Add the following configuration if needed:
        ```javascript
        module.exports = {
        testEnvironment: "node",
        testMatch: ["/test/*.test.js"],
        };
        ```

Step 4: Run Individual Test Files

    1. Navigate to the `test` Folder:
    ```bash
    cd test
    ```

    2. Run an Individual Test File:
    - Use the `npx jest` command followed by the file name. For example:
        ```bash
        npx jest users.test.js
        ```
    - Replace `users.test.js` with the desired file (e.g., `wishlist.test.js`, `games.test.js`).

Step 5: Run All Tests

    - To run all test files at once, navigate back to the project root and run:
    ```bash
    npm test
    ```

 Troubleshooting
    - If Jest is not recognized, try:
    ```bash
    npx jest --version
    ```
    This ensures Jest was installed correctly.

    - Ensure all test files are named with the `.test.js` suffix (e.g., `users.test.js`).



