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
