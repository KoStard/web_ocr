export class AsyncFileReader {
    static async readFileAsArrayBuffer(file) {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
            reader.onload = resolve;
        });
        reader.readAsArrayBuffer(file);
        await promise;
        return reader.result;
    }
}