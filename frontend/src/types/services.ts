export interface Service {
    name: string;
    color: string;
    icon: string;
    reviews: {
        rate: number;
        count: number;
    },
    saves: number;
    categories: Category[];
}

export interface Category {
    name: string;
    display_name: string;
    actions: Action[];
    reactions: Reaction[];
}

export interface Action {
    name: string;
    description: string;
    display_name: string;
    icon: string;
    version: string;
    release_date: string;
    updated_date: string;
    options: Option[];
}

export interface Item {
    name: string;
    description: string;
    display_name: string;
    icon: string;
    version: string;
    release_date: string;
    updated_date: string;
    options: Option[];
}

export interface Option {
    name: string;
    display_name: string;
    description: string;
    type: OptionType;
    required: boolean;
}

export type OptionType = 
    | 'text'
    | 'textarea'
    | 'date'
    | 'time'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'file'
    | 'phonenumber'
    | 'email'
    | 'password'
    | 'number'
    | 'month'
    | 'week'
    | 'boolean'
    | 'GithubRepository'
    | 'SpotifyPlaylist'
    | 'SpotifyMusic';

export interface Reaction {
    name: string;
    description: string;
    display_name: string;
    icon: string;
    version: string;
    release_date: string;
    updated_date: string;
    options: Option[];
}

export interface ServiceDetails {
    name: string;
    actions: Action[];
    reactions: Reaction[];
}
