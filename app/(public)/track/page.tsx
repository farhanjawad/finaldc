'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Search, Camera, CameraOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { trackRegistration } from '@/app/actions/track';

interface GateScannerViewProps {
  onCheckIn?: (code: string) => Promise<any>;
}

export default function GateScannerView({ onCheckIn }: GateScannerViewProps) {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'reader-container';

  const processCheckIn = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    setStatusMessage(null);
    startTransition(async () => {
      try {
        if (onCheckIn) {
          const res = await onCheckIn(cleanCode);
          if (res?.success) {
            setStatusMessage({ type: 'success', text: `চেক-ইন সফল: ${cleanCode}` });
            setScanResult(res.data ?? null);
          } else {
            setStatusMessage({ type: 'error', text: res?.error ?? 'চেক-ইন ব্যর্থ হয়েছে।' });
          }
        } else {
          const res = await trackRegistration(cleanCode);
          if (res.success && res.data) {
            setScanResult(res.data);
            if (res.data.checked_in) {
              setStatusMessage({ type: 'warning', text: 'এই পাসটি ইতিমধ্যে ব্যবহার করা হয়েছে!' });
            } else if (res.data.payment_status !== 'approved') {
              setStatusMessage({ type: 'error', text: 'পেমেন্ট অনুমোদিত নয়!' });
            } else {
              setStatusMessage({ type: 'success', text: `যাচাই সম্পন্ন: ${res.data.full_name}` });
            }
          } else {
            setStatusMessage({ type: 'error', text: res.error ?? 'কোনো রেকর্ড পাওয়া যায়নি।' });
          }
        }
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err?.message || 'যাচাইকরণে সমস্যা হয়েছে।' });
      }
    });
  };

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // 4 arguments provided: camera facingMode, config, onScanSuccess, onScanFailure
      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          let parsedCode = decodedText;
          if (decodedText.includes('/track/')) {
            const parts = decodedText.split('/track/');
            parsedCode = parts[parts.length - 1].replace(/[^a-zA-Z0-9_-]/g, '');
          }
          processCheckIn(parsedCode);
        },
        () => {
          // ignore frame scan misses
        }
      );

      setScannerActive(true);
    } catch (err) {
      console.error('Camera start error:', err);
      setStatusMessage({ type: 'error', text: 'ক্যামেরা চালু করা সম্ভব হয়নি। পারমিশন চেক করুন।' });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setScannerActive(false);
      } catch (err) {
        console.error('Camera stop error:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCheckIn(manualCode);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Scanner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            গেট কিউআর স্ক্যানার
          </h2>
          <button
            type="button"
            onClick={scannerActive ? stopScanner : startScanner}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              scannerActive
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {scannerActive ? (
              <>
                <CameraOff className="w-4 h-4" /> ক্যামেরা বন্ধ করুন
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" /> ক্যামেরা চালু করুন
              </>
            )}
          </button>
        </div>

        {/* Viewfinder element */}
        <div
          id={scannerContainerId}
          className={`overflow-hidden rounded-2xl bg-black transition-all ${
            scannerActive ? 'min-h-70' : 'h-0'
          }`}
        />

        {/* Manual Input Form */}
        <form onSubmit={handleManualSubmit} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="আইডি বা কোড লিখুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !manualCode.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'চেক-ইন'}
          </button>
        </form>

        {/* Status Feedback Alerts */}
        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {statusMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {statusMessage.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            <span className="font-semibold">{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Scanned Result Card */}
      {scanResult && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-400">নাম:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{scanResult.full_name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-400">স্টুডেন্ট আইডি:</span>
            <span className="font-mono font-bold">{scanResult.student_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">রেজিস্ট্রেশন কোড:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{scanResult.reg_code}</span>
          </div>
        </div>
      )}
    </div>
  );
}