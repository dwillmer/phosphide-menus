/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  ICommandMenuItem
} from './menuiteminterface';

import {
  IMenuManager
} from './menumanagerinterface'

import {
  MenuSolver
} from './menusolver';

import {
  IExtension, IExtensionPoint, PointDelegate
} from 'phosphide';

import {
  IDisposable, DisposableDelegate
} from 'phosphor-disposable';

import {
  Menu, MenuBar, MenuItem
} from 'phosphor-menus';

import {
  Signal, ISignal
} from 'phosphor-signaling';

import {
  attachWidget, detachWidget
} from 'phosphor-widget';


import './index.css';

export * from './constraints';
export * from './menuiteminterface';
export * from './menumanagerinterface';
export * from './menusolver';
export * from './menusolverfunctions';


/**
 * A simple Menu manager to generate a MenuBar when the 
 * menu structure changes.
 */
export
class MenuManager implements IMenuManager {

  /**
   * Signal emitted when a menu item is added or removed.
   */
  static menuUpdatedSignal = new Signal<MenuManager, MenuBar>();

  /**
   * Pure delegate getter for [[menuUpdatedSignal]].
   */
  get menuUpdated(): ISignal<MenuManager, MenuBar> {
    return MenuManager.menuUpdatedSignal.bind(this);
  }

  constructor(input?: ICommandMenuItem[]) {
    this._items = input || [];
  }

  /**
   * Add items to the existing menu structure. 
   *
   * This should only be called by extend() on the extension point.
   * TODO : should return IDisposable.
   */
  add(items: ICommandMenuItem[]): void {
    for (var i = 0; i<items.length; ++i) {
      this._items.push(items[i]);
    }
    var menuBar = MenuSolver.solve(this._items);
    this.menuUpdated.emit(menuBar);
  }

  /**
   * Return an array containing all menu items.
   */
  allMenuItems(): ICommandMenuItem[] {
    return this._items;
  }

  private _items: ICommandMenuItem[];
}


/**
 * The interface required for a menu item.
 */
export
interface IMenuExtension {
  pointName: string;
  item: ICommandMenuItem;
}


/**
 * Menu Extension Point
 */
export
class MainMenuExtensionPoint { // Structurally implements IExtensionPoint
  constructor(id: string) {
    this.id = id;
    this._manager = new MenuManager();
    this._manager.menuUpdated.connect(this._onMenuUpdated, this);
  }

  /**
   * Extend the existing menu functionality.
   */
  extend(items: IMenuExtension[]): IDisposable {
    console.log('Adding items to menu via extension point...');
    var stripped = items.map(function(x) { return x.item; });
    this._manager.add(stripped);
    return; // TODO - disposable.
  }

  private _onMenuUpdated(sender: IMenuManager, value: MenuBar) {
    if (this._menuBar) {
      detachWidget(this._menuBar);
    }
    this._menuBar = value;
    attachWidget(this._menuBar, document.body);
  }

  id: string;
  private _menuBar: MenuBar;
  private _manager: IMenuManager;
}


/**
 * A phosphide plugin which extends the application functionality by 
 * adding a pluggable/extensible main menu.
 */
export
class MenuPlugin extends PointDelegate {
  constructor(id: string) {
    super(id);
    this._mainMenuExtensionPoint = new MainMenuExtensionPoint('menu.main');
  }

  /**
   * Returns the extension points for this plugin.
   */
  extensionPoints(): IExtensionPoint[] {
    return [this._mainMenuExtensionPoint];
  }

  private _mainMenuExtensionPoint: IExtensionPoint;
}

