import Worker from '../../Worker.js';

const pullRequestSubmittedWorker = new Worker('pullRequestSubmittedWorker');

pullRequestSubmittedWorker.repeatedGreetingsLoop();
