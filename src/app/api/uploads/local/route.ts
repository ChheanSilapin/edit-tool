import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Determine file type category
    const contentType = file.type || "application/octet-stream";
    const typeCategory = contentType.split("/")[0]; // "video", "image", "audio"

    // Return the public URL (served by Next.js from /public)
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      upload: {
        fileName: safeName,
        filePath: publicUrl,
        fileSize: file.size,
        contentType,
        url: publicUrl,
        type: typeCategory,
        status: "uploaded",
      },
    });
  } catch (error) {
    console.error("Error in local upload:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
