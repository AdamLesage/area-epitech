import 'reflect-metadata';
import { ConfigService } from '../config/config-service';
import { TwitterService } from './twitterService';
import { TwitterBot } from './twitterBot';
import { TwitterServiceLocator } from './twitterService';
import container from './dependencyInjection';

// Initialiser les liaisons
ConfigService.initializeBindings();

// Récupérer les services depuis le conteneur
const twitterService = container.get<TwitterService>(TwitterServiceLocator.TwitterService);
const twitterBot = new TwitterBot(twitterService);

// Exemple d'initialisation
twitterBot.Initialize('keyword1', 'keyword2');
