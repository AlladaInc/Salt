export function COMMON_FUNCTIONS_LINE_ITERATOR (test){
    import { line_iterator } from 'common-functions';
    
    var it = line_iterator("Test");
    test.strictEqual(it.next(), 'Test', 'line_iterator failed 1');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 2');

    it = line_iterator("Test\n");
    test.strictEqual(it.next(), 'Test', 'line_iterator failed 3');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 4');

    it = line_iterator("Test\r");
    test.strictEqual(it.next(), 'Test', 'line_iterator failed 5');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 6');

    it = line_iterator("Test\r\n");
    test.strictEqual(it.next(), 'Test', 'line_iterator failed 7');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 8');

    it = line_iterator("Test\r\nT");
    test.strictEqual(it.next(), 'Test', 'line_iterator failed 9');
    test.strictEqual(it.next(), 'T', 'line_iterator failed 10');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 11');

    it = line_iterator("\nT");
    test.strictEqual(it.next(), '', 'line_iterator failed 12');
    test.strictEqual(it.next(), 'T', 'line_iterator failed 13');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 14');

    it = line_iterator("\r\nT");
    test.strictEqual(it.next(), '', 'line_iterator failed 15');
    test.strictEqual(it.next(), 'T', 'line_iterator failed 16');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 17');

    it = line_iterator("\r\nT\n");
    test.strictEqual(it.next(), '', 'line_iterator failed 18');
    test.strictEqual(it.next(), 'T', 'line_iterator failed 19');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 20');

    it = line_iterator("\r\nT\nT");
    let count = 0;
    for (let line of line_iterator) {
        count++;
    }
    test.strictEqual(count, 3, 'line_iterator failed 21');

    it = line_iterator("\uBC00\uBC35a\r\n\uBC35\nT");
    let last;
    test.strictEqual(last = it.next(), "\uBC00\uBC35a", 'line_iterator failed 21');
    test.strictEqual(last.length, 3, 'line_iterator failed 22');
    test.strictEqual(last = it.next(), "\uBC35", 'line_iterator failed 23');
    test.strictEqual(last.length, 1, 'line_iterator failed 24');
    test.strictEqual(last = it.next(), 'T', 'line_iterator failed 25');
    test.strictEqual(last.length, 1, 'line_iterator failed 26');
    test.strictEqual(it.next(), undefined, 'line_iterator failed 27');

    test.done();
}