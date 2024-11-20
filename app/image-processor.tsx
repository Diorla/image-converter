"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";

export default function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState("webp");
  const [quality, setQuality] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file to process.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("format", outputFormat);
      formData.append("quality", quality.toString());
      formData.append("width", width.toString());
      formData.append("height", height.toString());

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image processing failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a download link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = `processed-image-${Date.now()}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Image processed successfully",
        description: "Your image has been processed and downloaded.",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error processing image",
        description:
          "An error occurred while processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Image Processor</h1>
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag and drop an image here, or click to select a file</p>
          )}
          {selectedFile && (
            <p className="mt-2">Selected file: {selectedFile.name}</p>
          )}
        </div>
        {previewUrl && (
          <div className="mt-4">
            <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
          </div>
        )}
        <div>
          <Label htmlFor="output-format">Output Format</Label>
          <Select onValueChange={(value) => setOutputFormat(value)}>
            <SelectTrigger id="output-format">
              <SelectValue placeholder="Select output format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quality">Quality ({quality}%)</Label>
          <Slider
            id="quality"
            min={1}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(value) => setQuality(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            min={0}
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            placeholder="Enter width (0 for auto)"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            min={0}
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            placeholder="Enter height (0 for auto)"
          />
        </div>
        <Button onClick={handleProcess} disabled={!selectedFile || processing}>
          {processing ? "Processing..." : "Process Image"}
        </Button>
      </div>
    </div>
  );
}
