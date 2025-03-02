export const GET_MENUS = `
  query GetMenus {
    menus(first: 100) {
      nodes {
        id
        name
        menuItems(first: 100) {
          nodes {
            id
            label
            uri
            parentId
            childItems(first: 100) {
              nodes {
                id
                label
                uri
                parentId
                childItems(first: 100) {
                  nodes {
                    id
                    label
                    uri
                    parentId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// FOOTER MENU
export const Quick_Links_menu = `
  query GetMenus {
    menus(first: 100) {
      nodes {
        id
        name
        menuItems(first: 100) {
          nodes {
            id
            label
            uri
            parentId
          }
        }
      }
    }
  }
`;
