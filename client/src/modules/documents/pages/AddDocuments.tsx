import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle2, CalendarIcon, Type, Hash, FileType, CalendarDays, FileDigit, Info } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { UseSaveDocument } from "@/apis/hooks/document.hooks";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export type DocumentTypes =
  | "citizenship"
  | "nid"
  | "passport"
  | "license"
  | "academic"
  | "other";

// Use dayjs for date handling
const today = dayjs().startOf("day");

const documentSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .optional(),
    documentType: z.string().min(1, "Document type is required"),
    documentNumber: z.string().min(1, "Document number is required"),
    documentIssuedAt: z
      .date()
      .optional()
      .refine((date) => {
        if (!date) return true;
        return dayjs(date).isBefore(today) || dayjs(date).isSame(today, "day");
      }, "Issued date must be today or before today"),
    documentExpiryAt: z
      .date()
      .optional()
      .refine((date) => {
        if (!date) return true;
        return dayjs(date).isAfter(today);
      }, "Expiry date must be after today"),
    front: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "Front document file is required")
      .refine(
        (files) => files[0]?.size <= 5_000_000,
        "File size must be less than 5MB"
      ),
    back: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => !files || files.length === 0 || files[0]?.size <= 5_000_000,
        "File size must be less than 5MB"
      ),
  })
  .refine(
    (data) => {
      // Cross-field validation: expiry date must be after issued date
      if (data.documentIssuedAt && data.documentExpiryAt) {
        return dayjs(data.documentExpiryAt).isAfter(
          dayjs(data.documentIssuedAt)
        );
      }
      return true;
    },
    {
      message: "Expiry date must be after issued date",
      path: ["documentExpiryAt"],
    }
  );

type FormData = z.infer<typeof documentSchema>;

const AddDocuments = () => {
  const [selectedFrontFile, setSelectedFrontFile] = useState<File | null>(null);
  const [selectedBackFile, setSelectedBackFile] = useState<File | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(documentSchema),
  });

  const frontFileInput = watch("front");
  const backFileInput = watch("back");

  React.useEffect(() => {
    if (frontFileInput && frontFileInput.length > 0) {
      setSelectedFrontFile(frontFileInput[0]);
    }
  }, [frontFileInput]);

  React.useEffect(() => {
    if (backFileInput && backFileInput.length > 0) {
      setSelectedBackFile(backFileInput[0]);
    }
  }, [backFileInput]);

  const { mutateAsync: saveDocument, isPending: documentSaveLoading } =
    UseSaveDocument();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("documentType", data.documentType);
    formData.append("documentNumber", data.documentNumber);
    
    // Append front file
    if (data.front && data.front[0]) {
      formData.append("front", data.front[0]);
      formData.append("frontMimetype", data.front[0].type);
    }
    
    // Append back file if exists
    if (data.back && data.back[0]) {
      formData.append("back", data.back[0]);
      formData.append("backMimetype", data.back[0].type);
    }

    if (data.documentIssuedAt) {
      formData.append(
        "documentIssuedAt",
        dayjs(data.documentIssuedAt).toISOString()
      );
    }
    if (data.documentExpiryAt) {
      formData.append(
        "documentExpiryAt",
        dayjs(data.documentExpiryAt).toISOString()
      );
    }

    try {
      const res = await saveDocument(formData);
      console.log(res);
      setSubmitSuccess(true);
      reset();
      setSelectedFrontFile(null);
      setSelectedBackFile(null);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      console.log(error);
      const err = error.response.data;
      if (err?.errors) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err.message);
      }
    }
  };

  const documentTypes: DocumentTypes[] = [
    "citizenship",
    "nid",
    "passport",
    "license",
    "academic",
    "other",
  ];

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      citizenship: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      nid: "bg-green-100 text-green-800 hover:bg-green-100",
      passport: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      license: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      academic: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
      other: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <PageLayout
      title="Add New Document"
      description="Securely upload and manage your important documents"
    >
      <div className="max-w-full mx-auto">
        {submitSuccess && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              Document saved successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <Card className="border shadow-sm overflow-auto max-h-[calc(90vh-12rem)]">
          <CardContent className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary">Document Information</h2>
              <p className="text-muted-foreground mt-2">Fill in the details below to save your document</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Title & Description Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Title *
                    </label>
                  </div>
                  <Input
                    {...register("title")}
                    className={cn(
                      "h-11",
                      errors.title && "border-red-300 focus-visible:ring-red-200"
                    )}
                    placeholder="e.g., Passport Renewal 2024"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Description
                    </label>
                  </div>
                  <Textarea
                    {...register("description")}
                    rows={3}
                    className={cn(
                      "resize-none",
                      errors.description && "border-red-300 focus-visible:ring-red-200"
                    )}
                    placeholder="Provide additional details about this document..."
                  />
                </div>
              </div>

              {/* Document Type & Number Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileType className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Document Type *
                    </label>
                  </div>
                  <Controller
                    name="documentType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={cn(
                          "h-11",
                          errors.documentType && "border-red-300 focus:ring-red-200"
                        )}>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center justify-between w-full">
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                <Badge
                                  variant="secondary"
                                  className={cn("text-xs", getDocumentTypeColor(type))}
                                >
                                  {type}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.documentType && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.documentType.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Document Number *
                    </label>
                  </div>
                  <Input
                    {...register("documentNumber")}
                    className={cn(
                      "h-11",
                      errors.documentNumber && "border-red-300 focus-visible:ring-red-200"
                    )}
                    placeholder="e.g., AB12345678"
                  />
                  {errors.documentNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.documentNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Issued Date
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="documentIssuedAt"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              errors.documentIssuedAt && "border-red-300 text-red-600"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => dayjs(date).isAfter(today)}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.documentIssuedAt && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.documentIssuedAt.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileDigit className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Expiry Date
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="documentExpiryAt"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              errors.documentExpiryAt && "border-red-300 text-red-600"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            disabled={(date) =>
                              dayjs(date).isBefore(today) ||
                              dayjs(date).isSame(today, "day")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.documentExpiryAt && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.documentExpiryAt.message}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Front Document */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Front Document *
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      {...register("front")}
                      type="file"
                      className="hidden"
                      id="front-file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />

                    {selectedFrontFile ? (
                      <div className="border-2 border-dashed border-green-200 rounded-xl p-6 bg-green-50">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <FileText className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{selectedFrontFile.name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {(selectedFrontFile.size / 1024).toFixed(2)} KB • {
                                    selectedFrontFile.type.split('/')[1]?.toUpperCase() || 'FILE'
                                  }
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-white">
                                Selected
                              </Badge>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <label
                                htmlFor="front-file-upload"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                              >
                                Change File
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('front-file-upload') as HTMLInputElement;
                                  if (input) input.value = '';
                                  setSelectedFrontFile(null);
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="front-file-upload"
                        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
                      >
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                          <Upload className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports: PDF, DOC, XLS, PPT, TXT, JPG, PNG
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum file size: 5MB
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {errors.front && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.front.message}
                    </p>
                  )}
                </div>

                {/* Back Document */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-4 w-4 text-primary/90" />
                    <label className="text-sm font-semibold text-muted-foreground">
                      Back Document (Optional)
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      {...register("back")}
                      type="file"
                      className="hidden"
                      id="back-file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />

                    {selectedBackFile ? (
                      <div className="border-2 border-dashed border-green-200 rounded-xl p-6 bg-green-50">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <FileText className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{selectedBackFile.name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {(selectedBackFile.size / 1024).toFixed(2)} KB • {
                                    selectedBackFile.type.split('/')[1]?.toUpperCase() || 'FILE'
                                  }
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-white">
                                Selected
                              </Badge>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <label
                                htmlFor="back-file-upload"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                              >
                                Change File
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('back-file-upload') as HTMLInputElement;
                                  if (input) input.value = '';
                                  setSelectedBackFile(null);
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="back-file-upload"
                        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
                      >
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                          <Upload className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports: PDF, DOC, XLS, PPT, TXT, JPG, PNG
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum file size: 5MB
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {errors.back && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {errors.back.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="flex-1 h-11 shadow-sm cursor-pointer"
                  disabled={documentSaveLoading}
                >
                  {documentSaveLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Saving Document...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Document
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    reset();
                    setSelectedFrontFile(null);
                    setSelectedBackFile(null);
                    const frontInput = document.getElementById('front-file-upload') as HTMLInputElement;
                    const backInput = document.getElementById('back-file-upload') as HTMLInputElement;
                    if (frontInput) frontInput.value = '';
                    if (backInput) backInput.value = '';
                  }}
                  disabled={documentSaveLoading}
                  className="flex-1 h-11 cursor-pointer"
                >
                  Clear All Fields
                </Button>
              </div>

              {/* Form Status Note */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  * Required fields. All uploaded documents are encrypted and securely stored.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AddDocuments;