
import * as XLSX from 'xlsx';

export interface MarksRow {
  Name: string;
  'Roll No': string | number;
  Subject: string;
  'Test Name': string;
  Marks: number;
  Total: number;
  Date: string;
}

export interface ExtracurricularRow {
  Name: string;
  'Roll No': string | number;
  Activity: string;
  Score: number;
  Consistency: number;
  Month: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function parseMarksSheet(buffer: Buffer): MarksRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet) as MarksRow[];
}

export function parseExtracurricularSheet(buffer: Buffer): ExtracurricularRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet) as ExtracurricularRow[];
}

export function validateMarksRow(row: any): ValidationResult {
  const errors: string[] = [];
  const requiredFields = ['Name', 'Roll No', 'Subject', 'Test Name', 'Marks', 'Total', 'Date'];
  
  requiredFields.forEach(field => {
    if (row[field] === undefined || row[field] === null || row[field] === '') {
      errors.push(`Missing field: ${field}`);
    }
  });

  if (typeof row.Marks !== 'number' || isNaN(row.Marks)) {
    errors.push('Marks must be a number');
  }

  if (typeof row.Total !== 'number' || isNaN(row.Total)) {
    errors.push('Total must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function normaliseStudentName(name: string): string {
  if (!name) return '';
  // Handles "SHARMA PRIYA" vs "Priya Sharma"
  const parts = name.trim().toLowerCase().split(/\s+/);
  return parts.sort().join(' ');
}

export function matchStudentByName(name: string, students: { id: string; name: string }[]): { id: string; name: string } | null {
  const normalisedInput = normaliseStudentName(name);
  return students.find(s => normaliseStudentName(s.name) === normalisedInput) || null;
}
