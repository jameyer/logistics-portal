import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';
import { ShipmentDataProvider } from '../src/context/ShipmentDataProvider';


// Mock ScrollTo to avoid jsdom errors
window.scrollTo = vi.fn();

// Mock pdfGenerator to avoid canvas/bwip-js errors in JSDOM
vi.mock('../src/utils/pdfGenerator', () => ({
    generateCoverSheet: vi.fn().mockResolvedValue(new Uint8Array([])),
    generateBol: vi.fn().mockResolvedValue(new Uint8Array([])),
    generateCommercialInvoice: vi.fn().mockResolvedValue(new Uint8Array([])),
}));

const renderApp = () => {
    return render(
        <ShipmentDataProvider>
            <App />
        </ShipmentDataProvider>
    );
};

describe('System Test: Logistics Portal Flow', () => {
    it('completes the full ACI eManifest submission flow', async () => {
        renderApp();

        // --- STEP 1: CREATE E-MANIFEST ---
        expect(screen.getByText(/ACI eManifest Filing/i)).toBeInTheDocument();

        // Select Pro Number
        const proSelect = screen.getByRole('combobox', { name: /Internal Reference/i });
        fireEvent.change(proSelect, { target: { value: '6913784694' } });

        // Select Port
        const portSelect = screen.getByRole('combobox', { name: /First Port of Arrival/i });
        fireEvent.change(portSelect, { target: { value: '0702' } });

        // Fill Date and Time
        fireEvent.change(screen.getByLabelText(/Estimated Date/i), { target: { value: '2026-02-02' } });
        fireEvent.change(screen.getByLabelText(/Estimated Time/i), { target: { value: '12:00' } });

        // Submit Step 1
        fireEvent.click(screen.getByRole('button', { name: /Create ACI Documents/i }));

        // --- STEP 2: FORMS & REVIEW ---
        const approveBtn = await screen.findByRole('button', { name: /Approve & Continue/i });
        fireEvent.click(approveBtn);

        // --- STEP 3: SUBMIT TO EDI ---
        await screen.findByRole('heading', { name: /Submit To EDI/i });
        const transmitBtn = screen.getByRole('button', { name: /Transmit EDI/i });

        // Click Transmit
        fireEvent.click(transmitBtn);

        // Verify Loading and Success states
        expect(await screen.findByText(/Transmitting.../i)).toBeInTheDocument();

        const successMsg = await screen.findByText(/Transmission accepted by EDI/i, {}, { timeout: 4000 });
        expect(successMsg).toBeInTheDocument();

        // --- STEP 4: BACK & RESET VERIFICATION ---
        fireEvent.click(screen.getByRole('button', { name: /Back/i }));
        expect(await screen.findByRole('button', { name: /Approve & Continue/i })).toBeInTheDocument();

        // Return to Step 3 and verify reset
        fireEvent.click(screen.getByRole('button', { name: /Approve & Continue/i }));
        await screen.findByRole('heading', { name: /Submit To EDI/i });
        expect(screen.getByRole('button', { name: /Transmit EDI/i })).toBeInTheDocument();
        expect(screen.queryByText(/Transmission accepted by EDI/i)).not.toBeInTheDocument();
    });
});