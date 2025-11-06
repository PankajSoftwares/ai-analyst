const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { extractText } = require('./ocr');
const { extractStartupData } = require('./extract');
const { analyzeRisks } = require('./riskAnalyzer');
const { generateBenchmarks } = require('./benchmarker');
const { generateMemo } = require('./memoGenerator');
const { saveReport } = require('./firebaseClient');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

app.post('/analyze', upload.single('file'), async (req, res) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  try {
    const filePath = req.file ? req.file.path : req.body.filePath;
    console.log(`Processing file: ${req.file ? req.file.originalname : 'unknown file'}`);
    const rawText = await extractText(filePath);
    console.log(`Extracted text length: ${rawText.length} characters`);
    const structuredData = JSON.parse(await extractStartupData(rawText));
    console.log(`Extracted startup data: ${structuredData.startup_name}`);
    const risks = await analyzeRisks(structuredData);
    const benchmarks = generateBenchmarks(structuredData);
    const memo = await generateMemo(structuredData, risks, benchmarks);

    const finalOutput = { structuredData, risks, benchmarks, memo };
    await saveReport(finalOutput);
    res.json(finalOutput);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.listen(process.env.PORT || 8080, () => console.log('AI Analyst Server running...'));
