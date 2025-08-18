"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdShortener = void 0;
class IdShortener {
    // Shorten CUID to first 8 characters for display
    static shortenId(id) {
        if (!id)
            return '';
        return id.substring(0, 8);
    }
    // Shorten multiple IDs in an array
    static shortenIds(items) {
        return items.map(item => ({
            ...item,
            shortId: this.shortenId(item.id)
        }));
    }
    // Shorten a single item
    static shortenItem(item) {
        return {
            ...item,
            shortId: this.shortenId(item.id)
        };
    }
}
exports.IdShortener = IdShortener;
//# sourceMappingURL=idShortener.js.map