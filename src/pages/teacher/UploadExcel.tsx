
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Table as TableIcon,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '@/src/lib/utils';

interface PreviewRow {
  [key: string]: any;
}

export default function UploadExcel() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      alert('Please upload an Excel or CSV file.');
      return;
    }
    setFile(file);
    setUploadStatus('idle');
    setErrorDetails([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as PreviewRow[];
      setPreviewData(json.slice(0, 10)); // Show first 10 rows
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch('/api/teacher/upload-excel', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (result.success) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
        setErrorDetails(result.errors.map((e: any) => `Row ${e.row}: ${e.errors.join(', ')}`));
      }
    } catch (error) {
      clearInterval(interval);
      setUploadStatus('error');
      setErrorDetails(['Failed to connect to the server. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-heading font-bold text-primary">Upload Student Data</h1>
        <p className="text-muted">Import marks and extracurricular scores via Excel or CSV.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-8">
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative border-4 border-dashed rounded-3xl p-12 text-center transition-all group",
              isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted/20 bg-white hover:border-primary/50 hover:bg-muted/5",
              file ? "border-success/50 bg-success/5" : ""
            )}
          >
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              accept=".xlsx,.xls,.csv"
            />
            
            <div className="space-y-4">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110",
                file ? "bg-success text-white" : "bg-primary/10 text-primary"
              )}>
                {file ? <CheckCircle2 size={40} /> : <Upload size={40} />}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-primary">
                  {file ? file.name : "Drag & Drop Excel File"}
                </h3>
                <p className="text-muted font-medium">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "or click to browse your computer"}
                </p>
              </div>
              {!file && (
                <div className="flex justify-center gap-4 pt-4">
                  <span className="text-[10px] font-bold px-3 py-1 bg-muted/10 text-muted rounded-full">.XLSX</span>
                  <span className="text-[10px] font-bold px-3 py-1 bg-muted/10 text-muted rounded-full">.XLS</span>
                  <span className="text-[10px] font-bold px-3 py-1 bg-muted/10 text-muted rounded-full">.CSV</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview Table */}
          <AnimatePresence>
            {previewData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card overflow-hidden"
              >
                <div className="p-4 bg-muted/5 border-b border-muted/10 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <TableIcon size={16} />
                    Data Preview (First 10 Rows)
                  </h4>
                  <button onClick={() => {setFile(null); setPreviewData([]);}} className="text-muted hover:text-danger">
                    <X size={18} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/5">
                        {Object.keys(previewData[0]).map(key => (
                          <th key={key} className="p-3 font-bold text-muted border-b border-muted/10">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/10">
                      {previewData.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/5">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-3 text-primary font-medium">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-muted/5 border-t border-muted/10 flex justify-end">
                  <button 
                    onClick={processFile}
                    disabled={isProcessing}
                    className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Process & Analyse
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Messages */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>Analysing Data...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-muted/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-success/10 border border-success/20 rounded-3xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-success">Upload Successful!</h4>
                <p className="text-sm text-success/80">All records have been processed and AI reports are being generated.</p>
              </div>
            </motion.div>
          )}

          {uploadStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-danger/10 border border-danger/20 rounded-3xl space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-danger rounded-full flex items-center justify-center text-white">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-danger">Upload Failed</h4>
                  <p className="text-sm text-danger/80">We found some errors in your file. Please fix them and try again.</p>
                </div>
              </div>
              <div className="bg-white/50 rounded-2xl p-4 space-y-2">
                {errorDetails.map((err, i) => (
                  <p key={i} className="text-xs text-danger font-medium flex items-center gap-2">
                    <X size={12} />
                    {err}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Format Guide */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
              <Info className="text-accent" size={20} />
              Format Guide
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-muted uppercase tracking-widest">Marks Sheet</h5>
                <div className="bg-muted/5 rounded-xl p-3 text-[10px] font-mono text-primary leading-relaxed">
                  Name | Roll No | Subject | Test Name | Marks | Total | Date
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-muted uppercase tracking-widest">Extracurricular</h5>
                <div className="bg-muted/5 rounded-xl p-3 text-[10px] font-mono text-primary leading-relaxed">
                  Name | Roll No | Activity | Score (0-10) | Consistency (0-10) | Month
                </div>
              </div>

              <div className="p-4 bg-secondary/10 rounded-2xl space-y-2">
                <h6 className="text-xs font-bold text-secondary flex items-center gap-2">
                  <AlertCircle size={14} />
                  Pro Tip
                </h6>
                <p className="text-[10px] text-secondary/80 leading-relaxed">
                  Ensure student names match exactly as registered in the system. Use "Roll No" for 100% matching accuracy.
                </p>
              </div>

              <button className="w-full py-3 bg-white border border-muted/20 rounded-xl text-xs font-bold text-primary hover:bg-muted/5 transition-colors flex items-center justify-center gap-2">
                <FileText size={14} />
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
