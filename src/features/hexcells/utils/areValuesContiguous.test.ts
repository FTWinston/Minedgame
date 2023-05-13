import { areValuesContiguous } from './areValuesContiguous';

test('all false, not looped', () => {
    expect(areValuesContiguous([false, false, false, false, false, false], val => val, false))
        .toBe(false);
});

test('all false, looped', () => {
    expect(areValuesContiguous([false, false, false, false, false, false], val => val, true))
        .toBe(false);
});

test('all true, not looped', () => {
    expect(areValuesContiguous([true, true, true, true, true, true], val => val, false))
        .toBe(true);
});

test('all true, looped', () => {
    expect(areValuesContiguous([true, true, true, true, true, true], val => val, true))
        .toBe(true);
});

test('one false, not looped', () => {
    expect(areValuesContiguous([true, true, false, true, true, true], val => val, false))
        .toBe(false);
});

test('one false, looped', () => {
    expect(areValuesContiguous([true, true, false, true, true, true], val => val, true))
        .toBe(true);
});

test('one true, not looped', () => {
    expect(areValuesContiguous([false, false, false, true, false, false], val => val, false))
        .toBe(false);
});

test('one true, looped', () => {
    expect(areValuesContiguous([false, false, false, true, false, false], val => val, true))
        .toBe(false);
});

test('two adjacent false, not looped', () => {
    expect(areValuesContiguous([true, true, false, false, true, true], val => val, false))
        .toBe(false);
});

test('two adjacent false, looped', () => {
    expect(areValuesContiguous([true, true, false, false, true, true], val => val, true))
        .toBe(true);
});

test('two adjacent true, not looped', () => {
    expect(areValuesContiguous([false, false, true, true, false, false], val => val, false))
        .toBe(true);
});

test('two adjacent true, looped', () => {
    expect(areValuesContiguous([false, false, true, true, false, false], val => val, true))
        .toBe(true);
});

test('two apart false, not looped', () => {
    expect(areValuesContiguous([true, false, true, false, true, true], val => val, false))
        .toBe(false);
});

test('two apart false, looped', () => {
    expect(areValuesContiguous([true, false, true, false, true, true], val => val, true))
        .toBe(false);
});

test('two apart true, not looped', () => {
    expect(areValuesContiguous([false, true, false, true, false, false], val => val, false))
        .toBe(false);
});

test('two apart true, looped', () => {
    expect(areValuesContiguous([false, true, false, true, false, false], val => val, true))
        .toBe(false);
});

test('ends false, not looped', () => {
    expect(areValuesContiguous([false, true, true, true, true, false], val => val, false))
        .toBe(true);
});

test('ends false, looped', () => {
    expect(areValuesContiguous([false, true, true, true, true, false], val => val, true))
        .toBe(true);
});

test('ends true, not looped', () => {
    expect(areValuesContiguous([true, false, false, false, false, true], val => val, false))
        .toBe(false);
});

test('ends true, looped', () => {
    expect(areValuesContiguous([true, false, false, false, false, true], val => val, true))
        .toBe(true);
});