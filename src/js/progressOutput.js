export class ProgressOutputHandler {
    constructor() {
        this.progressMessageSpan = document.getElementById('progressMessageSpan');
    }

    updateMessage(message) {
        this.progressMessageSpan.innerText = message;
    }
}