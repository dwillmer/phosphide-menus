/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var menusolver_1 = require('./menusolver');
var phosphide_1 = require('phosphide');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');
__export(require('./constraints'));
__export(require('./menuiteminterface'));
__export(require('./menumanagerinterface'));
__export(require('./menusolver'));
__export(require('./menusolverfunctions'));
/**
 * A simple Menu manager to generate a MenuBar when the
 * menu structure changes.
 */
var MenuManager = (function () {
    function MenuManager(input) {
        this._items = input || [];
    }
    Object.defineProperty(MenuManager.prototype, "menuUpdated", {
        /**
         * Pure delegate getter for [[menuUpdatedSignal]].
         */
        get: function () {
            return MenuManager.menuUpdatedSignal.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add items to the existing menu structure.
     *
     * This should only be called by extend() on the extension point.
     * TODO : should return IDisposable.
     */
    MenuManager.prototype.add = function (items) {
        for (var i = 0; i < items.length; ++i) {
            this._items.push(items[i]);
        }
        var menuBar = menusolver_1.MenuSolver.solve(this._items);
        this.menuUpdated.emit(menuBar);
    };
    /**
     * Return an array containing all menu items.
     */
    MenuManager.prototype.allMenuItems = function () {
        return this._items;
    };
    /**
     * Signal emitted when a menu item is added or removed.
     */
    MenuManager.menuUpdatedSignal = new phosphor_signaling_1.Signal();
    return MenuManager;
})();
exports.MenuManager = MenuManager;
/**
 * Menu Extension Point
 */
var MainMenuExtensionPoint = (function () {
    function MainMenuExtensionPoint(id) {
        this.id = id;
        this._manager = new MenuManager();
        this._manager.menuUpdated.connect(this._onMenuUpdated, this);
    }
    /**
     * Extend the existing menu functionality.
     */
    MainMenuExtensionPoint.prototype.extend = function (items) {
        console.log('Adding items to menu via extension point...');
        var stripped = items.map(function (x) { return x.item; });
        this._manager.add(stripped);
        return; // TODO - disposable.
    };
    MainMenuExtensionPoint.prototype._onMenuUpdated = function (sender, value) {
        if (this._menuBar) {
            phosphor_widget_1.detachWidget(this._menuBar);
        }
        this._menuBar = value;
        phosphor_widget_1.attachWidget(this._menuBar, document.body);
    };
    return MainMenuExtensionPoint;
})();
exports.MainMenuExtensionPoint = MainMenuExtensionPoint;
/**
 * A phosphide plugin which extends the application functionality by
 * adding a pluggable/extensible main menu.
 */
var MenuPlugin = (function (_super) {
    __extends(MenuPlugin, _super);
    function MenuPlugin(id) {
        _super.call(this, id);
        this._mainMenuExtensionPoint = new MainMenuExtensionPoint('menu.main');
    }
    /**
     * Returns the extension points for this plugin.
     */
    MenuPlugin.prototype.extensionPoints = function () {
        return [this._mainMenuExtensionPoint];
    };
    return MenuPlugin;
})(phosphide_1.PointDelegate);
exports.MenuPlugin = MenuPlugin;
//# sourceMappingURL=index.js.map