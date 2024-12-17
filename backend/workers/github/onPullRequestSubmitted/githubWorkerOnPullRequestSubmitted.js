import Worker from '../../Worker.js';

const pullRequestOpenedWorker = new Worker('pullRequestOpenedWorker');

pullRequestOpenedWorker.repeatedGreetingsLoop();
