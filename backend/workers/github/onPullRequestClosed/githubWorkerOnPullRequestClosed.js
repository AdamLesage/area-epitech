import Worker from '../../Worker.js';

const pullRequestClosedWorker = new Worker('pullRequestClosedWorker');

pullRequestClosedWorker.repeatedGreetingsLoop();
