const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const vision = require('@google-cloud/vision');

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  } else if (ext === '.zip') {
    // Extract ZIP and read all text files
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    let combinedText = '';

    zipEntries.forEach((entry) => {
      if (!entry.isDirectory && path.extname(entry.entryName).toLowerCase() === '.txt') {
        combinedText += zip.readAsText(entry) + '\n';
      }
    });

    return combinedText || 'No text files found in ZIP.';
  } else if (ext === '.pdf') {
    // Use Google Vision API for PDF OCR
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.documentTextDetection(filePath);
    const fullTextAnnotation = result.fullTextAnnotation;
    return fullTextAnnotation ? fullTextAnnotation.text : 'No text extracted from PDF.';
  } else {
    return 'Unsupported file type.';
  }
}
module.exports = { extractText };
