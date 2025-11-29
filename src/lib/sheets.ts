import Papa from "papaparse";

export interface SheetData {
    section: "Bio" | "Timeline" | "Social";
    title: string;
    description: string;
    date?: string;
    link?: string[]; // Changed to array
    type?: string; // For icon name or category
    image?: string[]; // Changed to array
}

export const cleanLink = (url: string): string => {
    if (!url) return "";
    let cleaned = url.trim();
    // Remove < and > wrapper if present
    cleaned = cleaned.replace(/^<|>$/g, '');
    // Remove %3C and %3E wrapper if present (URL encoded < >)
    cleaned = cleaned.replace(/^%3C|%3E$/g, '');

    // Fix localhost prefix issue if present (e.g. http://localhost:5173/https://...)
    if (cleaned.includes('http') && !cleaned.startsWith('http')) {
        const match = cleaned.match(/(https?:\/\/[^ ]*)/);
        if (match) return match[0];
    }

    return cleaned;
};

function cleanGoogleUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    let cleaned = url.trim();
    try {
        // Handle Google Search Redirects
        if (cleaned.includes("google.com/url")) {
            const urlObj = new URL(cleaned);
            const target = urlObj.searchParams.get("url");
            if (target) cleaned = target;
        }

        // Handle Google Drive Links
        if (cleaned.includes("drive.google.com")) {
            const fileIdMatch = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleaned.match(/id=([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w4000`;
            }
        }
    } catch (e) {
        console.warn("Failed to clean Google URL", e);
    }
    return cleaned;
}

export async function fetchSheetData(sheetUrl: string): Promise<SheetData[]> {
    try {
        const response = await fetch(sheetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Basic validation/cleaning
                    const rawData = results.data as any[];

                    const cleanData = rawData.map((row) => {
                        // Normalize keys to lowercase to handle "Section" vs "section"
                        const normalized: any = {};
                        Object.keys(row).forEach((key) => {
                            normalized[key.trim().toLowerCase()] = row[key];
                        });

                        // Parse links: split by comma, clean each, filter empty
                        const rawLinks = normalized.link ? normalized.link.split(',') : [];
                        const links = rawLinks.map((l: string) => cleanLink(l)).filter((l: string) => l);

                        // Parse images: split by comma, clean each, filter empty
                        const rawImages = normalized.image ? normalized.image.split(',') : [];
                        const images = rawImages.map((i: string) => cleanGoogleUrl(i)).filter((i: string | undefined) => i) as string[];

                        return {
                            section: normalized.section?.trim(),
                            title: normalized.title?.trim(),
                            description: normalized.description?.trim(),
                            date: normalized.date?.trim(),
                            link: links.length > 0 ? links : undefined,
                            type: normalized.type?.trim(),
                            image: images.length > 0 ? images : undefined,
                        } as SheetData;
                    }).filter((item) => item.section && item.title); // Filter out empty rows

                    resolve(cleanData);
                },
                error: (error: Error) => {
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return [];
    }
}
