export interface MenuItem {
    url?: string;
    name?: string;
    navheader?: string;
    icon?: string;
    rfcs?: string[];
    submenu?: MenuItem[];
}
export declare const MENU: MenuItem[];
