import { ICommandMenuItem } from './menuiteminterface';
import { IMenuManager } from './menumanagerinterface';
import { IExtensionPoint, PointDelegate } from 'phosphide';
import { IDisposable } from 'phosphor-disposable';
import { MenuBar } from 'phosphor-menus';
import { Signal, ISignal } from 'phosphor-signaling';
export * from './constraints';
export * from './menuiteminterface';
export * from './menumanagerinterface';
export * from './menusolver';
export * from './menusolverfunctions';
/**
 * A simple Menu manager to generate a MenuBar when the
 * menu structure changes.
 */
export declare class MenuManager implements IMenuManager {
    /**
     * Signal emitted when a menu item is added or removed.
     */
    static menuUpdatedSignal: Signal<MenuManager, MenuBar>;
    /**
     * Pure delegate getter for [[menuUpdatedSignal]].
     */
    menuUpdated: ISignal<MenuManager, MenuBar>;
    constructor(input?: ICommandMenuItem[]);
    /**
     * Add items to the existing menu structure.
     *
     * This should only be called by extend() on the extension point.
     * TODO : should return IDisposable.
     */
    add(items: ICommandMenuItem[]): void;
    /**
     * Return an array containing all menu items.
     */
    allMenuItems(): ICommandMenuItem[];
    private _items;
}
/**
 * The interface required for a menu item.
 */
export interface IMenuExtension {
    pointName: string;
    item: ICommandMenuItem;
}
/**
 * Menu Extension Point
 */
export declare class MainMenuExtensionPoint {
    constructor(id: string);
    /**
     * Extend the existing menu functionality.
     */
    extend(items: IMenuExtension[]): IDisposable;
    private _onMenuUpdated(sender, value);
    id: string;
    private _menuBar;
    private _manager;
}
/**
 * A phosphide plugin which extends the application functionality by
 * adding a pluggable/extensible main menu.
 */
export declare class MenuPlugin extends PointDelegate {
    constructor(id: string);
    /**
     * Returns the extension points for this plugin.
     */
    extensionPoints(): IExtensionPoint[];
    private _mainMenuExtensionPoint;
}
