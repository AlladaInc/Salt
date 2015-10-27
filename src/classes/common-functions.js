var FILESYSTEM = require( 'fs');

function* line_iterator (data) {
    let len = data.length;
    let cur_pos = 0;
    while (len > cur_pos) {
        let chr_len = 2;
        let pos = data.indexOf("\r\n", cur_pos);
        if (pos === -1) {
            chr_len = 1;
            pos = data.indexOf("\n", cur_pos);
            if (pos === -1) {
                pos = data.indexOf("\r", cur_pos);
                if (pos === -1) {
                    pos = len;
                    chr_len = 0;
                    if (cur_pos === pos) {
                        break;
                    }
                }
            }
        }
        yield data.substring(cur_pos, pos);
        cur_pos = pos + chr_len;
    }
}
var walk_dir_events = new Map();
function walk_dir (path, each_fn, done_fn, origin) {
    origin = origin || {};
    if (!walk_dir_events.has(origin)) {
        walk_dir_events.set(origin, new Set());
    }
    var event = walk_dir_events.get(origin);

    event.add(path);
    FILESYSTEM.readdir(path, (error, files) => {
        if (error) {
            throw error;
        }
        files.forEach((v) => {
            let file = `${ path }/${ v }`;
            event.add(file);
            FILESYSTEM.stat(file, (error, stats) => {
                event.delete(file);
                if (error) {
                    throw error;
                }
                if (stats.isDirectory()) {
                    walk_dir(file, each_fn, done_fn, origin);
                } else if (stats.isFile()){
                    each_fn(file);
                }
                if (event.size === 0) {
                    done_fn();
                    walk_dir_events.delete(origin);
                }
            });
        });
        event.delete(path);
    });
}
module.exports = {
    line_iterator,
    walk_dir,
};