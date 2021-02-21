// import '../sass/styles.scss';

import { createWorker } from 'tesseract.js';
import { Document, ExternalDocument } from "pdfjs";
// import {convertPdfToPng} from "convert-pdf-png";
import { Buffer } from "buffer";
import { resolve } from '../../webpack.config';
// Required for the pdf js asBuffer to work, as it doesn't have explicit importing logic
window.Buffer = Buffer;

class Merger {
    constructor() {
        this.document = new Document();
    }
    add(doc) {
        this.document.addPagesOf(new ExternalDocument(doc));
    }
    async getResult() {
        return await this.document.asBuffer();
    }
}

const worker = createWorker({
    corePath: '/node_modules/tesseract.js-core/tesseract-core.wasm.js',
    logger: m => console.log(m)
});
async function test() {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    let resp = await new Promise((resovle) => {
        convertPdfToPng(document.getElementById('file_input').files[0], {
            outputType: "callback",
            callback: resolve
        })
    });

    window.resp = resp;
    return;


    const { data: { text } } = await worker.recognize('../../test.png');
    console.log(text);
    const filename = 'test.pdf'
    const { data } = await worker.getPDF('test');

    const merger = new Merger();
    merger.add(new Uint8Array(data));
    merger.add(new Uint8Array(data));

    const buffer = await merger.getResult();

    const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    await worker.terminate();
}


document.getElementById('file_input').onchange = test


const renderPage = async (pdf, currentPage) => {
    const page = pdf.getPage(currentPage);
    const viewport = page.getViewport(1.5);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const renderContext = { canvasContext: ctx, viewport };
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render(renderContext).promise;
    return await new Promise(resolve => {
        canvas.toBlob(async blob => {
            const image = new File([blob], `page-${currentPage}.png`, {
                lastModified: new Date(),
                type: 'image/png'
            });
            resolve(image);
        });
    });
        // images.push(image);
        // if (currentPage < pdf.numPages) {
        //     currentPage++;
        //     await getPage();
        // } else {
        //     switch (config.outputType) {
        //         case 'download':
        //             download();
        //             break;
        //         case 'callback':
        //         default:
        //             config.callback(images);
        //             break;
        //     }
        // }
    // });
};