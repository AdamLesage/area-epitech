export interface Area {
    id: number;
    uuid: string;
    title: string;
    reactionData: Record<string, string>;
    actionData: Record<string, string>;
    userUuid: string;
    description: string;
    creationDate: string;
    isActive: boolean;
    containerUuid: string;
    actionId: number;
    reactionId: number;
}
