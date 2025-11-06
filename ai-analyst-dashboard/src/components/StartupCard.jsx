import { Building, TrendingUp, CheckCircle } from 'lucide-react';

function StartupCard({ data, memo }) {
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Building className="mr-2" />
        Startup Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700">Name</h3>
          <p className="text-lg">{data.startup_name}</p>
        </div>
        <div className="bg-white/50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700">Stage</h3>
          <p className="text-lg">{data.stage}</p>
        </div>
        <div className="bg-white/50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700">Recommendation</h3>
          <p className="text-lg flex items-center">
            <CheckCircle className="mr-2 text-green-600" />
            {memo.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StartupCard;
