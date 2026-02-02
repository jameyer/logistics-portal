import { clsx } from 'clsx';
import React, { useEffect } from 'react';
import { useFormContext, useWatch, type FieldErrors, type FieldPath } from 'react-hook-form';
import type { BorderFormValues } from '../hooks/useAciBorderFiling';
import { PORT_INFO } from '../assets/ports';

// Type guards for the discriminated union
type ParsValues = Extract<BorderFormValues, { shipmentType: 'PARS' }>;
type InParsValues = Extract<BorderFormValues, { shipmentType: 'INPARS' }>;

interface StepProps {
    onNext: () => void;
    portOptions: Array<{ value: string; label: string; subLocation?: string; releaseOffice?: string }>;
    proNumberOptions: Array<{ value: string; label: string }>;
}

const AciBorderFiling = ({ onNext, portOptions, proNumberOptions }: StepProps) => {
    const {
        register,
        setValue,
        control,
        trigger,
        formState: { errors }
    } = useFormContext<BorderFormValues>();

    const shipmentType = useWatch({ control, name: 'shipmentType' });
    const port = useWatch({ control, name: 'port' }); // 'port' may not exist on INPARS

    // Narrow errors based on shipmentType
    const parsErrors = shipmentType === 'PARS' ? (errors as FieldErrors<ParsValues>) : undefined;
    const inParsErrors = shipmentType === 'INPARS' ? (errors as FieldErrors<InParsValues>) : undefined;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await trigger();
        if (isValid) {
            onNext();
        }
    };

    const proNumber = useWatch({ control, name: 'proNumber' });
    // If carrierCode is static, define it; if it's dynamic, useWatch it
    const carrierCode = "TEST";

    useEffect(() => {
        const foundPort = PORT_INFO.find(p => p.port === port);
        if (!foundPort) return;

        if (shipmentType === 'INPARS') {
            setValue('subLocation', foundPort.subLocation, { shouldValidate: true });
            setValue('releaseOffice', foundPort.releaseOffice, { shouldValidate: true });
        }
    }, [port, shipmentType, setValue]);

    useEffect(() => {
        const generateCCN = () => {
            if (!proNumber) return;
            // Combine carrierCode and proNumber for a valid ACI CCN
            const newCcn = `${carrierCode}${proNumber}`.toUpperCase();
            setValue('ccn', newCcn, { shouldValidate: true });
        };
        generateCCN();
    }, [proNumber, setValue]);


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white border border-slate-300 shadow-lg rounded-sm font-sans">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div className="flex-1">
                    <label className="block text-[10px] font-black text-blue-900 uppercase italic">Internal Reference</label>
                    <select {...register('proNumber')}>
                        {proNumberOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errors.proNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.proNumber.message}</p>
                    )}
                </div>
                <div className="text-right">
                    <h2 className="text-sm font-black uppercase">ACI eManifest Filing</h2>
                </div>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
                {/* 1. SHIPMENT TYPE SELECTOR */}
                <div className="flex gap-2">
                    {['PARS', 'INPARS'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setValue('shipmentType', type as 'PARS' | 'INPARS')}
                            className={clsx(
                                'flex-1 py-2 px-4 text-xs font-bold border transition-all cursor-pointer',
                                {
                                    'bg-slate-900 border-slate-900 text-white': shipmentType === type,
                                    'bg-white border-slate-300 text-slate-400 hover:bg-slate-50': shipmentType !== type,
                                }
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* 2. CORE BORDER DATA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column A: Identification */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-[10px] font-bold text-slate-600 uppercase">Cargo Control Number (CCN)</label>
                            <div className="flex gap-2">
                                <input
                                    {...register('ccn')}
                                    type="text"
                                    placeholder="SCAC + Shipment ID"
                                    className="border-b border-slate-400 py-1 font-mono uppercase focus:border-blue-600 outline-none flex-1"
                                />
                            </div>
                            {errors.ccn && <p className="mt-1 text-sm text-red-600">{errors.ccn.message}</p>}
                        </div>

                        <div className={clsx('flex flex-col transition-all', { 'opacity-100': shipmentType === 'INPARS', 'opacity-30': shipmentType !== 'INPARS' })}>
                            <label className="text-[10px] font-bold text-slate-600 uppercase">Sub-Location Code</label>
                            <input
                                {...register('subLocation' as FieldPath<BorderFormValues>)}
                                disabled={shipmentType !== 'INPARS'}
                                className="border-b border-slate-400 py-1 font-mono outline-none"
                            />
                            {inParsErrors?.subLocation && (
                                <p className="mt-1 text-sm text-red-600">{inParsErrors.subLocation.message}</p>
                            )}

                            <label className="text-[10px] font-bold text-slate-600 uppercase mt-4">Release Office</label>
                            <input
                                {...register('releaseOffice' as FieldPath<BorderFormValues>)}
                                disabled={shipmentType !== 'INPARS'}
                                className="border-b border-slate-400 py-1 font-mono outline-none"
                            />
                            {inParsErrors?.releaseOffice && (
                                <p className="mt-1 text-sm text-red-600">{inParsErrors.releaseOffice.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Column B: Routing */}
                    <div className="space-y-4">
                        <div className={`flex flex-col transition-all `}>
                            <label className="text-[10px] font-bold text-slate-600 uppercase">First Port of Arrival</label>
                            <select
                                {...register('port' as FieldPath<BorderFormValues>)}

                            >
                                <option value="">Select Port</option>
                                {portOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {parsErrors?.port && (
                                <p className="mt-1 text-sm text-red-600">{parsErrors.port.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-600 uppercase">Estimated Date</label>
                                <input {...register('date')} type="date" className="border-b border-slate-400 py-1 outline-none" />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-600 uppercase">Estimated Time</label>
                                <input {...register('time')} type="time" className="border-b border-slate-400 py-1 outline-none" />
                                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TRANSMISSION ACTION */}
                <div className="mt-8 border-t pt-6 flex justify-between items-center">
                    <p className="text-[9px] text-slate-400 max-w-xs uppercase leading-tight font-bold italic">
                        Note: Data must be transmitted to CBSA at least 1 hour prior to arrival.
                    </p>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-sm shadow-lg text-xs tracking-tighter transition-transform active:scale-95 uppercase"
                    >
                        Create ACI Documents
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AciBorderFiling;