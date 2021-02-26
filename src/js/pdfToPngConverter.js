export class PdfToPngConverter {
    constructor(pdf) {
        this.pdf = pdf;
    }

    async render() {
        let promises = [];
        for (let i = 1; i <= 4; i++) {
            const image = this.renderPage(i);
            promises.push(image);
        }
        return await Promise.all(promises);
    }

    async renderPage(currentPage) {
        const page = await this.pdf.getPage(currentPage);
        // Maybe if we increase the scale, the letters can become easier to recognize, but it will take longer to process
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const renderContext = { canvasContext: ctx, viewport };
        // TODO fix this
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render(renderContext).promise;
        return await new Promise(resolve => {
            resolve(canvas.toDataURL());
        });
    }
}