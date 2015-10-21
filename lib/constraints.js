/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * The Before constraint.
 *
 * When constrained against another value (in this case a string),
 * it returns an array of 2 items with the original value last,
 * thereby declaring a directed edge from new -> original item, forcing
 * the new item to be sorted 'before' the original.
 */
var Before = (function () {
    function Before(val) {
        this.val = val;
    }
    Before.prototype.constrain = function (against) {
        return [against, this.val];
    };
    return Before;
})();
exports.Before = Before;
/**
 * The After constraint.
 *
 * When constrained against another value, it returns an array of 2 items
 * with the original value first, thereby declaring an directed edge from
 * original -> new.
 */
var After = (function () {
    function After(val) {
        this.val = val;
    }
    After.prototype.constrain = function (against) {
        return [this.val, against];
    };
    return After;
})();
exports.After = After;
//# sourceMappingURL=constraints.js.map