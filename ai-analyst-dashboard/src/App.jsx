import { useState } from 'react';
import { Upload, BarChart3, FileText } from 'lucide-react';
import UploadForm from './components/UploadForm';
import StartupCard from './components/StartupCard';
import RiskBadge from './components/RiskBadge';
import ChartBox from './components/ChartBox';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const { analyzePitchDeck } = await import('./services/api');
      const result = await analyzePitchDeck(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Analyst Dashboard</h1>
          <p className="text-gray-600">Upload a pitch deck to get AI-powered startup analysis</p>
        </header>

        {/* Upload Form */}
        <div className="card mb-8">
          <UploadForm onAnalyze={handleAnalysis} loading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="card mb-8 bg-red-50 border-red-200">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Startup Summary */}
            <StartupCard data={analysisResult.structuredData} memo={analysisResult.memo} />

            {/* Risks */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Upload className="mr-2" />
                Risks
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysisResult.risks.map((risk, index) => (
                  <RiskBadge key={index} risk={risk} />
                ))}
              </div>
            </div>

            {/* Benchmarks */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BarChart3 className="mr-2" />
                Benchmarks
              </h2>
              <ChartBox benchmarks={analysisResult.benchmarks} />
            </div>

            {/* Full JSON */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2" />
                Full Analysis
              </h2>
              <details>
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Click to view full JSON output
                </summary>
                <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
