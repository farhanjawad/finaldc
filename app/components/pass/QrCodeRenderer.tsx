'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeRendererProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QrCodeRenderer({
  value,
  size = 140,
  className = '',
}: QrCodeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: '#0f172a', // Tailwind slate-900
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) {
            console.error('Failed to generate QR code:', error);
          }
        }
      );
    }
  }, [value, size]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />
    </div>
  );
}