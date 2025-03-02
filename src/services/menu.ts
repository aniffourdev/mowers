import { GET_MENUS } from "@/api/graphql/menu";

export type MenuItem = {
  id: string;
  label: string;
  path?: string;
  url?: string;
  uri?: string;
  parentId: string | null;
  childItems?: {
    nodes: MenuItem[];
  };
};

type Menu = {
  parentId: string | null; // Change 'any' to 'string | null' for better type safety
  id: string;
  name: string;
  menuItems: {
    nodes: MenuItem[];
  };
};

export async function getMenus(): Promise<Menu[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_MENUS,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const json = await res.json();
    return json.data.menus.nodes;
  } catch {
    return null; // Optionally, you could log the error here for debugging
  }
}

export async function getMenuByName(
  name: string
): Promise<MenuItem[] | string> {
  const menus = await getMenus();
  if (menus === null) {
    return "ADD A MENU";
  }
  const menu = menus.find(
    (m: Menu) => m.name.toLowerCase() === name.toLowerCase() // Use 'Menu' type here
  );
  return menu ? menu.menuItems.nodes : [];
}
