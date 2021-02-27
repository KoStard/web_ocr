export class ContainerHandler {
    constructor() {
        this.boxAndProgressContainer = document.getElementById('box_and_progress_container');
        this.inProgress = null;
        this.updateState(false);
    }

    updateState(inProgress) {
        if (this.inProgress != inProgress) {
            this.inProgress = inProgress;
            if (inProgress) {
                this.boxAndProgressContainer.classList.add("inProgress");
            } else {
                this.boxAndProgressContainer.classList.remove("inProgress");
            }
        }
    }
}