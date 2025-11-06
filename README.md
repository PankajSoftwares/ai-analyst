# AI Analyst for Startup Evaluation

A full AI-powered analyst system that automatically reviews startup pitch decks, emails, or transcripts, extracts structured data, performs risk and benchmark analysis, and produces a complete investor-ready summary and JSON report.

## Features

- **OCR Extraction**: Uses Google Cloud Vision to extract text from pitch decks or documents.
- **LLM Data Extraction**: Leverages OpenAI GPT-4o-mini to parse and structure startup data.
- **Risk Analysis**: Identifies potential risks based on extracted metrics.
- **Benchmarking**: Compares startup metrics against industry standards.
- **Memo Generation**: Creates investor-ready summaries.
- **Cloud Persistence**: Saves reports to Firebase Firestore.

## Setup

1. **Initialize Node Project**
   ```bash
   npm install
   ```

2. **Enable Google Cloud APIs**
   - Vertex AI (Gemini)
   - Cloud Vision
   - BigQuery
   - Firebase (Firestore & Storage)

3. **Environment Variables**
   Create a `.env` file with:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   FIREBASE_PROJECT_ID=your_project_id
   OPENAI_API_KEY=your_openai_api_key
   PORT=8080
   ```

## Usage

1. **Start Server**
   ```bash
   npm start
   ```

2. **Visit UI**
   Open [http://localhost:8080](http://localhost:8080)

3. **Upload Pitch Deck**
   Use the simple UI to upload a file or provide a file path for analysis.

## API Endpoint

- `POST /analyze`: Accepts `{ filePath: "path/to/file.pdf" }` and returns structured analysis.

## Deployment

- Deploy on Google Cloud Run
- Host Firebase UI + Cloud Functions backend
- Dockerize and run locally

## Future Improvements

- Add generative summaries with Gemini 1.5 Pro
- Integrate Crunchbase API for real benchmarks
- Add investor dashboard with filtering (React + Firestore)
- Export PDF investor memos automatically
