export interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

export interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface DetailsFormValues {
    username: string;
    bio: string;
}

export interface EmailVerificationFormValues {
    code: [string, string, string, string, string, string];
    email: string;
}

export interface PasswordRetrievalFormValues {
    code: [string, string, string, string, string, string];
    email: string;
}

export interface PasswordChangeFormValues {
    password: string;
    confirmPassword: string;
}

export interface User {
    id: number;
    uuid: string;
    name: string;
    surname: string;
    bio: string | null;
    birthDate: string | null;
    email: string;
    phoneNumber: string | null;
    hashedPassword: string;
    authToken: string;
    googleAccessToken: string | null;
    githubAccessToken: string | null;
    profilePicture: ProfilePicture | null;
    linkedAccounts: LinkedAccount[];
}

export interface ProfilePicture {
    id: number;
    url: string;
}

export interface LinkedAccount {
    id: number;
    provider: string;
    username: string;
}
