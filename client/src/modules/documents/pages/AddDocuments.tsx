import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle2, CalendarIcon, Type, Hash, FileType, CalendarDays, FileDigit, Info } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { UseSaveDocument } from "@/apis/hooks/document.hooks";
import type { DocumentRequestTypes } from "@/apis/service/document.service";
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
    document: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "Document file is required")
      .refine(
        (files) => files[0]?.size <= 5_000_000,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const fileInput = watch("document");

  React.useEffect(() => {
    if (fileInput && fileInput.length > 0) {
      setSelectedFile(fileInput[0]);
    }
  }, [fileInput]);

  const { mutateAsync: saveDocument, isPending: documentSaveLoading } =
    UseSaveDocument();

  const onSubmit = async (data: FormData) => {
    const payload: DocumentRequestTypes = {
      title: data.title,
      description: data.description || "",
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentIssuedAt: data.documentIssuedAt,
      documentExpiryAt: data.documentExpiryAt,
      document: data.document[0],
      mimetype: data.document[0].type,
    };
    console.log("Payload:", payload);

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("documentType", payload.documentType);
    formData.append("document", payload.document);
    formData.append("documentNumber", payload.documentNumber);
    formData.append("mimetype", payload.mimetype);

    if (payload.documentIssuedAt) {
      // Use dayjs to format the date
      formData.append(
        "documentIssuedAt",
        dayjs(payload.documentIssuedAt).toISOString()
      );
    }
    if (payload.documentExpiryAt) {
      // Use dayjs to format the date
      formData.append(
        "documentExpiryAt",
        dayjs(payload.documentExpiryAt).toISOString()
      );
    }

    try {
      const res = await saveDocument(formData);
      console.log(res);
      setSubmitSuccess(true);
      reset();
      setSelectedFile(null);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.log(error);
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

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Document Information</h2>
              <p className="text-gray-500 mt-2">Fill in the details below to save your document</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Title & Description Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
                    <FileType className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
                    <Hash className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
                    <CalendarDays className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
                            initialFocus
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
                    <FileDigit className="h-4 w-4 text-indigo-600" />
                    <label className="text-sm font-semibold text-gray-900">
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
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <label className="text-sm font-semibold text-gray-900">
                    Document File *
                  </label>
                </div>

                <div className="relative">
                  <input
                    {...register("document")}
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  />

                  {selectedFile ? (
                    <div className="border-2 border-dashed border-green-200 rounded-xl p-6 bg-green-50">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <FileText className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{selectedFile.name}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {(selectedFile.size / 1024).toFixed(2)} KB • {
                                  selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'
                                }
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-white">
                              Selected
                            </Badge>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <label
                              htmlFor="file-upload"
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                            >
                              Change File
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('file-upload') as HTMLInputElement;
                                if (input) input.value = '';
                                setSelectedFile(null);
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
                      htmlFor="file-upload"
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

                {errors.document && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {errors.document.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm"
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
                  variant="outline"
                  onClick={() => {
                    reset();
                    setSelectedFile(null);
                    const input = document.getElementById('file-upload') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  disabled={documentSaveLoading}
                  className="flex-1 h-11"
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