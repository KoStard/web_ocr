export class PdfToPngConverter {
    constructor(pdf) {
        this.pdf = pdf;
    }
   
    async render() {
        let promises = [];
        for (let i = 1; i <= this.pdf.numPages; i++) {
            const image = this.renderPage(i);
            promises.push(image);
        }
        return await Promise.all(promises);
    }

    async renderPage(currentPage) {
        const page = await this.pdf.getPage(currentPage);
        const viewport = page.getViewport(1.5);
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const renderContext = { canvasContext: ctx, viewport };
        // TODO fix this
        console.log(viewport.height);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render(renderContext).promise;
        // TODO remove this
        window.page = page;
        return await new Promise(resolve => {
            // canvas.toBlob(async blob => {
            //     const image = new File([blob], `page-${currentPage}.png`, {
            //         lastModified: new Date(),
            //         type: 'image/png'
            //     });
            //     resolve(image);
            // });
            console.log(canvas.toDataURL());
            resolve(canvas.toDataURL());
        });
    }
}