# Free OCR tool running privately inside your browser

Convert your scanned PDF files to searchable PDFs with this tool. Using [Tesseract.js](https://tesseract.projectnaptha.com/) for getting high accuracy and big list of languages (including **Armenian**). The performance is not enough good for handling big files, but for medium-sized documents it's enough. Thanks to progress updates in the UI, you will know how many pages are already processed and other useful information for understanding the progress.

Currently the number of tesseract.js workers are limitted to 4 to prevent big loads on the system.

You also can use multiple languages, but doing so will drop the performance, so for getting better performance use fewer languages.

The website: https://kostard.github.io/web_ocr/
- click on the already selected (greenish) langauge label to deselect it
- find the language you want to use and press "Select language"
- order of the provided languages will probably affect the result (first provided language will probably be the main language) [not tested]
- after selecting the languages, click on the file input or drag and drop your file, after which the process will automatically start running

## Demo:

Before - pdf with scanned pages 

<p align="center">
  <img src="https://user-images.githubusercontent.com/30292877/109553626-89971480-7ad3-11eb-94a0-669a304eeb5f.PNG">
</p>

After - pdf with the same images and text on top of it

<p align="center">
  <img src="https://user-images.githubusercontent.com/30292877/109553615-86038d80-7ad3-11eb-9c85-5e6e9a2398b7.PNG">
</p>

The text from the output copy-pasted to show the accuracy

<p align="center">
  <img src="https://user-images.githubusercontent.com/30292877/109553625-8865e780-7ad3-11eb-983f-afb413b98881.PNG">
</p>
