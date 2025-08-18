export declare class IdShortener {
    static shortenId(id: string): string;
    static shortenIds<T extends {
        id: string;
    }>(items: T[]): (T & {
        shortId: string;
    })[];
    static shortenItem<T extends {
        id: string;
    }>(item: T): T & {
        shortId: string;
    };
}
//# sourceMappingURL=idShortener.d.ts.map