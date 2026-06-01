import { NextResponse } from "next/server";
import { appendFile, readFile, mkdir } from "fs/promises";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "click-log.csv");

type ClickLogBody = {
  link?: string;
};

function escapeCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function formatTimestamp(date: Date) {
  return date.toISOString();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClickLogBody;
    const link = body.link?.trim();

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Thiếu link cần ghi log." },
        { status: 400 }
      );
    }

    await mkdir(path.dirname(CSV_PATH), { recursive: true });

    let nextOrder = 1;
    try {
      const existingContent = await readFile(CSV_PATH, "utf8");
      const rowCount = existingContent
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0).length;
      nextOrder = Math.max(rowCount, 1);
      if (rowCount > 0) {
        nextOrder = rowCount;
      }
    } catch {
      await appendFile(CSV_PATH, "stt,link,thoi_gian_click\n", "utf8");
    }

    const now = new Date();
    const csvLine = [
      String(nextOrder),
      escapeCsvValue(link),
      escapeCsvValue(formatTimestamp(now)),
    ].join(",") + "\n";

    await appendFile(CSV_PATH, csvLine, "utf8");

    return NextResponse.json({
      success: true,
      order: nextOrder,
      link,
      clickTime: formatTimestamp(now),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Không thể ghi log click." },
      { status: 500 }
    );
  }
}