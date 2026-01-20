import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute } from 'wouter';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, FileText } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ViewMode = 'single' | 'spread';

interface MoodboardData {
  id: string;
  flipbookUrl?: string | null;
  projectName?: string | null;
}

export default function MoodboardViewer() {
  const [, params] = useRoute('/view/:token');
  const token = params?.token;
  
  const [moodboardData, setMoodboardData] = useState<MoodboardData | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('spread');
  const [useHeyzine, setUseHeyzine] = useState(false);

  const pdfUrl = token ? `/api/pdf/${token}` : '';

  useEffect(() => {
    if (!token) {
      setError('Invalid share link');
      setIsLoading(false);
      return;
    }

    fetch(`/api/moodboards/share/${token}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Moodboard not found');
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }
        setMoodboardData(data);
        if (data.flipbookUrl && data.flipbookUrl.includes('heyzine.com')) {
          setUseHeyzine(true);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch moodboard data:', err);
        setError('Unable to load moodboard. Please try again.');
        setIsLoading(false);
      });
  }, [token]);

  const getSpreadPages = useCallback((spreadIndex: number): number[] => {
    if (numPages === 0) return [];
    
    if (viewMode === 'single') {
      const pageNum = spreadIndex + 1;
      return pageNum <= numPages ? [pageNum] : [];
    }
    
    if (spreadIndex === 0) {
      return [1];
    }
    
    const leftPage = spreadIndex * 2;
    const rightPage = leftPage + 1;
    
    const pages: number[] = [];
    if (leftPage <= numPages) pages.push(leftPage);
    if (rightPage <= numPages) pages.push(rightPage);
    
    return pages;
  }, [viewMode, numPages]);

  const totalSpreads = useMemo(() => {
    if (numPages === 0) return 0;
    return viewMode === 'single' 
      ? numPages 
      : Math.ceil((numPages + 1) / 2);
  }, [viewMode, numPages]);

  const currentPages = useMemo(() => getSpreadPages(currentSpread), [currentSpread, getSpreadPages]);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 768) {
        setViewMode('single');
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setCurrentSpread(0);
  };

  const onDocumentLoadError = () => {
    setError('Failed to load PDF. The moodboard may not have been generated yet.');
    setIsLoading(false);
  };

  const goToPrevSpread = () => {
    if (currentSpread <= 0) return;
    setCurrentSpread(prev => prev - 1);
  };

  const goToNextSpread = () => {
    if (currentSpread >= totalSpreads - 1) return;
    setCurrentSpread(prev => prev + 1);
  };

  const zoomIn = () => setScale(prev => Math.min(1.5, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.3, prev - 0.1));

  const handleDownload = () => {
    window.open(`/api/pdf/${token}/download`, '_blank');
  };

  const getPageDisplay = () => {
    if (currentPages.length === 0) return '...';
    if (currentPages.length === 1) return `${currentPages[0]}`;
    return `${currentPages[0]}-${currentPages[1]}`;
  };

  useEffect(() => {
    if (useHeyzine) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSpread();
      } else if (e.key === 'ArrowRight') {
        goToNextSpread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, totalSpreads, useHeyzine]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-slate-800/50 border-red-500/30 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Invalid Link</h2>
          <p className="text-slate-400">This share link is not valid.</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-slate-800/50 border-orange-500/30 text-center">
          <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Load</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-cyan-500/30 text-cyan-400"
            data-testid="button-try-again"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (useHeyzine && moodboardData?.flipbookUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">
              <span className="text-cyan-400">Architectural Intelligence</span>
            </h1>
            <span className="text-xs text-white/50 hidden sm:inline">Powered by AURA</span>
          </div>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          <iframe
            src={moodboardData.flipbookUrl}
            className="w-full h-full border-0"
            allowFullScreen
            title={moodboardData.projectName || 'Moodboard Flipbook'}
            data-testid="heyzine-flipbook-iframe"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-white">
            <span className="text-cyan-400">Architectural Intelligence</span>
          </h1>
          <span className="text-xs text-white/50 hidden sm:inline">Powered by AURA</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Button 
              size="icon" 
              variant={viewMode === 'single' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('single')}
              className="h-8 w-8 text-white/70 hover:text-white"
              title="Single page view"
              data-testid="button-single-view"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={viewMode === 'spread' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('spread')}
              className="h-8 w-8 text-white/70 hover:text-white"
              title="Spread view (magazine)"
              data-testid="button-spread-view"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={zoomOut}
              disabled={scale <= 0.3}
              className="h-8 w-8 text-white/70 hover:text-white"
              data-testid="button-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-white/50 w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={zoomIn}
              disabled={scale >= 1.5}
              className="h-8 w-8 text-white/70 hover:text-white"
              data-testid="button-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex items-center justify-center p-4 relative">
        {isLoading && (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-white/70">Loading your moodboard...</p>
          </div>
        )}
        
        {numPages > 0 && (
          <button
            onClick={goToPrevSpread}
            disabled={currentSpread <= 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed z-50 rounded-full transition-colors"
            data-testid="button-prev-page"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
        )}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center items-center"
        >
          {numPages > 0 && Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
            const isVisible = currentPages.includes(pageNum);
            return (
              <div 
                key={`page-container-${pageNum}`}
                style={{ 
                  display: isVisible ? 'block' : 'none',
                }}
              >
                <Page 
                  pageNumber={pageNum} 
                  scale={scale}
                  className="shadow-2xl"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
        </Document>
        
        {numPages > 0 && (
          <button
            onClick={goToNextSpread}
            disabled={currentSpread >= totalSpreads - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed z-50 rounded-full transition-colors"
            data-testid="button-next-page"
            aria-label="Next page"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        )}
      </main>
      
      {numPages > 0 && (
        <footer className="flex items-center justify-center p-3 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <span className="text-white/70 text-sm" data-testid="text-page-info">
            {viewMode === 'spread' ? (
              <>Page {getPageDisplay()} of {numPages}</>
            ) : (
              <>{currentPages[0] || 1} / {numPages}</>
            )}
          </span>
        </footer>
      )}
    </div>
  );
}
