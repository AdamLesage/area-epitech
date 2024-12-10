# Frontend Routes Documentation

## Route: Login

### Path
`/login`

### Name
`login`

### Description
The login page where users can enter their credentials (email and password) to authenticate and gain access to the platform.

### Component
`LoginPage.vue`

### Key Functionalities
- Displays a login form.
- Sends a POST request to the backend API endpoint `/auth/login` with the provided credentials.
- If the login is successful:
  - Saves the received authentication token and email in cookies.
  - Stores the user information in the application store.
  - Redirects the user to the `/dashboard` page.
- Displays error messages if the login fails.

---

## Route: Sign Up

### Path
`/signup`

### Name
`signup`

### Description
The sign-up page where new users can register by providing their details such as email, password, and personal information.

### Component
`SignUpPage.vue`

### Key Functionalities
- Displays a sign-up form.
- Sends a POST request to the backend API endpoint `/auth/register` with the user’s registration details (email, password, name, and surname).
- If the registration is successful:
  - Saves the received authentication token and email in cookies.
  - Stores the user information in the application store.
  - Redirects the user to the `/signup/user-details` page for additional profile setup.
- Displays error messages if the registration fails.

---

## Route: User Details

### Path
`/signup/user-details`

### Name
`user-details`

### Description
This page allows users to complete their profile details after the initial signup process. It captures additional information, such as username and bio.

### Component
`UserDetailsPage.vue`

### Key Functionalities
- **Profile Completion Form**: Displays a form with fields for the user to input their username and bio.
- **Form Submission**:
  - Handles the submission of profile details using the `handleSubmit` function.
  - Sends a `PUT` request to the backend API endpoint `/api/user/:uuid` to update the user's details.
  - Includes the user's authentication token in the request headers for authorization.
  - If the update is successful:
    - Updates the user information in the store.
    - Redirects the user to the `/dashboard` page.
  - If the update fails, logs the error and displays an appropriate message.
- **Skip Option**: Allows users to skip the profile completion process using the `handleSkip` function.

---

## Route: Email Verification

### Path
`/email-verification`

### Name
`email-verification`

### Description
This page allows users to verify their email address after registration. It includes a form for entering the verification code and provides options to resend the verification email or abort the process.

### Component
`EmailVerificationPage.vue`

### Key Functionalities
- **Email Verification Form**:
  - Displays a form to input the email verification code.
  - Handles submission using the `handleSubmit` function, logging the received verification data.
- **Abort Verification**:
  - Provides an "Abort" button that triggers the `handleAbort` function, logging that the user has aborted the process.
- **Resend Verification Email**:
  - Includes a "Send Again" button that triggers the `handleSendAgain` function to resend the verification email and logs the action.

---

# Frontend Routes Documentation

## Route: Forgot Password

### Path
`/forgot-password`

### Name
`forgot-password`

### Description
This page allows users to initiate the password retrieval process by providing their email address. It includes a form for submitting the request and options to resend the email or abort the process.

### Component
`ForgotPasswordPage.vue`

### Key Functionalities
- **Password Retrieval Form**:
  - Collects the user's email address for password retrieval.
  - Handles submission using the `handleSubmit` function, logging the received email data.
- **Abort Retrieval**:
  - Provides an "Abort" button that triggers the `handleAbort` function, logging that the user has aborted the retrieval process.
- **Resend Email**:
  - Includes a "Send Again" button that triggers the `handleSendAgain` function to resend the retrieval email and logs the action.

---

## Route: Change Password

### Path
`/change-password`

### Name
`change-password`

### Description
This page allows users to change their password after verifying their identity. It includes a form for entering the new password.

### Component
`ChangePasswordPage.vue`

### Key Functionalities
- **Password Change Form**:
  - Collects the new password from the user.
  - Handles submission using the `handleSubmit` function, logging the received password data.
- **Abort Process**:
  - Provides an "Abort" button that triggers the `handleAbort` function, logging that the user has canceled the process.

---

## Route: Landing Page

### Path
`/`

### Name
`landing-page`

### Description
This is the landing page of the application. It serves as the starting point for new and returning users, providing navigation options to sign up, log in, or learn more about the application.

### Component
`LandingPage.vue`

### Key Functionalities

- **Navigation Buttons**:
  - **Sign Up Button**:
    - Changes color on hover (white to `#eee`).
    - Triggers navigation to the sign-up page.
  - **Login Button**:
    - Changes color on hover (white to `#eee`).
    - Triggers navigation to the login page.

- **Logo Display**:
  - Displays the main logo of the application in a central position.

- **"About Us" Button**:
  - Positioned below the logo.
  - Navigates to the "About Us" page on click.
  - Includes hover effects for a smooth transition between default and hover states.

---

## Route: Landing Page

### Path
`/service/:id`

### Name
`service`

### Description
The page that allow you to be redirected to every service of the Area Project

### Component
`ServicePage.vue`

### Key Functionalities

- **Activate / Desactivate Service**:
  - **Activate Button**:
    - Desactivate the service
  - **Desactivate Button**:
    - Activate the service

- **Service Display**:
  - Displays the main logo of the service an how many action reaction are linked to them.

## Route: User Profile

### Path
`/userinfo`

### Name
`user-profile`

### Description
This route displays the user's profile information, including their profile picture, bio, and connected platforms. It also provides a section showing the user's created actions, actions they are involved in, and actions they are not part of. The route allows the user to navigate to different sections, including adding new platform connections.

### Component
`UserProfile.vue`

### Key Functionalities

- **User Profile Information**:
  - Displays the profile picture (fallback to a temporary image if not set).
  - Displays the username and bio.
  
- **User Actions**:
  - Shows statistics for the number of actions the user has created, actions they are involved in, and actions they are not part of. (Currently set to `0` for all actions).

- **Connected Platforms**:
  - Displays a list of platforms (like Spotify, Google, Twitter, etc.) that the user has connected to.
  - Each platform has an associated icon and color, which is dynamically fetched based on the user’s connected platforms.
  - Users can click on a platform to initiate further actions (for now, just logs the platform name).

- **Add Connections Button**:
  - Navigates the user to a route (`/add-connections`) where they can add or manage their connected platforms.

- **Header Navigation**:
  - Provides navigation links in the header for different sections such as "Explore", "My Areas", "Updates", and "Profile".
  - Each link is associated with an icon and navigates to the corresponding route when clicked.

---

## Route: Add Connections

### Path
`/add-connections`

### Name
`add-connections`

### Description
This route allows users to add new platform connections to their profile. It displays a selection of various platforms, each represented by a button with an icon and color. When a platform is selected, the app logs the name of the platform, signaling the platform connection process. Users can also navigate back to their profile page using a "Back" button.

### Component
`AddConnections.vue`

### Key Functionalities

- **Platform Selection**:
  - A grid layout of buttons is displayed, each representing a different platform (such as Spotify, Google, Twitter, Facebook, etc.).
  - Each button has the platform's icon and color, and clicking a button logs the selected platform's name.

- **Back Navigation**:
  - A "Back" button is located at the top-right of the screen, which navigates the user back to the `/userinfo` route (user profile page) when clicked.

### Platforms List
The following platforms are displayed with their respective icons and colors:

- Spotify (`mdi:spotify` - `#1DB954`)
- Google (`mdi:google` - `#FF0000`)
- Twitter (`mdi:twitter` - `#1DA1F2`)
- Facebook (`mdi:facebook` - `#1877F2`)
- Instagram (`mdi:instagram` - `#E4405F`)
- LinkedIn (`mdi:linkedin` - `#0077B5`)
- YouTube (`mdi:youtube` - `#FF0000`)
- Slack (`mdi:slack` - `#611F69`)
- Twitch (`mdi:twitch` - `#6441A4`)
- Discord (`mdi:discord` - `#5865F2`)
- Reddit (`mdi:reddit` - `#FF4500`)
- Pinterest (`mdi:pinterest` - `#E60023`)
- Snapchat (`ri:snapchat-fill` - `#FFFC00`)
- WhatsApp (`mdi:whatsapp` - `#25D366`)
- Telegram (`mdi:telegram` - `#0088CC`)
- Signal (`mdi:signal` - `#0081FF`)
- Skype (`mdi:skype` - `#00AFF0`)
- Microsoft (`mdi:microsoft` - `#F25022`)
- Apple (`mdi:apple` - `#000000`)
- Amazon (`mdi:amazon` - `#FF9900`)
- Netflix (`mdi:netflix` - `#E50914`)
- Hulu (`mdi:hulu` - `#1CE783`)
- GitHub (`mdi:github` - `#181717`)

---

## Route: Add a New Connection

### Path
`/add-connections`

### Name
`add-connections`

### Description
This route allows users to add new platform connections to their account. It presents a grid of buttons, each representing a different social or service platform (e.g., Spotify, Google, Twitter). Users can click on any platform to initiate the connection process. The page also includes a "Back" button, which navigates the user back to their profile page (`/userinfo`).

### Component
`AddConnection.vue`

### Key Functionalities

- **Platform Selection**:
  - Displays a grid of buttons, each representing a different platform (e.g., Spotify, Google, Twitter).
  - Each platform is visually represented with an icon and background color corresponding to the platform's branding.
  - When a user clicks a platform, the `selectPlatform` function is called, logging the selected platform's name for further actions (such as API calls to connect).

- **Back Button**:
  - A button that allows the user to navigate back to their profile page (`/userinfo`).
  - Positioned at the top-right corner of the page for easy access.

---

## Route: Area Creation

### Path
`/areas`

### Name
`areas`

### Component
`MyAreaPage.vue`

### Key Functionalities

- **Dynamic Navigation and Scrolling:** 
    - The pages feature dynamic navigation where the first page displays initial information and the second page shows detailed content. 
    - Scrolling and wheel events are used to switch between the pages (handleScrollAttempt and handleScrollAttemptSecondPage methods).
    - On scrolling down, the first page disappears and the second page is displayed. Additionally, scrolling up brings back the first page.

- **Action and Area Creation:** 
    - The second page allows users to view and interact with different actions related to the service, such as creating an area (handleCreateButtonClick), and displays components like AREACreationComponent for creating new areas. 
    - The actions are dynamically rendered using AREAInfoComponent, and each action can trigger different configurations or options through interaction.

---

## Route: About us

### Path
`/aboutus`

### Name
`aboutus`

### Component
`AboutUsPage.vue`

### Key Functionalities

- **Navigation to the home page:** 
    - There's a "Go to Home Page" button which, when clicked, redirects the user to the home page. 
    - This is handled by the goToHomePage method, which uses the Vue router (useRouter) to perform the navigation.
- **Hover effect on login buttons:** 
    - The "Sign Up" and "Login" buttons change color when hovered over with the mouse. 
    - This is managed by the hover reactive variable, which changes the color of the buttons according to the hover state (@mouseover and @mouseleave).
