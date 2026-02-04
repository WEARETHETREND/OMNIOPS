import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        scanQRCode();
      }
    } catch (error) {
      toast.error('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const scanQRCode = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      setScannedData(code.data);
      onScan(code.data);
      setScanning(false);
    } else if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Scan Item QR Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!scannedData ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-square">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 border-2 border-cyan-400 rounded-xl pointer-events-none">
                <div className="absolute inset-4 border-2 border-cyan-400/50"></div>
              </div>
              <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400 opacity-50" />
            </div>
            <p className="text-sm text-slate-500 text-center">Position QR code in frame</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-emerald-900 mb-1">QR Code Detected</p>
                <p className="text-sm text-emerald-700 break-all font-mono bg-white/50 p-2 rounded">
                  {scannedData}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setScannedData(null)} 
                variant="outline"
                className="flex-1"
              >
                Scan Another
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}