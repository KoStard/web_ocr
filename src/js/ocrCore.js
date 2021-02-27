import { createWorker } from 'tesseract.js';

export class OcrCore {
    constructor(images) {
        this.images = images;
        this.scheduler = new CustomScheduler(this.getNumberOfWorkers());
    }

    async recognizeAllImages(languages, statusUpdateCallback) {
        await this.scheduler.createWorkers(languages);
        await this.scheduler.addJobs(
            this.images
                .map(image => {
                    return async (worker) => {
                        console.log(worker);
                        await worker.recognize(image);
                        let { data } = await worker.getPDF('test');
                        return new Uint8Array(data);
                    };
                })
        );
        const results = await this.scheduler.runAllJobs((currentResults) => {
            let currentlyProcessed = currentResults.length;
            if (statusUpdateCallback) {
                statusUpdateCallback(currentlyProcessed, this.images.length);
            }
        });
        this.scheduler.terminate();
        // For some reason we are getting reversed list of the pages
        return results.reverse();
    }

    getNumberOfWorkers() {
        return Math.min(this.images.length, 4);
    }
}


class CustomScheduler {
    constructor(numberOfWorkers) {
        this.numberOfWorkers = numberOfWorkers;
        this.workers = [];
        this.jobs = [];
        this.terminated = false;
    }

    async createWorkers(languages) {
        console.log("Creating workers");
        let promises = [];
        for (let i = 0; i < this.numberOfWorkers; i++) {
            promises.push(this.createWorker(languages));
        }
        this.workers = await Promise.all(promises);
    }

    async createWorker(languages) {
        const worker = createWorker({
            corePath: '/node_modules/tesseract.js-core/tesseract-core.wasm.js',
            // logger: m => console.log(m)
        });

        await worker.load();
        const languageFlag = languages.join('+');
        await worker.loadLanguage(languageFlag);
        await worker.initialize(languageFlag);
        return worker;
    }

    // Job will be represented as an async function that will receive the worker
    async addJobs(jobs) {
        this.jobs = this.jobs.concat(jobs);
    }

    async runAllJobs(statusUpdateCallback) {
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
            if (statusUpdateCallback) {
                statusUpdateCallback(results);
            }
        }
        return results;
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.terminated = true;
    }
}