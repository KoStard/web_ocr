export class SelectedLanguage {
    constructor(languageCode, languageName, onremove) {
        this.languageCode = languageCode;
        this.languageName = languageName;
        this.onremove = onremove;
        this.selectedLanguagesDiv = document.getElementById("selected-languages");
        this.element = null;
    }

    render() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.innerText = this.languageName;
            this.element.className = "selectedLanguage";
            this.element.onclick = () => this.remove();
            this.selectedLanguagesDiv.appendChild(this.element);
        }
    }

    remove() {
        this.element.remove();
        this.onremove(this);
    }
}