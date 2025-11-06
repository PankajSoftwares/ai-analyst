import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

function UploadForm({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">TXT, PDF, or ZIP files</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".txt,.pdf,.zip"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {file && (
        <p className="text-sm text-gray-600 text-center">
          Selected: {file.name}
        </p>
      )}
      <button
        type="submit"
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Upload className="mr-2" />
            Analyze Pitch Deck
          </>
        )}
      </button>
    </form>
  );
}

export default UploadForm;
