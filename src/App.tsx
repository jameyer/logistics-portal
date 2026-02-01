// src/App.tsx
import React, { useState } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import AciBorderFiling from './pages/AciBorderFiling';
import { Stepper } from './components/ui/Stepper';
import { useBorderFormLogic, type BorderFormValues } from './hooks/useAciBorderFiling';
import AciDocuments from './pages/AciDocuments';

function App() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { form, portOptions, proNumberOptions } = useBorderFormLogic('PARS');

    const handleNextStep = () => setCurrentStep((prev) => Math.min(3, prev + 1));
    const handlePrevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

    const onFinalSubmit: SubmitHandler<BorderFormValues> = (data) => {
        console.log("Transmitting EDI payload:", data);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Logistics <span className="text-blue-600">Compliance Portal</span>
                    </h1>
                </header>

                <Stepper currentStep={currentStep} />

                <FormProvider {...form}>
                    <main className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">

                        {/* STEP 1: CREATE E-MANIFEST */}
                        {currentStep === 1 && (
                            <div className="text-center py-10">
                                <AciBorderFiling
                                    onNext={handleNextStep}
                                    portOptions={portOptions}
                                    proNumberOptions={proNumberOptions}
                                />
                            </div>
                        )}


                        {/* STEP 2: Forms and Review */}
                        {currentStep === 2 && (
                            <div className="text-center py-4">
                                {/* Render the document generator/viewer */}
                                <AciDocuments />

                                <div className="mt-8">
                                    <button
                                        onClick={handleNextStep}
                                        className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                    >
                                        Approve & Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUBMIT EDI */}
                        {currentStep === 3 && (
                            <div className="text-center py-10">
                                <h2 className="text-xl font-bold mb-4">Submit EDI</h2>
                                <p className="text-slate-500 mb-8">Ready to transmit to CBSA?</p>
                                <button
                                    onClick={form.handleSubmit(onFinalSubmit)}
                                    className="bg-green-600 text-white px-6 py-3 rounded font-bold uppercase hover:bg-green-700"
                                >
                                    Transmit EDI
                                </button>
                            </div>
                        )}

                        {currentStep > 1 && (
                            <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
                                <button
                                    onClick={handlePrevStep}
                                    className="px-6 py-2 font-semibold text-slate-600 hover:text-slate-900"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </main>
                </FormProvider>
            </div>
        </div>
    );
}

export default App;