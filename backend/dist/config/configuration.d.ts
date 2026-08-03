export declare const SAF_CONNECTION = "saf";
declare const _default: () => {
    port: number;
    apiPrefix: string;
    corsOrigin: string[];
    storagePath: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    maxIntentosLogin: number;
    feplem: {
        baseUrl: string;
        timeoutMs: number;
    };
};
export default _default;
