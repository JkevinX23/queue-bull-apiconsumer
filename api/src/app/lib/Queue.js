import Queue from "bull";
import redisConfig from "../../config/redis";

import * as jobs from "../jobs";

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name);
    return queue.bull.add(data);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);
      queue.bull.on('failed', (job, error) => {
        console.log('Job Failed', queue.name , job.data);
        console.log(error);
      })
    });
  },
};

// const mailQueue = new Queue(RegistrationMail.key, redisConfig )

// mailQueue.on('failed', (job, err) => {
//     console.log('Job Failed', job.name, job.data)
//     console.log(err)
// })

// export default mailQueue;
