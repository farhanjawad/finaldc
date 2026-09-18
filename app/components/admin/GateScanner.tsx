'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyGateCheckIn, toggleCheckIn } from '@/app/actions/admin';
import { RegistrationRecord } from '@/app/lib/types';
import { 
  Camera, 
  CameraOff, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  UserCheck, 
  RefreshCw,
  Volume2
} from 'lucide-react';

export default function GateScanner() {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isPending, startTransition] = useTransition();
  const [scannedRecord, setScannedRecord] = useState<RegistrationRecord | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const qrRegionId = 'qr-gate-reader-region';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Audio feedback cues
  const playSound = (type: 'success' | 'warn' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'warn') {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // Extract clean registration code from raw scanned text or URL
  const extractCode = (rawText: string): string => {
    const trimmed = rawText.trim();
    if (trimmed.includes('/track')) {
      try {
        const url = new URL(trimmed, window.location.origin);
        return url.searchParams.get('code') || trimmed;
      } catch {
        return trimmed;
      }
    }
    if (trimmed.includes('/verify/')) {
      const parts = trimmed.split('/verify/');
      return parts[parts.length - 1].split('?')[0].trim();
    }
    return trimmed;
  };

  const handleProcessCode = (rawCode: string) => {
    const targetCode = extractCode(rawCode);
    if (!targetCode) return;

    setScanError(null);
    setScanMessage(null);

    startTransition(async () => {
      const res = await verifyGateCheckIn(targetCode);

      if (res.success && res.data) {
        setScannedRecord(res.data.registration);
        setAlreadyCheckedIn(res.data.alreadyCheckedIn);
        setScanMessage(res.message || 'যাচাই সফল হয়েছে।');

        if (res.data.alreadyCheckedIn) {
          playSound('warn');
        } else {
          playSound('success');
        }

        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(res.data.alreadyCheckedIn ? [100, 50, 100] : 150);
        }
      } else {
        setScannedRecord(res.data?.registration || null);
        setAlreadyCheckedIn(false);
        setScanError(res.error || 'রেজিস্ট্রেশনের কোনো বৈধ তথ্য পাওয়া যায়নি।');
        playSound('error');
      }
    });
  };

  // Start Camera Stream
  const startScanner = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessCode(decodedText);
        },
        () => {
          // Ignore transient scan frame errors
        }
      );

      setScannerActive(true);
    } catch (err: unknown) {
      console.error('Camera initialization error:', err);
      setCameraError('ক্যামেরা চালু করা সম্ভব হয়নি। ডিভাইসের পারমিশন চেক করুন অথবা ম্যানুয়াল সার্চ ব্যবহার করুন।');
      setScannerActive(false);
    }
  };

  // Stop Camera Stream
  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    } finally {
      setScannerActive(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessCode(manualCode);
  };

  const handleManualCheckInAction = (id: string) => {
    startTransition(async () => {
      const res = await toggleCheckIn(id, true);
      if (res.success) {
        setScannedRecord((prev) =>
          prev ? { ...prev, checked_in: true, checked_in_at: new Date().toISOString() } : null
        );
        setAlreadyCheckedIn(true);
        setScanMessage('প্রবেশ নিশ্চিত করা হয়েছে!');
        playSound('success');
      } else {
        setScanError(res.error || 'চেক-ইন নিশ্চিত করা সম্ভব হয়নি।');
        playSound('error');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Scanner & Manual Lookup Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Toggle Camera Control */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              কিউআর কোড গেট স্ক্যানার
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              অংশগ্রহণকারীর ডিজিটাল পাস বা আইডি কার্ড সরাসরি স্ক্যান করুন
            </p>
          </div>

          <button
            type="button"
            onClick={scannerActive ? stopScanner : startScanner}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              scannerActive
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
            }`}
          >
            {scannerActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>ক্যামেরা বন্ধ করুন</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>ক্যামেরা চালু করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Live Camera Viewport */}
        <div className={`mt-6 overflow-hidden rounded-2xl bg-black ${scannerActive ? 'block' : 'hidden'}`}>
          <div id={qrRegionId} className="w-full max-w-sm mx-auto aspect-square" />
        </div>

        {/* Camera Permission Alert */}
        {cameraError && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Manual Search Form */}
        <form onSubmit={handleManualSubmit} className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="ম্যানুয়াল কোড বা রোল (e.g. KU-XXXXXX / 260501)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>যাচাই</span>
            )}
          </button>
        </form>
      </div>

      {/* Lookup Error Message */}
      {scanError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="font-bold">যাচাই ব্যর্থ হয়েছে</p>
            <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{scanError}</p>
          </div>
        </div>
      )}

      {/* Participant Validation Outcome */}
      {scannedRecord && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Status Flag */}
          {scannedRecord.payment_status === 'approved' ? (
            alreadyCheckedIn ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="font-black text-sm">ইতিপূর্বে প্রবেশ সম্পন্ন হয়েছে (Already Checked-in)</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                    প্রবেশের সময়: {scannedRecord.checked_in_at ? new Date(scannedRecord.checked_in_at).toLocaleTimeString('bn-BD') : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-black text-sm">পাস অনুমোদিত (Entry Granted)</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                    {scanMessage || 'পেমেন্ট অনুমোদিত। শিক্ষার্থী সরাসরি প্রবেশ করতে পারেন।'}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <p className="font-black text-sm">অননুমোদিত পাস (Entry Denied)</p>
                <p className="text-xs text-rose-700 dark:text-rose-300/80 mt-0.5">
                  পেমেন্ট স্ট্যাটাস: {scannedRecord.payment_status.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">নাম / Full Name</span>
              <span className="font-bold text-slate-800 dark:text-white mt-0.5 block">{scannedRecord.full_name}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">স্টুডেন্ট আইডি / Roll</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white mt-0.5 block">{scannedRecord.student_id}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">ডিসিপ্লিন / Discipline</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">{scannedRecord.discipline}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">ব্যাচ ও ফি</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">
                Batch {scannedRecord.batch_year} • {scannedRecord.fee_amount} ৳ ({scannedRecord.payment_method})
              </span>
            </div>
          </div>

          {/* Gate Check-In Action Button (if not already checked in) */}
          {scannedRecord.payment_status === 'approved' && !scannedRecord.checked_in && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleManualCheckInAction(scannedRecord.id)}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>আপডেট করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  <span>প্রবেশ নিশ্চিত করুন (Check-In)</span>
                </>
              )}
            </button>
          )}

          {/* Reset View Button */}
          <button
            type="button"
            onClick={() => {
              setScannedRecord(null);
              setManualCode('');
              setScanError(null);
              setScanMessage(null);
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition pt-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>নতুন অনুসন্ধান / পরবর্তী স্ক্যান</span>
          </button>
        </div>
      )}

    </div>
  );
}