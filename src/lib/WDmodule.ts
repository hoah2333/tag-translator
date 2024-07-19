import WDmethod from "./WDmethod";

import * as cheerio from "cheerio";

import { AxiosError, type AxiosResponse } from "axios";

class WDmodule {
    public base: string;
    public wdMethod: WDmethod;
    constructor(base: string) {
        this.base = base;
        this.wdMethod = new WDmethod(base);
    }

    async login(username: string, password: string): Promise<WDmethod> {
        return await this.wdMethod.login(username, password);
    }

    async getListpages(params: any): Promise<AxiosResponse> {
        return await this.wdMethod.ajaxPost(params, "list/ListPagesModule");
    }

    async getPageSource(page: string): Promise<cheerio.CheerioAPI> {
        return await this.wdMethod.getPageSource(page, false);
    }
}

export default WDmodule;
