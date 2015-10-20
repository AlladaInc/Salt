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
module.exports = {
    line_iterator,
};