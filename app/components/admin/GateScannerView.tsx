'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { trackRegistration as getRegistrationStatus } from '@/app/actions/track';
import { toggleCheckIn } from '@/app/actions/admin';
import { RegistrationRecord } from '@/app/lib/types';
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  Hash, 
  User, 
  GraduationCap 
} from 'lucide-react';

export default function GateScannerView() {
  const [manualCode, setManualCode] = useState('');
  const [attendee, setAttendee] = useState<RegistrationRecord | any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const processLookup = async (code: string) => {
    if (!code.trim()) return;

    setStatusMessage(null);
    setAttendee(null);

    const res = await getRegistrationStatus(code.trim());

    if (!res.success || !res.data) {
      setStatusMessage({
        text: res.error || 'রেজিস্ট্রেশন পাওয়া যায়নি।',
        type: 'error',
      });
      return;
    }

    setAttendee(res.data);

    if (res.data.payment_status !== 'approved') {
      setStatusMessage({
        text: 'সতর্কতা: এই রেজিস্ট্রেশনের পেমেন্ট অনুমোদিত নয়!',
        type: 'warning',
      });
    } else if (res.data.checked_in) {
      setStatusMessage({
        text: 'সতর্কতা: এই অংশগ্রহণকারী ইতিপূর্বে চেক-ইন সম্পন্ন করেছেন!',
        type: 'warning',
      });
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      processLookup(manualCode);
    });
  };

  const startScanner = async () => {
  try {
    const html5QrCode = new Html5Qrcode('qr-reader', false);
    scannerRef.current = html5QrCode;

    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        // If URL is scanned (e.g. /track/KU-12345), extract the code
        const code = decodedText.includes('/') 
          ? decodedText.split('/').pop() || decodedText 
          : decodedText;

        setManualCode(code);
        stopScanner();
        startTransition(() => {
          processLookup(code);
        });
      },
      () => {}
    );
    setIsScanning(true);
  } catch (err) {
    console.error('QR Scanner init error:', err);
    setStatusMessage({
      text: 'ক্যামেরা চালু করা সম্ভব হয়নি। অনুমতি প্রদান করুন।',
      type: 'error',
    });
  }
};

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping QR scanner:', err);
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleGateCheckIn = () => {
    if (!attendee) return;

    startTransition(async () => {
      const res = await toggleCheckIn(attendee.reg_code);
      if (res.success) {
        setAttendee((prev: any) => ({
          ...prev,
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        }));
        setStatusMessage({
          text: 'চেক-ইন সফলভাবে সম্পন্ন হয়েছে!',
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: res.error || 'চেক-ইন প্রক্রিয়া ব্যর্থ হয়েছে।',
          type: 'error',
        });
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        
        {/* Toggle Scanner Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>গেট স্ক্যানার ও ভেরিফিকেশন</span>
          </h2>

          <button
            type="button"
            onClick={isScanning ? stopScanner : startScanner}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              isScanning
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
            }`}
          >
            {isScanning ? (
              <>
                <CameraOff className="w-4 h-4" />
                <span>ক্যামেরা বন্ধ করুন</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>ক্যামেরা স্ক্যান</span>
              </>
            )}
          </button>
        </div>

        {/* QR Scanner Display Area */}
        <div 
          id="qr-reader" 
          className={`w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 ${
            isScanning ? 'block mb-6' : 'hidden'
          }`}
        />

        {/* Manual Input Search Form */}
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="রেজিস্ট্রেশন কোড বা আইডি লিখুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'যাচাই'}
          </button>
        </form>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : statusMessage.type === 'warning' ? (
              <Clock className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Attendee Details Card */}
      {attendee && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">রেজিস্ট্রেশন কোড</span>
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {attendee.reg_code}
              </span>
            </div>
            <div>
              {attendee.checked_in ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                  ইতিপূর্বে এন্ট্রি সম্পন্ন
                </span>
              ) : attendee.payment_status === 'approved' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  অনুমোদিত পাস
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                  পেমেন্ট বকেয়া
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold truncate">{attendee.full_name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Hash className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-mono">{attendee.student_id}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <span>ডিসিপ্লিন: {attendee.discipline || '29'}</span>
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              <span>ফি: </span>
              <span className="font-bold text-emerald-600">{attendee.fee_amount || 0} ৳</span>
            </div>
          </div>

          {/* Gate Entry Check-in Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGateCheckIn}
              disabled={isPending || attendee.payment_status !== 'approved' || attendee.checked_in}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {attendee.checked_in ? 'চেক-ইন নিশ্চিত করা হয়েছে' : 'প্রবেশ নিশ্চিত করুন (Check-In)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}