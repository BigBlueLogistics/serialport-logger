import { Menu, MenuItem, MenuItemConstructorOptions } from "electron";

function MainWindowMenu(menus: MenuItemConstructorOptions[] | MenuItem[]) {
  let currentMenu;
  if (process.env.VITE_DEV_SERVER_URL) {
    currentMenu = Menu.getApplicationMenu();
  } else {
    currentMenu = new Menu();
  }

  menus.forEach((element) => {
    currentMenu.append(element);
  });

  return currentMenu;
}

export default MainWindowMenu;
