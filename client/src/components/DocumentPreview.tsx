import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  File,
  Image as ImageIcon,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  mimeType: string | null;
  title: string;
}

const DocumentPreviewDialog = ({
  open,
  onOpenChange,
  previewUrl,
  mimeType,
  title,
}: Props) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && previewUrl && mimeType) {
      setZoomLevel(1);
      setRotation(0);
      setIsLoading(true);
    }
  }, [open, previewUrl, mimeType]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Only add event listener if the dialog is open and has content
    if (open && previewUrl && mimeType) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [open, previewUrl, mimeType]);

  // Early return should be AFTER all hooks
  if (!previewUrl || !mimeType) return null;

  const isImage = mimeType.startsWith("image/");
  const isPDF = mimeType === "application/pdf";
  const isDocument = mimeType.includes("document") || mimeType.includes("text");

  const formatMimeType = () => {
    if (isImage) return "Image";
    if (isPDF) return "PDF Document";
    if (isDocument) return "Text Document";
    return mimeType.split('/')[1]?.toUpperCase() || "File";
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`
        max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-0 gap-0 min-w-4xl
        ${isFullscreen ? 'max-w-full max-h-full rounded-none' : 'rounded-lg'}
      `}>
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {isImage ? (
                <ImageIcon className="h-5 w-5 text-blue-600" />
              ) : isPDF ? (
                <FileText className="h-5 w-5 text-red-600" />
              ) : (
                <File className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-medium">
                  {formatMimeType()}
                </Badge>
                <span className="text-xs text-gray-500">Preview</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Controls */}
            {isImage && (
              <div className="flex items-center gap-1 mr-2 p-1 bg-white rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="h-8 w-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2 min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {isImage && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRotate}
                    className="h-9 w-9"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-9 w-9"
                  >
                    Reset
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-9 w-9"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="mr-6"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
          {isLoading && isImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-sm text-gray-600">Loading image...</p>
              </div>
            </div>
          )}

          <div className="h-full w-full flex items-center justify-center p-4">
            {isImage && (
              <div className="relative overflow-auto h-full w-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  className="transition-transform duration-200 shadow-lg rounded-lg"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  alt={title}
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              </div>
            )}

            {isPDF && (
              <div className="h-full w-full flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>PDF Viewer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ChevronLeft className="h-3 w-3" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">Page 1 of 1</span>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      Next
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <iframe
                  src={previewUrl}
                  className="flex-1 w-full rounded-lg border shadow-sm bg-white"
                  title={title}
                  onLoad={() => setIsLoading(false)}
                />
                <div className="mt-3 text-center text-xs text-gray-500">
                  Use the PDF viewer controls for navigation
                </div>
              </div>
            )}

            {!isImage && !isPDF && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-6 bg-gray-200 rounded-full mb-6">
                  <File className="h-16 w-16 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Preview Not Available
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  This file type cannot be previewed in the browser. Please download the file to view its contents.
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {formatMimeType()}
                  </Badge>
                  <Button
                    variant="default"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Zoom Controls for Mobile */}
          {isImage && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="h-9 w-9 rounded-full"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 px-4"
              >
                {Math.round(zoomLevel * 100)}%
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="h-9 w-9 rounded-full"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-white flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isImage ? 'Use mouse wheel to zoom • Drag to pan' :
              isPDF ? 'PDF controls available in the viewer' :
                'Download to view file contents'}
          </div>
          <div className="flex items-center gap-4">
            {isImage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(1)}
                  className="h-8"
                >
                  Fit to Screen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(1.5)}
                  className="h-8"
                >
                  150%
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;