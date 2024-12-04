import { Container } from 'inversify';
import { TwitterBot, TwitterBotLocator } from './twitterBot';
import { ITwitterService, TwitterService, TwitterServiceLocator } from './twitterService';
import { ConfigManager, ConfigManagerLocator, IConfigManager } from '../config/config-service';

const container = new Container();

container.bind<IConfigManager>(ConfigManagerLocator.ConfigManager).to(ConfigManager).inSingletonScope();
container.bind<ITwitterService>(TwitterServiceLocator.TwitterService).to(TwitterService).inSingletonScope();
container.bind<TwitterBot>(TwitterBotLocator.TwitterBot).to(TwitterBot).inSingletonScope();

export default container;