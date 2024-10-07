const Queue = require('bull');
const logger = require('../logger');

const taskQueue = new Queue('taskQueue');

taskQueue.process(async (job) => {
  const { user_id } = job.data;
  await task(user_id);
});

async function task(user_id) {
  const logMessage = `${user_id} - task completed at - ${Date.now()}`;
  console.log(logMessage);
  logger.info(logMessage);
}

const addToQueue = async (user_id) => {
  await taskQueue.add({ user_id });
};

module.exports = { addToQueue };
