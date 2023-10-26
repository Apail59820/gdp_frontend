const { Readable } = require('stream');
const fs = require('fs');

export function fileToReadableStream(file) {
    return new Readable({
        read() {
            const reader = new FileReader();

            reader.onload = (event) => {
                const buffer = Buffer.from(event.target.result as any);
                this.push(buffer);
                this.push(null);
            };

            reader.readAsArrayBuffer(file);
        },
    });
}
