import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface KeyVerificationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onKeySubmit: (key: string) => void;
    isLoading?: boolean;
    showKeyDisplay?: string; // For registration - show the key
}

export const KeyVerificationDialog = ({
    open,
    onOpenChange,
    onKeySubmit,
    isLoading = false,
    showKeyDisplay,
}: KeyVerificationDialogProps) => {
    const [key, setKey] = useState("");
    const [copied, setCopied] = useState(false);

    const handleSubmit = () => {
        if (!key.trim()) {
            toast.error("Please enter your access key");
            return;
        }
        onKeySubmit(key);
        setKey("");
    };

    const handleCopyKey = () => {
        if (showKeyDisplay) {
            navigator.clipboard.writeText(showKeyDisplay);
            setCopied(true);
            toast.success("Key copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !showKeyDisplay) {
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="sm:max-w-md">
                {showKeyDisplay ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Save Your Access Key</DialogTitle>
                            <DialogDescription>
                                This key is required to access your documents. Save it in a safe
                                place.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <Label className="text-sm font-medium text-amber-900">
                                    Your Access Key
                                </Label>
                                <div className="mt-2 flex items-center gap-2">
                                    <code className="flex-1 bg-white p-3 rounded border border-amber-300 font-mono text-sm break-all">
                                        {showKeyDisplay}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCopyKey}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                                ⚠️ You will need to enter this key every time you want to view
                                your documents. Keep it safe and do not share it.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Enter Access Key</DialogTitle>
                            <DialogDescription>
                                Please enter your document access key to continue.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="key">Access Key</Label>
                                <Input
                                    id="key"
                                    type="password"
                                    placeholder="Enter your access key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    className="mt-2"
                                />
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !key.trim()}
                                className="w-full"
                            >
                                {isLoading ? "Verifying..." : "Verify Key"}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>


        </Dialog>
    );
};
