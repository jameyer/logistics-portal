// src/components/ui/Stepper.tsx
import { Check, FilePlus, FileText, UploadCloud } from 'lucide-react';

interface StepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: 'Create eManifest', icon: FilePlus },
    { id: 2, name: 'Forms & Review', icon: FileText },
    { id: 3, name: 'Submit EDI', icon: UploadCloud },
];

export function Stepper({ currentStep }: StepperProps) {
    return (
        <nav aria-label="Progress" className="py-8">
            <ol className="flex items-center justify-between w-full max-w-3xl mx-auto">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const Icon = step.icon;

                    return (
                        <li key={step.id} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
                            <div className="flex flex-col items-center relative group">
                                <div
                                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                            isActive ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' :
                                                'bg-white border-slate-200 text-slate-400'}
                  `}
                                >
                                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                </div>

                                <span className={`
                  absolute -bottom-8 whitespace-nowrap text-sm font-medium
                  ${isActive ? 'text-blue-600' : 'text-slate-500'}
                `}>
                                    {step.name}
                                </span>
                            </div>

                            {/* Connecting Line */}
                            {index !== steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div className={`h-1 w-full rounded ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}