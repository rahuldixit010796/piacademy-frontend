declare module "react-pro-sidebar" {
  import * as React from "react";

  // Props for the main sidebar wrapper
  export interface ProSidebarProps {
    collapsed?: boolean;
    toggled?: boolean;
    breakPoint?: string;
    onToggle?: () => void;
    image?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode; // ✅ add children here

  }

   const ProSidebar: React.FC<ProSidebarProps>;
  export default ProSidebar; // ✅ default export
  
  export const ProSidebar: React.FC<ProSidebarProps>;

  // Props for the Menu inside the sidebar
  export interface MenuProps {
    iconShape?: string; // ✅ allow "square", "circle", etc.
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode; // ✅ add children here
  }

  export const Menu: React.FC<MenuProps>;

  // Props for MenuItem (individual links)
export interface MenuItemProps {
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode; // ✅ allow children
}


  export const MenuItem: React.FC<MenuItemProps>;

  // (Optional) If you ever use SubMenu
  export interface SubMenuProps {
    title: React.ReactNode;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }

  export const SubMenu: React.FC<SubMenuProps>;
}
