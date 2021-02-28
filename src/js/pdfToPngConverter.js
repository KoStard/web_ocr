export class PdfToPngConverter {
    constructor(pdf) {
        this.pdf = pdf;
        this.renderedPagesCount = 0;
    }

    async render(statusUpdateCallback) {
        let promises = [];
        let pages = this.pdf.numPages;
        for (let i = 1; i <= pages; i++) {
            const image = this.renderPage(i, pages, statusUpdateCallback);
            promises.push(image);
        }
        return await Promise.all(promises);
    }

    async renderPage(currentPage, pages, statusUpdateCallback) {
        const page = await this.pdf.getPage(currentPage);
        // Maybe if we increase the scale, the letters can become easier to recognize, but it will take longer to process
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const renderContext = { canvasContext: ctx, viewport };
        // TODO fix this
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render(renderContext).promise;
        return await new Promise(resolve => {
            this.renderedPagesCount += 1;
            if (statusUpdateCallback) {
                statusUpdateCallback(this.renderedPagesCount, pages);
            }
            resolve(canvas.toDataURL());
        });
    }
}