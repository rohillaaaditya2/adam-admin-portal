'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Image as ImageIcon, Crop, Move, ZoomIn, ZoomOut,
  RotateCcw, Check, Sparkles, Layout, Smartphone, Eye, Trash2
} from 'lucide-react';
import { API, api } from '@/lib/api';
import { resolveMediaUrl } from '@/lib/useBranding';

interface LogoManagementPanelProps {
  currentLogoUrl: string;
  currentLogoSquareUrl: string;
  communityName: string;
  onSave: (wideUrl: string, squareUrl: string) => Promise<void>;
  onReset: () => Promise<void>;
  setError: (msg: string) => void;
  setNotice: (msg: string) => void;
}

export function LogoManagementPanel({
  currentLogoUrl,
  currentLogoSquareUrl,
  communityName,
  onSave,
  onReset,
  setError,
  setNotice
}: LogoManagementPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(currentLogoUrl ? resolveMediaUrl(currentLogoUrl) : '');
  const [aspectRatio, setAspectRatio] = useState<'wide' | 'square'>('wide');
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when currentLogoUrl changes if user hasn't selected a new local file
  useEffect(() => {
    if (!selectedFile && currentLogoUrl) {
      setImageSrc(resolveMediaUrl(currentLogoUrl));
    }
  }, [currentLogoUrl, selectedFile]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !/\.(png|webp|jpe?g|svg)$/i.test(file.name)) {
      setError('Please select a genuine PNG, WebP, SVG, or JPG image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Platform logo file size must not exceed 2MB.');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setZoom(1);
        setPanX(0);
        setPanY(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-to-reposition logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper to crop image to Canvas and export Blob
  const exportCroppedBlob = async (targetWidth: number, targetHeight: number): Promise<Blob | null> => {
    if (!imageSrc) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        // Clear with transparency (alpha channel preserved for PNG/WebP)
        ctx.clearRect(0, 0, targetWidth, targetHeight);

        // Center point
        ctx.save();
        ctx.translate(targetWidth / 2 + panX, targetHeight / 2 + panY);
        ctx.scale(zoom, zoom);

        // Draw image centered
        const aspect = img.width / img.height;
        let drawW = targetWidth;
        let drawH = targetWidth / aspect;
        if (drawH < targetHeight) {
          drawH = targetHeight;
          drawW = targetHeight * aspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };
      img.onerror = () => resolve(null);
      img.src = imageSrc;
    });
  };

  // Save cropped logo to server
  const handleSaveLogo = async () => {
    if (!imageSrc) {
      setError('Please select or upload an image file first.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let finalWideUrl = currentLogoUrl;
      let finalSquareUrl = currentLogoSquareUrl;

      // 1. Export Wide variant (360x100)
      const wideBlob = await exportCroppedBlob(360, 100);
      if (!wideBlob) {
        throw new Error('Failed to export cropped wide logo canvas.');
      }
      const formData = new FormData();
      formData.append('logo', wideBlob, 'platform-logo-wide.png');
      const res: any = await api('/admin/logo/upload', {
        method: 'POST',
        body: formData
      });
      if (!res?.url || res?.error) {
        throw new Error(res?.error || 'Server failed to process or store the wide logo image.');
      }
      finalWideUrl = res.url;

      // 2. Export Square variant (200x200)
      const squareBlob = await exportCroppedBlob(200, 200);
      if (squareBlob) {
        const formDataSquare = new FormData();
        formDataSquare.append('logo', squareBlob, 'platform-logo-square.png');
        const resSquare: any = await api('/admin/logo/upload', {
          method: 'POST',
          body: formDataSquare
        });
        if (resSquare?.url && !resSquare.error) {
          finalSquareUrl = resSquare.url;
        } else if (resSquare?.error) {
          throw new Error(resSquare.error);
        }
      }

      await onSave(finalWideUrl, finalSquareUrl || finalWideUrl);
      setSelectedFile(null);
      setNotice('Platform logo uploaded, cropped, and published live across the site!');
    } catch (err: any) {
      setError('Failed to upload and crop logo: ' + (err.message || 'Server error'));
      setNotice('');
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('Revert platform logo to default system branding (Heart + Community Name)?')) {
      setImageSrc('');
      setSelectedFile(null);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      await onReset();
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid #e2d9cd',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18, borderBottom: '1px solid #f1ece4', paddingBottom: 14 }}>
        <div>
          <span className="eyebrow tiny" style={{ color: '#c2185b', fontWeight: 800 }}>BRAND MARK &amp; LOGO STUDIO</span>
          <h3 style={{ margin: '2px 0 0', fontSize: 18, color: '#1e293b' }}>
            Platform Brand Logo &amp; App Icon
          </h3>
          <small style={{ color: '#64748b', fontSize: 12 }}>
            Upload, crop, zoom, and align your official matrimony brand mark for the public Navbar, Footer, Mobile App, and PDF biodatas.
          </small>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {currentLogoUrl ? (
            <span className="status-pill success" style={{ fontSize: 11, padding: '5px 12px' }}>
              ✓ Custom Logo Active
            </span>
          ) : (
            <span className="status-pill info" style={{ fontSize: 11, padding: '5px 12px' }}>
              Default Heart Mark Active
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: 24, alignItems: 'start' }}>
        {/* LEFT: Cropper Viewport with Drag & Zoom */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              Interactive Cropper &amp; Canvas
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setAspectRatio('wide')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: aspectRatio === 'wide' ? '1.5px solid #c2185b' : '1px solid #cbd5e1',
                  background: aspectRatio === 'wide' ? '#fdf2f8' : '#fff',
                  color: aspectRatio === 'wide' ? '#c2185b' : '#475569',
                  cursor: 'pointer'
                }}
              >
                Wide Navbar (3.5:1)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: aspectRatio === 'square' ? '1.5px solid #c2185b' : '1px solid #cbd5e1',
                  background: aspectRatio === 'square' ? '#fdf2f8' : '#fff',
                  color: aspectRatio === 'square' ? '#c2185b' : '#475569',
                  cursor: 'pointer'
                }}
              >
                Square Icon (1:1)
              </button>
            </div>
          </div>

          {/* Interactive Crop Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'relative',
              width: '100%',
              height: aspectRatio === 'wide' ? 160 : 260,
              borderRadius: 12,
              border: '2px dashed #cbd5e1',
              backgroundColor: '#f8fafc',
              backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              overflow: 'hidden',
              cursor: imageSrc ? (isDragging ? 'grabbing' : 'grab') : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Logo Cropping Canvas"
                draggable={false}
                style={{
                  maxHeight: '100%',
                  transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                  pointerEvents: 'none'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
                <ImageIcon size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: 12 }}>No image selected</p>
                <small style={{ fontSize: 11 }}>Choose a PNG or WebP file to begin</small>
              </div>
            )}

            {imageSrc && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  background: 'rgba(15,23,42,0.7)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Move size={10} /> Drag to reposition
              </div>
            )}
          </div>

          {/* Controls: Zoom & Sliders */}
          {imageSrc && (
            <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ZoomOut size={14} color="#64748b" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#c2185b' }}
                />
                <ZoomIn size={14} color="#64748b" />
                <span style={{ fontSize: 11, fontWeight: 700, width: 34, textAlign: 'right', color: '#334155' }}>
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <RotateCcw size={12} /> Reset Alignment
                </button>
                <small style={{ color: '#94a3b8', fontSize: 10 }}>
                  PNG transparency preserved
                </small>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: File Selection & Live Surfacing Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* File input button */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Select Logo Asset (PNG, WebP, SVG, JPG)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp,image/jpeg,image/svg+xml"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: 10,
                border: '1.5px dashed #cbd5e1',
                borderRadius: 10,
                background: '#f8fafc',
                fontSize: 12
              }}
            />
            <small style={{ color: '#64748b', fontSize: 11, display: 'block', marginTop: 4 }}>
              Transparent PNG or SVG recommended. Maximum file size: 2MB.
            </small>
          </div>

          {/* Live Preview Surfacing (Navbar mockup) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', margin: 0 }}>
                Live Header Bar Preview
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    background: previewTheme === 'light' ? '#0f172a' : '#fff',
                    color: previewTheme === 'light' ? '#fff' : '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Light Header
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    background: previewTheme === 'dark' ? '#0f172a' : '#fff',
                    color: previewTheme === 'dark' ? '#fff' : '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Dark Header
                </button>
              </div>
            </div>

            {/* Mock Header Bar */}
            <div
              style={{
                background: previewTheme === 'light' ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Logo Mock Preview"
                    style={{
                      maxHeight: 36,
                      maxWidth: 160,
                      objectFit: 'contain',
                      transform: `scale(${Math.min(1.2, zoom)})`,
                      transformOrigin: 'left center'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#c2185b', fontSize: 18 }}>♥</span>
                    <span style={{ color: previewTheme === 'light' ? '#0f172a' : '#ffffff', fontWeight: 700, fontSize: 14 }}>
                      {communityName}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: previewTheme === 'light' ? '#64748b' : '#94a3b8' }}>
                <span>Discover Matches</span>
                <span>My Biodata</span>
                <span>Plans</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-shaadi"
              onClick={handleSaveLogo}
              disabled={uploading || !imageSrc}
              style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {uploading ? (
                <>Processing &amp; Uploading...</>
              ) : (
                <>
                  <Check size={16} /> Save &amp; Publish Brand Mark
                </>
              )}
            </button>

            {currentLogoUrl && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleResetToDefault}
                disabled={uploading}
                style={{ padding: '10px 16px', fontSize: 12, color: '#ef4444', borderColor: '#fca5a5' }}
              >
                <RotateCcw size={14} style={{ marginRight: 4 }} /> Revert to Default Heart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
