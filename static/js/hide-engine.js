function encodeSecretMessage(coverText, secretText) {
    const bytes = new TextEncoder().encode(secretText);
    let out = [];

    for (let i = 0; i < bytes.length; i++) {
        let bits = bytes[i].toString(2).padStart(8, "0");

        for (let j = 0; j < bits.length; j++) {
            if (bits[j] === "0") {
                out.push("\u200B");
            } else {
                out.push("\u200C");
            }
        }
    }

    return coverText + out.join("");
}

function downloadOutputTxt(content) {
    const blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}