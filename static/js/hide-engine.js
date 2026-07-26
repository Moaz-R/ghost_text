function encodeSecretMessage(coverText, secretText) {
    coverText = coverText.replace(/[\u200B\u200C]/g, "");

    const bytes = new TextEncoder().encode(secretText);
    let secretBits = [];
    for (let i = 0; i < bytes.length; i++) {
        let bits = bytes[i].toString(2).padStart(8, "0");
        for (let j = 0; j < bits.length; j++) {
            if (bits[j] === "0") {
                secretBits.push("\u200B");
            } else {
                secretBits.push("\u200C");
            }
        }
    }

    if (secretBits.length === 0) return coverText;

    let spacesCount = 0;
    for (const ch of coverText) {
        if (ch === ' ' || ch === '\n') {
            spacesCount++;
        }
    }

    let result = "";
    let bitIndex = 0;

    if (spacesCount > 0) {
        const baseBits = Math.floor(secretBits.length / spacesCount);
        const extraBits = secretBits.length % spacesCount;
        let spaceIndex = 0;

        for (let i = 0; i < coverText.length; i++) {
            const ch = coverText[i];
            result += ch;

            if ((ch === ' ' || ch === '\n') && bitIndex < secretBits.length) {
                const take = baseBits + (spaceIndex < extraBits ? 1 : 0);
                const chunk = secretBits.slice(bitIndex, bitIndex + take);
                result += chunk.join("");
                bitIndex += chunk.length;
                spaceIndex++;
            }
        }
    } else {
        result = coverText;
    }

    if (bitIndex < secretBits.length) {
        if (result.length > 0) {
            result = result.slice(0, -1) + secretBits.slice(bitIndex).join("") + result.slice(-1);
        } else {
            result += secretBits.slice(bitIndex).join("");
        }
    }

    return result;
}