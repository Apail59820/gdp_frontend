export function getFileSize(bytes, si=false, dp=1) : string {
    const thresh : number = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes > 1 ? bytes + ' octets' : bytes + ' octet';
    }

    const units = !si ? ['ko', 'Mo', 'Go', 'To'] : ['Kio', 'Mio', 'Gio', 'Tio'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}