# Frontend Routes Documentation

---

## Route: Login

### Path
`/login`

### Name
`login`

### Description
The login page allows users to enter their email and password to authenticate and gain access to the platform. Successful login redirects the user to the dashboard.

### Component
`LoginPage.vue`

### Key Functionalities
- **Navigation**: Clicking the logo or "AREA" text redirects to the home page.
- **Login Form**: Captures user credentials and handles form submission.
- **Feedback**: Displays success or error messages based on the login result.

### Visual Structure
- A central layout with a logo, "AREA" text, and a login form.
- The "Sign Up" button is positioned at the top-right for web view.

### Data Handling
- Stores the authentication token in cookies.
- Redirects authenticated users to the dashboard.

---

## Route: Sign Up

### Path
`/signup`

### Name
`signup`

### Description
The sign-up page allows new users to register by providing their email, password, and other personal details.

### Component
`SignUpPage.vue` (loaded dynamically)

### Key Functionalities
- **Navigation**: Clicking the logo or "AREA" text redirects to the home page.
- **Sign-Up Form**: Collects user details and handles form submission.
- **Feedback**: Displays success or error messages based on the registration result.

### Visual Structure
- A central layout with a logo, "AREA" text, and a sign-up form.
- The "Login" button is positioned at the top-right for web view.

### Data Handling
- Stores the authentication token in cookies upon successful registration.
- Redirects users to the `signup/user-details` page for further information.

---

## Route: User Details

### Path
`/signup/user-details`

### Name
`user-details`

### Description
The user details page allows users to enter additional information such as their username and bio after signing up.

### Component
`DetailsFormComponent.vue`

### Key Functionalities
- **Navigation**: The "AREA" text and logo redirect to the home page.
- **Details Form**: Captures additional user details like username and bio.
- **Submission**: Updates the user's profile via an API call.
- **Skip Option**: Allows users to bypass filling in details.

### Data Handling
- Uses `axios` for sending a `PUT` request to update user details.
- Authenticates requests using a token stored in cookies.
- On success, it redirects the user to the dashboard.

---

## Route: Email Verification

### Path
`/email-verification`

### Name
`email-verification`

### Description
Allows users to verify their email address by entering the verification code sent to their email.

### Component
`EmailVerificationPage.vue` (loaded dynamically)

### Status
Not used in the project...

---

## Route: Forgot Password

### Path
`/forgot-password`

### Name
`forgot-password`

### Description
This page allows users to initiate the password retrieval process by submitting their email. It also handles verification through a code sent to the user's email.

### Component
`ForgotPasswordPage.vue` (loaded dynamically)

### Key Functionalities
- **Navigation**: The "AREA" text and logo redirect to the home page.
- **Form**: `PasswordRetrievalFormComponent` handles the email input and verification code.
- **Submission**: Sends a password reset request to the API.
- **Code Verification**: Verifies the code sent to the user's email through the `/auth/reset-password-confirm` API endpoint.
- **Abort Option**: Allows users to cancel the process and redirects them to the login page.
- **Resend Code**: Users can request to resend the password reset code.

### Data Handling
- Uses the `fetch` API to interact with the backend for password reset and code verification.
- Watches the route for changes and initializes the store if necessary.
- Manages user state with `useUserStore` and cookies for authentication tokens.

---

## Route: Change Password

### Path
`/change-password`

### Name
`change-password`

### Description
This page allows users to change their password after verifying their identity via a code sent to their email.

### Component
`ChangePasswordPage.vue` (loaded dynamically)

### Key Functionalities
- **Navigation**: Clicking "AREA" redirects to the home page.
- **Form**: `PasswordChangeFormComponent` handles the password change form submission.
- **Submission**: Upon form submission, the password change request is sent to the API using the provided email, new password, and verification code.
- **Abort**: The user can abort the process, which redirects them to the login page.

### Data Handling
- Uses the `fetch` API to call the `/auth/change-password` endpoint to change the password.
- Watches the route for changes and initializes the store if necessary.
- Manages the user state with `useUserStore` and cookies for authentication tokens.

---

## Route: Home

### Path
`/`

### Name
`home`

### Description
The landing page of the application. It provides navigation options for users to sign up, log in, or learn more about the platform. Users are greeted with a welcoming interface and are prompted to either create an account, sign in, or access additional information about the application.

### Component
`HomePage.vue`

### Key Features:
- **Navigation Options**: Directs users to either sign up, log in, or access more information.
- **Responsive Design**: Adapts to various screen sizes for an optimal user experience.
- **User Engagement**: Calls to action encourage users to take the next step in their journey (sign up, log in, or learn more about the app).

---

## Route: Service

### Path
`/service/:id`

### Name
`service`

### Description
Displays detailed information about a specific service.

### Component
`ServicePage.vue`

---

## Route: Service Category

### Path
`/service/:id/category/:category`

### Name
`service-category`

### Description
Displays a specific category within a service.

### Component
`CategoryPage.vue`

---

## Route: Service Card

### Path
`/service/:id/category/:category/:type/:card`

### Name
`service-card`

### Description
Displays a detailed view of a specific card within a service category.

### Component
`CardPage.vue`

---

## Route: User Profile

### Path
`/userinfo`

### Name
`userinfo`

### Description
Displays the user's profile information, including their connected platforms and actions.

### Component
`UserInfoPage.vue` (loaded dynamically)

### Middleware
`auth`

---

## Route: Add Connections

### Path
`/add-connections`

### Name
`add-connections`

### Description
Allows users to add new platform connections to their profile.

### Component
`AddConnections.vue` (loaded dynamically)

### Middleware
`auth`

---

## Route: Dashboard

### Path
`/dashboard`

### Name
`dashboard`

### Description
The main dashboard for logged-in users, showing an overview of their activities and services.

### Component
`DashboardPage.vue` (loaded dynamically)

### Middleware
`auth`

---

## Route: Auth Callback

### Path
`/auth-callback`

### Name
`auth-callback`

### Description
Handles the callback after authentication with third-party services.

### Component
`AuthCallbackPage.vue` (loaded dynamically)

---

## Route: Workshop

### Path
`/workshop`

### Name
`workshop`

### Description
A page dedicated to workshops, offering tools and resources.

### Component
`WorkshopPage.vue` (loaded dynamically)

### Middleware
`auth`

---

## Route: Explore

### Path
`/explore`

### Name
`explore`

### Description
Allows users to explore various services and categories.

### Component
`ExplorePage.vue` (loaded dynamically)

---

## Route: Not Authorized

### Path
`/not-authorized`

### Name
`not-authorized`

### Description
Displays a message when a user tries to access a restricted area without proper authorization.

### Component
`NotAuthorizedPage.vue` (loaded dynamically)

---

## Route: Privacy Policy

### Path
`/privacy`

### Name
`privacy`

### Description
Displays the application's privacy policy.

### Component
`PrivacyPage.vue`

---

## Route: Terms and Conditions

### Path
`/terms`

### Name
`terms`

### Description
Displays the application's terms and conditions.

### Component
`TermsPage.vue`

---

## Route: Mentions

### Path
`/mentions`

### Name
`mentions`

### Description
Displays legal mentions and information.

### Component
`MentionsPage.vue`

---

## Route: Cookies Policy

### Path
`/cookies`

### Name
`cookies`

### Description
Displays the cookies policy of the application.

### Component
`Cook.vue`

---

## Route: Discord End of Process

### Path
`/discord-end-of-process`

### Name
`discord-end-of-process`

### Description
Final step in the Discord integration process.

### Component
`EndofProcessGithub.vue` (loaded dynamically)

---

## Route: Client APK

### Path
`/client.apk`

### Name
`client-apk`

### Description
A page that allows users to download the client APK.

### Component
`ClientApk.vue` (loaded dynamically)

---

## Route: Not Found

### Path
`/:pathMatch(.*)*`

### Name
`not-found`

### Description
Displays a 404 error page when a user navigates to a non-existent route.

### Component
`NotFoundPage.vue` (loaded dynamically)

---
