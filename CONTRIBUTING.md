# Node Coding Standards

[Read More on Node's Best Practices]("https://github.com/goldbergyoni/nodebestpractices?tab=readme-ov-file")
---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Error Handling](#error-handling)
3. [Code Style](#code-style)
4. [Testing and General Quality](#testing-and-general-quality)
5. [Security Practices](#security-practices)
6. [Performance](#performance)
7. [Architecture & Best Practices Guide for Endpoints in Node.js/Express](#architecture--best-practices-guide-for-endpoints-in-nodejsexpress)
   7.1 [Models (Data Access)](#1-models-data-access)
   7.2 [Services (Business Logic)](#2-services-business-logic)
   7.3 [Controllers](#3-controllers)
   7.4 [Router](#4-router)


---

## 1. Project Architecture

- **Structure by business components:**
  Organize the code into self-contained modules that represent distinct
  functional areas (e.g., users, orders). This reduces complexity and coupling,
  making development and maintenance easier.

- **Organize in layers (3-tiers):**
  Separate responsibilities into:
  - **Input layers:** Request handling.
  - **Domain:** Business logic.
  - **Data access layers:** Data management.
  This isolation improves maintainability and reusability by separating
  technical concerns from core logic.

- **Package common utilities:**
  Create reusable modules with their own `package.json` for better
  encapsulation. This facilitates publishing or linking within a monorepo,
  promoting code reuse.

- **Hierarchical, secure, environment-aware configuration:**
  Manage configuration by:
  - Reading values from files and environment variables.
  - Keeping secrets out of versioned code.
  - Providing a structure for easy access, type support, early validation, and
  default values.

- **Consider the main framework:**
  Evaluate frameworks such as:
  - **Nest.js** (ideal for OOP and large applications)
  - **Fastify** (suitable for medium components and microservices)
  - **Express** and **Koa**
  Weigh their pros and cons to choose the best fit for your project’s needs.

- **Use TypeScript in moderation:**
  Employ TypeScript to enhance type safety in variables and functions. However,
  avoid overusing its advanced features to prevent increased cognitive load and
  potential errors.

---

## 2. Error Handling

- **Async-Await or Promises for asynchronous errors:**
  Utilize `try-catch` with async/await or handle errors with Promises
  (`.catch()`) to write more readable and maintainable asynchronous code,
  avoiding excessive callback nesting.

- **Extend the Error object:**
  Create custom error classes that inherit from `Error` to add properties such
  as error codes or severity indicators, unifying error structures.

- **Distinguish operational vs. programmer errors:**
  Differentiate between:
  - **Expected errors:** (e.g., validation failures) that can be handled.
  - **Unexpected errors:** (e.g., logic failures) that may require controlled
  application restarts.

- **Centralized error handling:**
  Implement a dedicated object or function for error processing (logging,
  metrics, process termination decisions) to avoid logic duplication and ensure
  consistency.

- **Document API errors:**
  Inform API consumers about possible errors and their formats using standards
  like OpenAPI or GraphQL, enabling clients to handle error situations
  appropriately.

- **Use a robust logger:**
  Prefer logging libraries such as Pino or Winston that offer log levels,
  formatted outputs, and contextual information beyond what `console.log`
  provides.

- **Test error flows:**
  Ensure that error scenarios—including uncaught exceptions—are covered through
  automated or manual testing.

- **Discover errors and downtime with APM:**
  Use Application Performance Monitoring tools to proactively detect errors,
  failures, and performance bottlenecks.

- **Capture unhandled promise rejections:**
  Subscribe to the `process.unhandledRejection` event to catch Promise errors
  that might otherwise be silently ignored.

- **Fail fast and validate arguments:**
  Check function inputs early (using validation libraries) to catch errors
  promptly and avoid unexpected behavior.

- **Always await promises before returning:**
  Use `return await` in async functions to ensure complete call stacks in error
  traces, simplifying debugging.

- **Subscribe to ‘error’ events:**
  Listen to the `error` event on Event Emitters and Streams since try-catch
  blocks do not automatically catch errors from these sources.

---

## 3. Code Style

- **Use ESLint:**
  Leverage ESLint to identify problematic code patterns, potential errors, and
  enforce a consistent code style across the project.

- **Utilize ESLint plugins for Node.js:**
  Integrate Node.js-specific plugins (e.g., `eslint-plugin-node`,
  `eslint-plugin-security`) to detect common errors and vulnerabilities not
  covered by standard JavaScript rules.

- **Start braces on the same line:**
  Place the opening brace of code blocks on the same line as the declaration
  (functions, loops, conditions) for clarity and to avoid issues with automatic
  semicolon insertion.

- **Properly separate statements:**
  Ensure statements are clearly separated—either with explicit semicolons or by
  understanding automatic insertion rules—to avoid syntax errors.

- **Name functions descriptively:**
  Assign clear, descriptive names to all functions, including anonymous ones
  (closures, callbacks), to aid debugging (e.g., in memory snapshots).

- **Adopt clear naming conventions:**
  - Variables: `lowerCamelCase`
  - Constants: `lowerCamelCase` or `UPPER_SNAKE_CASE` (for globals)
  - Functions: `lowerCamelCase`
  - Classes: `UpperCamelCase`

- **Prefer `const` over `let` and avoid `var`:**
  Use `const` for variables that do not change, `let` for those that do, and
  avoid `var` due to its function scope and hoisting behavior.

- **Require modules at the top of the file:**
  Import all dependencies at the beginning of each file for clarity on required
  modules and to avoid potential synchronous blocking.

- **Establish an explicit entry point:**
  Clearly define the main file exposing a module’s public functionality (e.g.,
  via `index.js` or the `exports` field in `package.json`) to encapsulate
  internal structures.

- **Use the strict equality operator:**
  Prefer `===` and `!==` over `==` and `!=` to compare both value and type,
  preventing unintended type coercion.

- **Use async/await over callbacks:**
  Write asynchronous code with async/await for improved readability and
  simplified error handling.

- **Employ arrow functions:**
  Utilize arrow function expressions (`=>`) for concise syntax and to maintain
  the lexical context of `this`.

- **Avoid side effects in the global scope:**
  Refrain from placing code with side effects (e.g., database or network calls)
  at the module’s top level to prevent unintended execution during imports.

---

## 4. Testing and General Quality

- **Write API (component) tests as a minimum:**
  Focus on tests that interact with the application’s endpoints, offering good
  system coverage and ease of initial writing compared to exhaustive unit tests.

- **Include three parts in each test name:**
  Name tests to clearly state:
  - What is being tested.
  - Under what conditions.
  - The expected result.
  This ensures tests are self-explanatory.

- **Structure tests with the AAA pattern:**
  Divide tests into:
  - **Arrange:** Data and environment setup.
  - **Act:** Execution of the code under test.
  - **Assert:** Verification of expected results.

- **Ensure a unified Node.js version:**
  Use tools like `nvm` or Volta to guarantee that all developers and
  environments (CI/CD, production) use the same Node.js version.

- **Avoid global fixtures and seeds:**
  Have each test create and work with its own set of data, preventing
  interference between tests and ensuring consistency.

- **Tag tests:**
  Classify tests with tags (e.g., `#cold`, `#api`, `#sanity`) to enable running
  specific subsets when needed.

- **Check test coverage:**
  Use coverage tools (e.g., Istanbul/NYC) to monitor which parts of the code
  are tested, identifying untested areas.

- **Use production-like environments for e2e testing:**
  Run end-to-end tests in environments that closely mimic production settings
  (configuration, data, services) for realistic validation.

- **Regularly refactor using static analysis:**
  Apply static analysis tools (e.g., Sonarqube, Code Climate) to detect code
  quality issues, duplication, complexity, and potential errors.

- **Mock external HTTP responses:**
  Utilize network mocking tools (e.g., nock, Mock-Server) to simulate external
  service responses, enabling testing of different scenarios without relying on
  live services.

- **Test middlewares in isolation:**
  When middleware contains complex logic, test it independently using mocked
  `req`, `res`, and `next` objects.

- **Specify port in production, randomize in tests:**
  Use a fixed port in production but allow the server to select a random port
  during testing (using port 0) to avoid conflicts.

- **Test all five possible outcomes:**
  Verify:
  - Operation responses.
  - Visible state changes (e.g., database).
  - Outgoing API calls.
  - New messages in queues.
  - Observability actions (e.g., logging, metrics).

---


## 5. Security Practices

- **Adopt security rules in the linter:**
  Integrate security-focused linter plugins (e.g., `eslint-plugin-security`) to
  detect vulnerabilities during development.

- **Limit concurrent requests:**
  Implement rate limiting (via middleware or external services) to protect
  against DoS attacks by limiting the number of requests a client can make.

- **Extract secrets from configuration:**
  Avoid storing secrets (API keys, passwords) directly in code or versioned
  config files. Use secret management systems (e.g., Vault, environment
  variables) or encryption when necessary.

- **Prevent query injection with ORM/ODM:**
  Use ORM/ODM libraries that escape data automatically or support parameterized
  queries to prevent SQL/NoSQL injection attacks.

- **Apply general security best practices:**
  Follow common security principles applicable to all applications, beyond
  Node.js-specific guidelines.

- **Adjust HTTP security headers:**
  Configure secure HTTP response headers (e.g., Content-Security-Policy,
  Strict-Transport-Security) to mitigate attacks like XSS and clickjacking.

- **Inspect vulnerable dependencies:**
  Regularly scan dependencies with tools like `npm audit` or Snyk and integrate
  checks into the CI/CD pipeline.

- **Protect passwords with bcrypt/scrypt:**
  Store user passwords using secure hashing functions (bcrypt or scrypt) that
  include salts to slow down brute-force attacks.

- **Escape HTML, JS, and CSS output:**
  Sanitize or escape untrusted data in outputs to prevent XSS attacks.

- **Validate incoming JSON schemas:**
  Use schema validation (e.g., with Joi or jsonschema libraries) for incoming
  JSON to ensure expected structures and prevent malicious inputs.

- **Support JWT revocation:**
  Implement mechanisms to invalidate JWTs post-issuance in case of malicious
  activity or access revocation.

- **Prevent brute-force attacks on authorization:**
  Limit failed authentication attempts per IP or user to make brute-force
  attacks more difficult.

- **Run Node.js as a non-root user:**
  Execute the application with a dedicated, limited-permission user instead of
  running as root.

- **Limit payload size:**
  Set size limits on incoming requests (using reverse proxies or middleware) to
  prevent DoS attacks with oversized payloads.

- **Avoid JavaScript `eval`:**
  Do not use `eval()` or similar dynamic code execution methods that can
  execute untrusted code.

- **Prevent malicious RegEx:**
  Carefully design regular expressions to avoid patterns that could lead to
  ReDoS (Regular Expression Denial of Service). Use validation libraries or
  tools to assess regex performance.

- **Avoid loading modules with variables:**
  Do not use user-provided variables in module paths for `require()` or
  `import()` to prevent unauthorized module loading.

- **Run untrusted code in a sandbox:**
  If dynamically provided code must be executed (e.g., plugins), isolate it in
  a sandbox to protect core application functionality.

- **Be cautious with child processes:**
  Validate and sanitize any inputs passed to child processes to prevent command
  injection.

- **Hide error details from clients:**
  Do not expose detailed error information (e.g., stack traces, internal paths)
  in API responses to prevent leaking sensitive data.

- **Set up 2FA for npm/Yarn:**
  Enable two-factor authentication on package management accounts to protect
  against hijacking and malicious code injections.

- **Modify session middleware configuration:**
  Enhance session security by configuring secure cookie options and suppressing
  framework-revealing details.

- **Prevent DoS by controlling process failures:**
  Validate inputs and handle errors to avoid unexpected process exits that
  could be exploited to disrupt service.

- **Prevent unsafe redirects:**
  Validate user-provided redirect URLs to ensure they do not lead to malicious
  sites.

- **Avoid publishing secrets on npm:**
  Use `.npmignore` or the `files` field in `package.json` to exclude
  secret-containing files from published packages.

- **Inspect outdated packages:**
  Regularly check for outdated dependencies and integrate automated checks into
  CI/CD pipelines, potentially failing builds if critical updates are missing.

- **Import built-in modules with `node:` prefix:**
  Use the `node:` prefix (e.g., `import { createServer } from 'node:http';`) to
  avoid ambiguity with similarly named npm packages and reduce typosquatting
  risks.

---

## 6. Performance

- **Do not block the event loop:**
  Avoid running CPU-intensive tasks on Node.js’s main thread. Instead, delegate
  these tasks to worker threads, separate processes, or more suitable
  technologies to keep the application responsive.

- **Prefer native methods over third-party utilities:**
  In many cases, native JavaScript methods provide superior performance
  compared to utility libraries like Lodash or Underscore, while also reducing
  external dependencies.

---

─────────────────────────────
# **Architecture & Best Practices Guide for Endpoints in Node.js/Express**

*Note: Everything presented below is an example to illustrate one approach. You
should adapt these examples to fit your specific requirements and production
standards.*

This guide explains how to organize a project using four main folders:
- **Models:** Encapsulates data access (queries, stored procedures, or views).
- **Services:** Contains business logic, validations, calculations, and data
transformations.
- **Controllers:** Handles HTTP requests, delegates to Services, and returns
responses.
- **Router:** Defines and groups the API endpoints.

This structure is considered a best practice because it keeps the code clean,
modular, and easy to maintain while promoting reusability and testability.

─────────────────────────────
## **Project Structure**

The recommended organization is as follows:

```
/my-project
├── models/
│    └── productsModel.js        // Functions for querying product data from
the database (example)
├── services/
│    └── productsService.js      // Business logic for products (example)
├── controllers/
│    └── productsController.js   // Handles HTTP requests for products (example)
└── router/
     └── productsRouter.js       // Defines the API routes for products
     (example)
```

─────────────────────────────
## **1. MODELS (Data Access)**

**Role:**
Models encapsulate data access and contain functions that perform SQL queries,
call stored procedures, or use views.

**Example – models/productsModel.js:**

```javascript
// models/productsModel.js
import pool from '../db.js'; // Assumes that db.js exports the connection pool
as default

// Function to get a product by its ID
export async function getProductById(productId) {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = 'SELECT id, name, price, stock FROM products WHERE id = ?';
    const rows = await conn.query(query, [productId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}
```

**Best Practices in Models (Example):**
- Use parameterized queries to prevent SQL injection.
- Properly handle and propagate errors so that the Services layer can manage
them.
- Always ensure that connections are released after each query.

─────────────────────────────
## **2. SERVICES (Business Logic)**

**Role:**
The Services layer contains business logic, validations, calculations, and data
transformations. It coordinates operations between the Models and prepares the
information for the Controllers.

**Example – services/productsService.js:**

```javascript
// services/productsService.js
import { getProductById } from '../models/productsModel.js';

export async function getProductWithDiscount(productId, quantity) {
  // Retrieve the product from the model
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Validate that the requested quantity does not exceed the stock
  if (quantity > product.stock) {
    throw new Error(
      `Insufficient stock. Available stock: ${product.stock}. Requested
      quantity: ${quantity}.`
    );
  }

  // Apply discount logic
  let discountRate = 0;
  if (quantity >= 10) {
    discountRate = 0.10; // 10% discount for 10 or more units
  } else if (quantity >= 5) {
    discountRate = 0.05; // 5% discount for between 5 and 9 units
  }

  // Calculate pricing
  const unitPrice = product.price;
  const totalPriceWithoutDiscount = unitPrice * quantity;
  const discountAmount = totalPriceWithoutDiscount * discountRate;
  const finalPrice = totalPriceWithoutDiscount - discountAmount;

  // Return the processed information
  return {
    productId: product.id,
    productName: product.name,
    quantity,
    unitPrice,
    discountRate,
    discountAmount,
    finalPrice,
    stockAvailable: product.stock
  };
}
```

**Best Practices in Services (Example):**
- Keep business logic separate from data access.
- Avoid direct dependencies on framework-specific objects (e.g., refrain from
using `req` or `res` here).
- Write functions as purely as possible to facilitate unit testing.

─────────────────────────────
## **3. CONTROLLERS**

**Role:**
Controllers handle HTTP requests, perform basic parameter validations, call the
Services, and send responses back to the client.

**Example – controllers/productsController.js:**

```javascript
// controllers/productsController.js
import { getProductWithDiscount } from '../services/productsService.js';

export async function getProductInfo(req, res) {
  try {
    // Extract parameters from the request (assumed to be provided in the query)
    const productId = req.query.productId;
    const quantity = parseInt(req.query.quantity, 10);

    if (!productId || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Call the Service to get the processed information
    const result = await getProductWithDiscount(productId, quantity);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Best Practices in Controllers (Example):**
- Keep Controllers as lean as possible by delegating most business logic to the
Services layer.
- Perform basic input validations on parameters.
- Properly handle and propagate errors, responding with the appropriate HTTP
status codes.

─────────────────────────────
## **4. ROUTER**

**Role:**
The Router defines and groups the API endpoints by associating each route with
its corresponding Controller. This maintains organization and enhances
scalability.

**Example – router/productsRouter.js:**

```javascript
// router/productsRouter.js
import express from 'express';
import { getProductInfo } from '../controllers/productsController.js';

const router = express.Router();

// Define the endpoint for retrieving product information with a discount
applied
router.get('/info', getProductInfo);

export default router;
```

**Best Practices in Router (Example):**
- Use `express.Router()` to organize and modularize your routes.
- Keep routes simple; any complex logic should reside in the Controllers or
Services.
- Adhere to a consistent naming standard to ensure maintainability.

─────────────────────────────
**Summary & Additional Tips**

- Clearly separate responsibilities into distinct layers:
  – **Models:** Data access.
  – **Services:** Business logic.
  – **Controllers:** HTTP request handling.
  – **Router:** Endpoints organization and definition.

- This modular structure facilitates code reuse, scalability, and testability,
and it is widely regarded as best practice in Node.js/Express applications.
- Use consistent naming conventions for folders and files, and document each
function so that every team member understands how the system works.


─────────────────────────────
