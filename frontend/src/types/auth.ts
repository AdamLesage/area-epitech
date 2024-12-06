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
