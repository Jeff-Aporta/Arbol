function IDAleatorio() {
    return Math.random().toString().replaceAll("0.", "id-")
}

export default {
    nombrado: {
        kebab2camel: s => s.replace(/-./g, x => x[1].toUpperCase()),
        camel2kebab: str => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()),
    },
    "id-aleatorio": IDAleatorio
}