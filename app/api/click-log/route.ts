import { NextResponse } from "next/server";
import { google } from "googleapis";

const DEFAULT_SHEET_GID = 231240412;
const GOOGLE_SHEETS_SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];

type ClickLogBody = {
  link?: string;
};

function formatTimestamp(date: Date) {
  return date.toISOString();
}

function getSpreadsheetId() {
  const spreadsheetId =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? process.env.GOOGLE_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error("Thiếu cấu hình GOOGLE_SHEETS_SPREADSHEET_ID.");
  }

  return spreadsheetId;
}

function getSheetGid() {
  const rawGid = process.env.GOOGLE_SHEETS_GID;

  if (!rawGid) {
    return DEFAULT_SHEET_GID;
  }

  const parsed = Number.parseInt(rawGid, 10);
  if (Number.isNaN(parsed)) {
    throw new Error("GOOGLE_SHEETS_GID không hợp lệ.");
  }

  return parsed;
}

async function getSheetsClient() {
  const serviceAccountEmail =
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey =
    (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? process.env.GOOGLE_PRIVATE_KEY)?.replace(
      /\\n/g,
      "\n"
    );

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      "Thiếu cấu hình GOOGLE_SHEETS_CLIENT_EMAIL hoặc GOOGLE_SHEETS_PRIVATE_KEY."
    );
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: GOOGLE_SHEETS_SCOPE,
  });

  return google.sheets({ version: "v4", auth });
}

async function getSheetTitleByGid(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetGid: number
) {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });

  const selectedSheet = metadata.data.sheets?.find(
    (sheet) => sheet.properties?.sheetId === sheetGid
  );

  if (selectedSheet?.properties?.title) {
    return selectedSheet.properties.title;
  }

  const fallbackTitle = metadata.data.sheets?.[0]?.properties?.title;
  if (!fallbackTitle) {
    throw new Error("Không tìm thấy sheet hợp lệ trong Google Spreadsheet.");
  }

  return fallbackTitle;
}

async function ensureHeader(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetTitle: string
) {
  const headerRange = `${sheetTitle}!A1:C1`;
  const header = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });

  const hasHeader = (header.data.values?.[0]?.length ?? 0) > 0;
  if (hasHeader) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: headerRange,
    valueInputOption: "RAW",
    requestBody: {
      values: [["stt", "link", "thoi_gian_click"]],
    },
  });
}

async function getNextOrder(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetTitle: string
) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A2:A`,
  });

  const existingRows = result.data.values?.filter((row) => row[0]?.trim()) ?? [];
  return existingRows.length + 1;
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

    const sheets = await getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    const sheetGid = getSheetGid();
    const sheetTitle = await getSheetTitleByGid(sheets, spreadsheetId, sheetGid);

    await ensureHeader(sheets, spreadsheetId, sheetTitle);

    const nextOrder = await getNextOrder(sheets, spreadsheetId, sheetTitle);

    const now = new Date();
    const clickTime = formatTimestamp(now);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A:C`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[String(nextOrder), link, clickTime]],
      },
    });

    return NextResponse.json({
      success: true,
      order: nextOrder,
      link,
      clickTime,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể ghi log click lên Google Sheet.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}