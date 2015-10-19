export function* line_iterator (data) {
    let len = data.length;
    let cur_pos = 0;
    while (len > cur_pos) {
        let chr_len = 2;
        let pos = data.indexOf("\r\n");
        if (pos === -1) {
            chr_len = 1;
            pos = data.indexOf("\n");
            if (pos === -1) {
                pos = data.indexOf("\r");
                if (pos === -1) {
                    pos = len;
                    chr_len = 0;
                    break;
                }
            }
        }
        yield data.substring(cur_pos, pos);
        cur_pos = cur_pos + pos + chr_len;
    }
}