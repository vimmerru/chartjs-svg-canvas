// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { Logger }                    from "./Logger";
import { default as isNode }         from '../runtime/is-node';
import { default as requireDynamic } from '../runtime/require-dynamic';



export type BinaryType = Buffer | Uint8Array;


export class FileSaver {
    private static saveTextAs_node(pathOrFileName: string, text: string, encoding: string): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            try {
                const fs = requireDynamic("fs");
                fs.writeFile(
                    pathOrFileName, text,
                    encoding === "utf-8" || encoding === "UTF-8" ? "utf8" : encoding, (err: any) => {
                    if (err) {
                        Logger.log("FileSaver#saveTextAs_node:writeFile:" + err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } catch (e) {
                Logger.log("FileSaver#saveTextAs_node:" + e);
                reject(e);
            }
        });
        return promise;
    }

    private static saveTextAs_html5(pathOrFileName: string, text: string, encoding: string): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            try {
                if (encoding === "utf-8" || encoding === "UTF-8") {
                    const blob = new Blob([text], {type: "text/plain"});

                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, pathOrFileName);
                        resolve(true);
                    } else {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        (a as any).download = pathOrFileName;

                        const ua = window.navigator.userAgent.toLowerCase();
                        // const isMSIE    = ua.indexOf('trident/') !== -1;
                        // const isMSEdge  = ua.indexOf('edge/')    !== -1;
                        // const isFirefox = ua.indexOf('firefox/') !== -1 && ua.indexOf('edge/') === -1;
                        const isChrome  = ua.indexOf("chrome/")  !== -1 && ua.indexOf("edge/") === -1;

                        if (! isChrome) document.body.appendChild(a);

                        a.click();
                        window.setTimeout(() => {
                            window.URL.revokeObjectURL(url);

                            if (! isChrome) document.body.removeChild(a);

                            resolve(true);
                        }, 10);
                    }
                } else {
                    Logger.log("FileSaver#saveTextAs_html5:unsupported text encoding:" + encoding);
                    reject("unsupported text encoding");
                }
            } catch (e) {
                Logger.log("FileSaver#saveTextAs_html5:" + e);
                reject(e);
            }
        });
        return promise;
    }

    private static saveBinaryAs_node(pathOrFileName: string, data: ArrayLike<number>): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            try {
                const fs = requireDynamic("fs");
                fs.writeFile(
                    pathOrFileName, data, (err: any) => {
                    if (err) {
                        Logger.log("FileSaver#saveBinaryAs_node:writeFile:" + err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } catch (e) {
                Logger.log("FileSaver#saveBinaryAs_node:" + e);
                reject(e);
            }
        });
        return promise;
    }

    private static saveBinaryAs_html5(pathOrFileName: string, data: BinaryType): Promise<boolean> {
        const promise = new Promise<boolean>((resolve, reject) => {
            try {
                const blob = new Blob([data], {type: "application/octet-binary"});

                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob, pathOrFileName);
                    resolve(true);
                } else {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    (a as any).download = pathOrFileName;

                    const ua = window.navigator.userAgent.toLowerCase();
                    // const isMSIE    = ua.indexOf('trident/') !== -1;
                    // const isMSEdge  = ua.indexOf('edge/')    !== -1;
                    // const isFirefox = ua.indexOf('firefox/') !== -1 && ua.indexOf('edge/') === -1;
                    const isChrome  = ua.indexOf("chrome/")  !== -1 && ua.indexOf("edge/") === -1;

                    if (! isChrome) document.body.appendChild(a);

                    a.click();
                    window.setTimeout(() => {
                        window.URL.revokeObjectURL(url);

                        if (! isChrome) document.body.removeChild(a);

                        resolve(true);
                    }, 10);
                }
            } catch (e) {
                Logger.log("FileSaver#saveBinaryAs_html5:" + e);
                reject(e);
            }
        });
        return promise;
    }

    public static saveTextAs(pathOrFileName: string, text: string, encoding: string = "utf-8"): Promise<boolean> {
        if (isNode) {
            return this.saveTextAs_node(pathOrFileName, text, encoding);
        } else {
            return this.saveTextAs_html5(pathOrFileName, text, encoding);
        }
    }

    public static saveBinaryAs(pathOrFileName: string, data: BinaryType): Promise<boolean> {
        if (isNode) {
            return this.saveBinaryAs_node(pathOrFileName, data);
        } else {
            return this.saveBinaryAs_html5(pathOrFileName, data);
        }
    }
}
