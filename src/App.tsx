import React from 'react';
import AciBorderFiling from './pages/AciBorderFiling';
import { useState } from 'react';
import { Stepper } from './components/ui/Stepper';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Logistics <span className="text-blue-600">Compliance Portal</span>
          </h1>
        </header>
        {/* Fetch Shipments */}
        

        <Stepper currentStep={currentStep} />

        <main className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
          {/* Step Content Logic */}
          {currentStep === 1 && <div className="text-center py-10"><AciBorderFiling /></div>}
          {currentStep === 2 && <div className="text-center py-10">Manifest Logic Goes Here</div>}
          {currentStep === 3 && <div className="text-center py-10">PDF Review Goes Here</div>}

          <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
              className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === 3 ? 'Finish & Export' : 'Next Step'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
