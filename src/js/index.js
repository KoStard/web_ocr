import '../sass/styles.scss';

import { Downloader } from "./downloader"
import { Merger } from "./merger"
import { OcrCore } from "./ocrCore"
import { PdfToPngConverter } from "./pdfToPngConverter"
import { AsyncFileReader } from "./asyncFileReader";
import { getDocument, GlobalWorkerOptions, pdfjsWorker } from "pdfjs-dist";
import { LanguagesInput } from './languagesInput';
import { ContainerHandler } from './containerHandler';
import { ProgressOutputHandler } from './progressOutput';

GlobalWorkerOptions.workerSrc = '/pdf.worker.js';


class EntryPoint {
    constructor() {
        this.fileInput = document.getElementById('file-input');
        this.fileInput.onchange = () => this.processFile();

        this.languagesInputHandler = new LanguagesInput();
        this.containerHandler = new ContainerHandler();
        this.progressOutputHandler = new ProgressOutputHandler();
    }
    getInputFile() {
        return this.fileInput.files[0];
    }
    getInputPdfName() {
        return this.getInputFile().name;
    }
    async getInputPdf() {
        const data = await AsyncFileReader.readFileAsArrayBuffer(this.getInputFile());
        return await getDocument({ data }).promise;
    }
    generateOutputName(inputFileName) {
        const base = inputFileName.match(/^(.+)\.pdf$/)[1];
        return `${base}_processed.pdf`;
    }

    async processFile() {
        const inputPdfName = this.getInputPdfName();
        const inputPdf = await this.getInputPdf();

        this.containerHandler.updateState(true);

        console.log("Converting pdf to pngs");
        this.progressOutputHandler.updateMessage("Step 1 : Converting pdf to pngs");
        const pdfToPngConverter = new PdfToPngConverter(inputPdf);
        const images = await pdfToPngConverter.render();
        console.log("Passing images to OCR core");
        this.progressOutputHandler.updateMessage("Step 2 : Passing images to OCR core");
        const ocrCore = new OcrCore(images);
        const pdfs = await ocrCore.recognizeAllImages(this.languagesInputHandler.getLanguageCodes(), (currentlyProcessedCount, allPagesCount) => {
            this.progressOutputHandler.updateMessage(`Processed ${currentlyProcessedCount} pages out of ${allPagesCount}`);
        });
        console.log("Generating final file");
        this.progressOutputHandler.updateMessage("Step 3 : Generating final file");
        const merger = new Merger();
        pdfs.forEach(pdf => merger.add(pdf));
        const outputPdfBuffer = await merger.getResult();
        const blob = new Blob([new Uint8Array(outputPdfBuffer)], { type: 'application/pdf' });
        Downloader.downloadBlob(blob, this.generateOutputName(inputPdfName));
        this.containerHandler.updateState(false);
    }
}

new EntryPoint();

// The more workers you take more resources will be required (CPU power and memory)
// The more languages you take, the longer it will take
// TODO Advanced settings for setting the number of workers
