import fs from 'fs';
import path from 'path';

export interface IndustryData {
  industry: string;
  pain_point: string;
  slug: string;
}

export function getIndustryData(): IndustryData[] {
  try {
    const csvPath = 'C:/Users/ovjup/Dropbox/Voss Neural Research LLC/VNR  Projects/the-index/data_dir/data.csv';
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    // Split by newlines and handle potential Windows \r\n
    const lines = fileContent.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const data: IndustryData[] = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        
        // Handling basic CSV format without complex quotes
        const [industry, pain_point, slug] = line.split(',');
        
        if (industry && pain_point && slug) {
            data.push({
                industry: industry.trim(),
                pain_point: pain_point.trim(),
                slug: slug.trim(),
            });
        }
    }
    
    return data;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
}
