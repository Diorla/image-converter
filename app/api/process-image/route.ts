import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const format = formData.get("format") as string;
    const quality = parseInt(formData.get("quality") as string);
    const width = parseInt(formData.get("width") as string);
    const height = parseInt(formData.get("height") as string);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let sharpInstance = sharp(buffer);

    // Resize if width or height is specified
    if (width > 0 || height > 0) {
      sharpInstance = sharpInstance.resize(width || null, height || null, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert and compress
    let outputBuffer: Buffer;
    if (format === "webp") {
      outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
    } else if (format === "jpeg") {
      outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
    } else if (format === "png") {
      outputBuffer = await sharpInstance.png({ quality }).toBuffer();
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="processed-image-${Date.now()}.${format}"`,
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 }
    );
  }
}
