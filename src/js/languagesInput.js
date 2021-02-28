import { SelectedLanguage } from "./selectedLanguage";

export class LanguagesInput {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.addLanguageButton = document.getElementById('add-language-button');
        this.languagesSelect = document.getElementById('languages-select');
        this.initializeSelect();

        this.languagesSelect.onchange = () => this.checkAndUpdateButtonState();
        this.addLanguageButton.onclick = () => {
            const selectedLanguageCode = this.languagesSelect.value;
            if (!this.languageAlreadySelected(selectedLanguageCode)) {
                this.addLanguage(selectedLanguageCode, languagesMap[selectedLanguageCode]);
            }
        }

        this.selectedLanguages = [];
        this.addInitialSetOfLanguages();
    }

    initializeSelect() {
        for (const langPair of languages) {
            let option = document.createElement('option');
            option.value = langPair[0];
            option.innerText = langPair[1];
            this.languagesSelect.appendChild(option);
        }
    }

    checkAndUpdateButtonState() {
        const selectedLanguageCode = this.languagesSelect.value;
        this.updateButtonState(!this.languageAlreadySelected(selectedLanguageCode));
    }

    updateButtonState(active) {
        if (active) {
            this.addLanguageButton.removeAttribute('disabled');
        } else {
            this.addLanguageButton.setAttribute('disabled', '');
        }
    }

    addInitialSetOfLanguages() {
        this.addLanguage('hye', languagesMap.hye);

        this.checkAndUpdateButtonState();
    }

    addLanguage(languageCode, languageName) {
        const selectedLanguage = new SelectedLanguage(languageCode, languageName, (language) => this.removeLanguageCallback(language));
        selectedLanguage.render();
        this.selectedLanguages.push(
            selectedLanguage
        );
    }

    removeLanguageCallback(language) {
        this.selectedLanguages = removeItemOnce(this.selectedLanguages, language);
        this.checkAndUpdateButtonState();
    }

    languageAlreadySelected(languageCode) {
        return !!this.selectedLanguages.find(lang => lang.languageCode == languageCode);
    }

    getLanguageCodes() {
        return this.selectedLanguages.map(lang => lang.languageCode);
    }
}

export const languages = [
    ["hye", "Armenian"],
    ["afr", "Afrikaans"],
    ["amh", "Amharic"],
    ["ara", "Arabic"],
    ["asm", "Assamese"],
    ["bel", "Belarusian"],
    ["ben", "Bengali"],
    ["bod", "Tibetan"],
    ["bos", "Bosnian"],
    ["bre", "Breton"],
    ["bul", "Bulgarian"],
    ["cat", "Catalan; Valencian"],
    ["ceb", "Cebuano"],
    ["ces", "Czech"],
    ["chi_sim", "Chinese - Simplified"],
    ["chi_tra", "Chinese - Traditional"],
    ["chr", "Cherokee"],
    ["cos", "Corsican"],
    ["cym", "Welsh"],
    ["dan", "Danish"],
    ["deu", "German"],
    ["dzo", "Dzongkha"],
    ["ell", "Greek, Modern (1453-)"],
    ["eng", "English"],
    ["enm", "English, Middle (1100-1500)"],
    ["epo", "Esperanto"],
    ["equ", "Math / equation detection module"],
    ["est", "Estonian"],
    ["eus", "Basque"],
    ["fao", "Faroese"],
    ["fas", "Persian"],
    ["fil", "Filipino (old - Tagalog)"],
    ["fin", "Finnish"],
    ["fra", "French"],
    ["frk", "German - Fraktur"],
    ["frm", "French, Middle (ca.1400-1600)"],
    ["fry", "Western Frisian"],
    ["gla", "Scottish Gaelic"],
    ["gle", "Irish"],
    ["glg", "Galician"],
    ["grc", "Greek, Ancient (to 1453) (contrib)"],
    ["guj", "Gujarati"],
    ["hat", "Haitian; Haitian Creole"],
    ["heb", "Hebrew"],
    ["hin", "Hindi"],
    ["hrv", "Croatian"],
    ["hun", "Hungarian"],
    ["iku", "Inuktitut"],
    ["ind", "Indonesian"],
    ["isl", "Icelandic"],
    ["ita", "Italian"],
    ["ita_old", "Italian - Old"],
    ["jav", "Javanese"],
    ["jpn", "Japanese"],
    ["kan", "Kannada"],
    ["kat", "Georgian"],
    ["kat_old", "Georgian - Old"],
    ["kaz", "Kazakh"],
    ["khm", "Central Khmer"],
    ["kir", "Kirghiz; Kyrgyz"],
    ["kmr", "Kurmanji (Kurdish - Latin Script)"],
    ["kor", "Korean"],
    ["kor_vert", "Korean (vertical)"],
    ["lao", "Lao"],
    ["lat", "Latin"],
    ["lav", "Latvian"],
    ["lit", "Lithuanian"],
    ["ltz", "Luxembourgish"],
    ["mal", "Malayalam"],
    ["mar", "Marathi"],
    ["mkd", "Macedonian"],
    ["mlt", "Maltese"],
    ["mon", "Mongolian"],
    ["mri", "Maori"],
    ["msa", "Malay"],
    ["mya", "Burmese"],
    ["nep", "Nepali"],
    ["nld", "Dutch; Flemish"],
    ["nor", "Norwegian"],
    ["oci", "Occitan (post 1500)"],
    ["ori", "Oriya"],
    ["osd", "Orientation and script detection module"],
    ["pan", "Panjabi; Punjabi"],
    ["pol", "Polish"],
    ["por", "Portuguese"],
    ["pus", "Pushto; Pashto"],
    ["que", "Quechua"],
    ["ron", "Romanian; Moldavian; Moldovan"],
    ["rus", "Russian"],
    ["san", "Sanskrit"],
    ["sin", "Sinhala; Sinhalese"],
    ["slk", "Slovak"],
    ["slv", "Slovenian"],
    ["snd", "Sindhi"],
    ["spa", "Spanish; Castilian"],
    ["spa_old", "Spanish; Castilian - Old"],
    ["sqi", "Albanian"],
    ["srp", "Serbian"],
    ["srp_latn", "Serbian - Latin"],
    ["sun", "Sundanese"],
    ["swa", "Swahili"],
    ["swe", "Swedish"],
    ["syr", "Syriac"],
    ["tam", "Tamil"],
    ["tat", "Tatar"],
    ["tel", "Telugu"],
    ["tgk", "Tajik"],
    ["tha", "Thai"],
    ["tir", "Tigrinya"],
    ["ton", "Tonga"],
    ["tur", "Turkish"],
    ["aze", "Azerbaijani"],
    ["aze_cyrl", "Azerbaijani - Cyrilic"],
    ["uig", "Uighur; Uyghur"],
    ["ukr", "Ukrainian"],
    ["urd", "Urdu"],
    ["uzb", "Uzbek"],
    ["uzb_cyrl", "Uzbek - Cyrilic"],
    ["vie", "Vietnamese"],
    ["yid", "Yiddish"],
    ["yor", "Yoruba"],
];

export const languagesMap = {};
for (const comb of languages) { languagesMap[comb[0]] = comb[1]; }


function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}