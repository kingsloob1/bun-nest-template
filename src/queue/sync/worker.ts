import { pathFromSrc } from '../../utils/general';
import redisConfig from '../../config/envs/redis.config';
import syncQueue, { SYNC_QUEUE_ENUM } from './queue';
import { Worker } from 'bullmq';
import { Stats, statSync } from 'node:fs';
import Graceful from 'node-graceful';
Graceful.captureExceptions = false;

const redisConfiguration = redisConfig();
let processorPath = '';
let processorFileStat: undefined | Stats = undefined;

try {
  processorPath = pathFromSrc('../dist/src/queue/sync/processor.js');
  processorFileStat = statSync(processorPath);
} catch {
  //
}

if (!processorFileStat?.isFile()) {
  try {
    processorPath = pathFromSrc('queue/sync/processor.js');
    processorFileStat = statSync(processorPath);
  } catch {
    //
  }
}

const worker = new Worker(SYNC_QUEUE_ENUM.QUEUE_NAME, processorPath, {
  concurrency: 1,
  connection: {
    port: redisConfiguration.port,
    host: redisConfiguration.host,
  },
  useWorkerThreads: false,
});

export default worker;

(async () => {
  await syncQueue.obliterate({
    force: true,
  });

  await syncQueue.add(SYNC_QUEUE_ENUM.PROCESS_SYNCED_WEBHOOKS_JOB, undefined, {
    removeDependencyOnFailure: true,
    removeOnComplete: true,
    removeOnFail: true,
    stackTraceLimit: 0,
    keepLogs: 0,
    repeat: {
      every: 3 * 1000, // every 10 seconds
    },
  });
})();

const handleProcessTermination = async (signal: string) => {
  console.log(`Sync worker was exited due to signal ${signal} here =====> `);
  await worker.close();
};

Graceful.on('exit', handleProcessTermination);
console.log('Sync Queue Processor Worker Started!');
