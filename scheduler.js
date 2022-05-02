let isFlushing = false; // 正在清空任务队queue
let isFlushPending = false; // 为true的时候创建了微任务，但是主线程可能有一个1000次for循环阻塞主线程，还没空执行；false正在清空任务队queue
const queue = [];
const resolvedPromise = /*#__PURE__*/ Promise.resolve();
let currentFlushPromise = null;

function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

// 入队
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}

function queueFlush() {
  // 开启微任务，尝试以微任务的形式清空任务队列
  if (!isFlushing && !isFlushPending) {
    // isFlushing已经清空完任务队列值为false，isFlushPending正在清空微任务值为false，才能继续创建微任务
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  // 循环执行queue对面里面的函数。
  isFlushPending = false;
  isFlushing = true;
  try {
      queue.forEach((job) => {
          job && job()
      })
  } finally {
    isFlushing = false;
    currentFlushPromise = null;
  }
}

export {queueJob, nextTick}