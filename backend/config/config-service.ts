import { Container, injectable } from 'inversify';

export interface IConfigManager {
    TwitConsumerKey: string;
    TwitConsumerSecret: string;
    TwitAccessToken: string;
    TwitAccessTokenSecret: string;
}

export const ConfigManagerLocator = {
    ConfigManager: Symbol.for('IConfigManager')
};

@injectable()
export class ConfigManager implements IConfigManager {
    public get TwitConsumerKey(): string {
        return 'default_consumer_key';
    }

    public get TwitConsumerSecret(): string {
        return 'default_consumer_secret';
    }

    public get TwitAccessToken(): string {
        return 'default_access_token';
    }

    public get TwitAccessTokenSecret(): string {
        return 'default_access_token_secret';
    }
}

// Création d'un conteneur IoC
const container = new Container();

// Classe pour initialiser les bindings
export class ConfigService {
    public static initializeBindings(): void {
        container.bind<IConfigManager>(ConfigManagerLocator.ConfigManager).to(ConfigManager).inSingletonScope();
    }

    public static getConfigManager(): IConfigManager {
        return container.get<IConfigManager>(ConfigManagerLocator.ConfigManager);
    }
}

// Exportation du conteneur pour usage externe
export { container };
