/**
 * The interface an object is required to implement for a Constraint.
 *
 * These are very simple constraint systems which are designed to
 * produce Before/After relationships in the form of graph edges
 * for input into a solver.
 */
export interface IConstraint {
    constrain(against: string): string[];
}
/**
 * The Before constraint.
 *
 * When constrained against another value (in this case a string),
 * it returns an array of 2 items with the original value last,
 * thereby declaring a directed edge from new -> original item, forcing
 * the new item to be sorted 'before' the original.
 */
export declare class Before implements IConstraint {
    private val;
    constructor(val: string);
    constrain(against: string): string[];
}
/**
 * The After constraint.
 *
 * When constrained against another value, it returns an array of 2 items
 * with the original value first, thereby declaring an directed edge from
 * original -> new.
 */
export declare class After implements IConstraint {
    private val;
    constructor(val: string);
    constrain(against: string): string[];
}
