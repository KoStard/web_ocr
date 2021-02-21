import { Buffer } from "buffer";
import { Document, ExternalDocument } from "pdfjs";

// Required for the pdf js asBuffer to work, as it doesn't have explicit importing logic
window.Buffer = Buffer;

export class Merger {
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