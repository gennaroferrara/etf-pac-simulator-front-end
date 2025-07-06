import { TrendingUp, Database } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">ETF PAC Simulator</h1>
                <p className="text-xs text-gray-500">Advanced Portfolio Analysis</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Status */}
          <div className="flex items-center space-x-4">
            {/* API Status */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Database className="h-4 w-4" />
              <span>API Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;