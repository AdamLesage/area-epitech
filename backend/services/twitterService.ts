import { injectable } from 'inversify';
import Twit from 'twit';
import { ConfigManagerLocator, IConfigManager } from '../config/config-service';
import axios from 'axios';

export interface ITwitterService {
    WatchToFilterStream(params: Twit.Params): void;
}

export const TwitterServiceLocator = {
    TwitterService: Symbol.for('ITwitterService')
};

@injectable()
export class TwitterService implements ITwitterService {
    private readonly twit: Twit;

    constructor(configManager: IConfigManager) {
        this.twit = new Twit({
            consumer_key: "ZUn2ACWk2m0uhe6xGO4XBNcDp",
            consumer_secret: "8uFwgDbfIhhkLge4JQTEWyhP2b7qdz5VYvdaz5QTlfeRktiVZX",
            access_token: "1861402116448751616-DNdVLwW0bOcBkAEUZtJ0gig07PE19o",
            access_token_secret: "LFnadLI6Gf9oINqFsItNuGrtl1UxO1XCoJDdXEC8A5sOF"
        });
    }

    public async WatchToFilterStream(params: any): Promise<void> {
        const { TwitterApi } = await import('twitter-api-v2');
        const client = new TwitterApi({
            appKey: "ZUn2ACWk2m0uhe6xGO4XBNcDp",
            appSecret: "8uFwgDbfIhhkLge4JQTEWyhP2b7qdz5VYvdaz5QTlfeRktiVZX",
            accessToken: "1861402116448751616-DNdVLwW0bOcBkAEUZtJ0gig07PE19o",
            accessSecret: "LFnadLI6Gf9oINqFsItNuGrtl1UxO1XCoJDdXEC8A5sOF"
        });

        const rules = await client.v2.streamRules();
        if (rules.data?.length) {
            await client.v2.updateStreamRules({
                delete: { ids: rules.data.map(rule => rule.id) }
            });
        }

        await client.v2.updateStreamRules({
            add: [{ value: '@romainlevilain' }]
        });

        const stream = client.v2.searchStream();
        for await (const { data } of stream) {
            console.log('Tweet received:', data);
        }
    }
}
