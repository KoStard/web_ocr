// import '../sass/styles.scss';

import { Downloader } from "./downloader"
import { Merger } from "./merger"
import { OcrCore } from "./ocrCore"
import { PdfToPngConverter } from "./pdfToPngConverter"
import { AsyncFileReader } from "./asyncFileReader";
import { getDocument, GlobalWorkerOptions, pdfjsWorker } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = '/dist/pdf.worker.js';

// const worker = createWorker({
//     corePath: '/node_modules/tesseract.js-core/tesseract-core.wasm.js',
//     logger: m => console.log(m)
// });

function getInputPdfName() {
    return document.getElementById('file_input').files[0].name;
}

async function getInputPdf() {
    const data = await AsyncFileReader.readFileAsArrayBuffer(document.getElementById('file_input').files[0]);
    return await getDocument({data}).promise;
}

function generateOutputName(inputFileName) {
    const base = inputFileName.match(/^(.+)\.pdf$/)[1];
    return `${base}_processed.pdf`;
}

async function processFile() {
    const inputPdfName = getInputPdfName();
    const inputPdf = await getInputPdf();

    console.log("Converting pdf to pngs");
    const pdfToPngConverter = new PdfToPngConverter(inputPdf);
    const images = await pdfToPngConverter.render();

    // console.log("Passing images to OCR core");
    // const ocrCore = new OcrCore(images);
    // const pdfs = await ocrCore.recognizeAllImages();
    // console.log("Generating final file");
    // const merger = new Merger();
    // pdfs.forEach(pdf => merger.add(pdf));
    // const outputPdfBuffer = await merger.getResult();
    // const blob = new Blob([new Uint8Array(outputPdfBuffer)], { type: 'application/pdf' });
    // Downloader.downloadBlob(blob, generateOutputName(inputPdfName));
}


document.getElementById('file_input').onchange = processFile;


