export interface Service {
    name: string;
    color: string;
    icon: string;
    reviews: {
        rate: number;
        count: number;
    },
    saves: number;
    actions: Action[];
    reactions: Reaction[];
}

export interface Action {
    name: string;
    description: string;
}

export interface Reaction {
    name: string;
    description: string;
}

export interface ServiceDetails {
    name: string;
    actions: Action[];
    reactions: Reaction[];
}
