import { createWorker } from 'tesseract.js';

export class OcrCore {
    constructor(images) {
        this.images = images;
        this.scheduler = new CustomScheduler(this.getNumberOfWorkers());
    }

    async recognizeAllImages() {
        await this.scheduler.createWorkers();
        await this.scheduler.addJobs(
            this.images
                .map(image => {
                    return async (worker) => {
                        console.log(worker, image);
                        await worker.recognize(image);
                        return await worker.getPDF();
                    };
                })
        );
        const results = await this.scheduler.runAllJobs();
        this.scheduler.terminate();
        return results;
    }

    getNumberOfWorkers() {
        return Math.min(this.images.length, 1);
    }
}


class CustomScheduler {
    constructor(numberOfWorkers) {
        this.numberOfWorkers = numberOfWorkers;
        this.workers = [];
        this.jobs = [];
        this.terminated = false;
    }

    async createWorkers() {
        console.log("Creating workers");
        let promises = [];
        for (let i = 0; i < this.numberOfWorkers; i++) {
            promises.push(this.createWorker());
        }
        this.workers = await Promise.all(promises);
    }

    async createWorker() {
        const worker = createWorker({
            corePath: '/node_modules/tesseract.js-core/tesseract-core.wasm.js',
            // logger: m => console.log(m)
        });

        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        return worker;
    }

    // Job will be represented as an async function that will receive the worker
    async addJobs(jobs) {
        this.jobs = this.jobs.concat(jobs);
    }

    async runAllJobs() {
        if (this.terminated) {
            throw new Error("Trying to start jobs on terminated scheduler");
        }
        let results = [];
        while (this.jobs.length) {
            if (this.workers.length == 0) {
                throw new Error("No workers attached");
            }
            let promises = this.workers.map(async worker => {
                if (this.jobs.length) {
                    const job = this.jobs.pop();
                    return await job(worker);
                }
            }).filter(e => e);
            let currentResults = await Promise.all(promises);
            results = results.concat(currentResults);
        }
        return results;
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.terminated = true;
    }
}