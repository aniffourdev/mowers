import { client } from "@/api/graphql/client";

export interface Setting {
  dateFormat: string;
  description: string;
  language: string;
  startOfWeek: number;
  timeFormat: string;
  timezone: string;
  title: string;
  url: string;
}

export const GET_SETTINGS = `
query getSettings {
  generalSettings {
    dateFormat
    description
    language
    startOfWeek
    timeFormat
    timezone
    title
    url
  }
}
`;

export async function settings_infos(): Promise<Setting | null> {
  try {
    const data = await client.request<{ generalSettings: Setting }>(GET_SETTINGS);
    console.log("Fetched settings:", data.generalSettings); // Log the fetched settings
    return data.generalSettings;
  } catch (error) {
    console.error("Error fetching Setting details:", error);
    return null;
  }
}
