// Types
export interface Service {
  service_id: string;
  category_name: string;
  short_description: string;
  full_description: string;
  benefits: string;
  indications: string;
  contraindications: string;
  image: string;
}

export interface Price {
  service_id: string;
  name: string;
  price_in_czk: string;
  duration_in_minutes?: string;
  session?: string;
}

// CSV Parser
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map(v => v.replace(/^"|"$/g, ''));
}

export function parseCSV(text: string): any[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map((h: string) => h.trim().replace(/\r/g, ''));
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = values[index] ? values[index].trim().replace(/\r/g, '') : '';
    });
    data.push(obj);
  }

  return data;
}

// Data storage
let servicesData: Service[] = [];
let pricesData: Price[] = [];

export async function loadData(): Promise<{ services: Service[], prices: Price[] }> {
  try {
    const [servicesResponse, pricesResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/services.csv`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/prices.csv`),
    ]);

    const servicesText = await servicesResponse.text();
    const pricesText = await pricesResponse.text();

    servicesData = parseCSV(servicesText) as Service[];
    pricesData = parseCSV(pricesText) as Price[];

    console.log('Services loaded:', servicesData.length);
    console.log('Prices loaded:', pricesData.length);

    return { services: servicesData, prices: pricesData };
  } catch (error) {
    console.error('Error loading data:', error);
    return { services: [], prices: [] };
  }
}

export function getServicesData(): Service[] {
  return servicesData;
}

export function getPricesData(): Price[] {
  return pricesData;
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return `/images/${imagePath}`;
}