function decodeSecretMessage(fileContent) {
    let bits = "";

    for (const ch of fileContent) {
        if (ch === "\u200B") {
            bits += "0";
        }
        else if (ch === "\u200C") {
            bits += "1";
        }
    }

    if (bits.length === 0) return "";

    const bytes = new Uint8Array(Math.floor(bits.length / 8));

    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    }

return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
