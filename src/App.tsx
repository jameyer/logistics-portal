// src/App.tsx
import { useState } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import AciBorderFiling from './pages/AciBorderFiling';
import { Stepper } from './components/ui/Stepper';
import { useBorderFormLogic, type BorderFormValues } from './hooks/useAciBorderFiling';
import AciDocuments from './pages/AciDocuments';

function App() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { form, portOptions, proNumberOptions } = useBorderFormLogic('PARS');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');

    const handleNextStep = () => setCurrentStep((prev) => Math.min(3, prev + 1));
    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1));
        setSubmissionStatus('idle');
    };

    const onFinalSubmit: SubmitHandler<BorderFormValues> = (data) => {
        setIsSubmitting(true);
        console.log("Transmitting EDI payload:", data);

        // Simulate EDI transmission delay
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmissionStatus('success');
        }, 2500);
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
                                <AciDocuments portOptions={portOptions} />

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

                        {/* STEP 3: SUBMIT TO EDI */}
                        {currentStep === 3 && (
                            <div className="text-center py-10">
                                <h2 className="text-xl font-bold mb-4">Submit To EDI</h2>
                                
                                {submissionStatus === 'success' ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto animate-in fade-in zoom-in duration-300">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-green-800 font-bold text-lg">Transmission accepted by EDI</p>
                                            <p className="text-green-600 mt-2">Your documents have been successfully queued.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-slate-500 mb-8">Ready to transmit to CBSA?</p>
                                        <button
                                            onClick={form.handleSubmit(onFinalSubmit)}
                                            disabled={isSubmitting}
                                            className={`
                                                px-6 py-3 rounded font-bold uppercase text-white transition-all
                                                ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                                            `}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Transmitting...
                                                </span>
                                            ) : 'Transmit EDI'}
                                        </button>
                                    </>
                                )}
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