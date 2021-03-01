## Free OCR tool running privately inside your browser

Convert your scanned PDF files to searchable PDFs with this tool. Using [Tesseract.js](https://tesseract.projectnaptha.com/) for getting high accuracy and big list of languages (including **Armenian**). The performance is not enough good for handling big files, but for medium-sized documents it's enough. Thanks to progress updates in the UI, you will know how many pages are already processed and other useful information for understanding the progress.

Currently the number of tesseract.js workers are limitted to 4 to prevent big loads on the system.

You also can use multiple languages, but doing so will drop the performance, so for getting better performance use fewer languages.

The website: https://kostard.github.io/web_ocr/
- click on the already selected (greenish) langauge label to deselect it
- find the language you want to use and press "Select language"
- order of the provided languages will probably affect the result (first provided language will probably be the main language) [not tested]
- after selecting the languages, click on the file input or drag and drop your file, after which the process will automatically start running