# **Testing Policy for the Project**

## **Introduction**
This document defines the testing policy for our project, focusing on strategies, tools, and processes to ensure high-quality development through comprehensive testing. The policy covers backend, frontend, and full-stack testing with an emphasis on automation and continuous integration.

---

## **Testing Strategy**
The testing approach combines **manual testing** for exploratory purposes and **automated testing** for reproducible, scalable validations. 

- **Manual Testing**: Best suited for usability, UI/UX, and exploratory testing.
- **Automated Testing**: Handles unit, integration and regression testing efficiently.

The workflow integrates **GitHub Actions** to automate test execution after every push or pull request, enhancing continuous deployment reliability.

---

## **Backend Testing**
### Tools:
- **Jest**: The primary testing framework used for unit and integration testing. [Jest Documentation](https://jestjs.io/)

### Testing Methods:
1. **Unit Tests**: Test individual backend functions or classes in isolation.
2. **Integration Tests**: Validate interactions between backend modules, such as routes and database operations.

### Setup Instructions:
Install Jest with the following command:
```bash
npm install --save-dev jest
```
Add the following `jest.config.js` for setup:
```javascript
module.exports = {
  testEnvironment: 'node',
};
```

### Run Tests:
Execute backend tests with:
```bash
npx jest
```

---

## **Frontend Testing**
### Tools:
- **Cypress**: A framework for end-to-end testing, focusing on user interactions in the browser. [Cypress Documentation](https://docs.cypress.io/)

### Testing Methods:
1. **Regression Testing**: Verify UI consistency after code changes.
2. **Follow-up Testing**: Ensure user flows behave as expected in ongoing scenarios.

### Setup Instructions:
Install Cypress:
```bash
npm install --save-dev cypress
```

To open the Cypress testing interface:
```bash
npx cypress open
```

For headless execution:
```bash
npx cypress run
```

---

## **Testing Process**

The following outlines the testing workflow:

1. **Define Test Scenarios**:
   - Identify key user journeys and backend operations.
   - Document expected outputs for each scenario.

2. **Run Tests**:
   - Use Jest for backend logic.
   - Use Cypress for frontend interactions.

3. **Compare Results**:
   - Pass: Match actual results with expected results.
   - Fail: Report issues via GitHub Actions.

4. **Regression Testing**:
   - Verify global states (e.g., UI changes) after updates.
   - Automate tests for pull requests using GitHub Actions.

---

## **Continuous Integration Example**

The following GitHub Actions workflow automates testing:
```yaml
name: CI Testing

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run backend tests
        run: npx jest

      - name: Run frontend tests
        run: npx cypress run
```

---

## **Visual Overview of Tests**

1. **Regression Testing**:
   - Ensure consistency after modifications.
   - Tool: **Cypress**.

2. **Follow-up Testing**:
   - Simulate end-to-end user journeys.
   - Tool: **Cypress**.

3. **Unit Testing**:
   - Focus on individual components.
   - Tool: **Jest** for backend and **Cypress** for frontend.

