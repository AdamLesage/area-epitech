export interface SignUpForm {
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

export interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}
