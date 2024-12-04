import { ITwitterService } from './twitterService';

export interface ITwitterBot {
    Initialize(...keywords: string[]): void;
}

export const TwitterBotLocator = {
    TwitterBot: Symbol.for('ITwitterBot')
};

export class TwitterBot implements ITwitterBot {
    private twitterService: ITwitterService;

    constructor(twitterService: ITwitterService) {
        this.twitterService = twitterService;
    }

    public Initialize(...keywords: string[]): void {
        this.twitterService.WatchToFilterStream({ track: '@elonmusk' });
    }
}
