import WDmodule from "$lib/WDmodule";
import * as cheerio from "cheerio";
import type { PageServerLoad } from "./$types";

const BRENModule = new WDmodule("http://backrooms-wiki.wikidot.com");
const BRCNModule = new WDmodule("https://backrooms-wiki-cn.wikidot.com");
const BRJPModule = new WDmodule("http://japan-backrooms-wiki.wikidot.com");

const $BREN: cheerio.CheerioAPI = await BRENModule.getPageSource("tag-guide");
const $BRCN: cheerio.CheerioAPI = await BRCNModule.getPageSource("tag-guide");
const $BRJP: cheerio.CheerioAPI = await BRJPModule.getPageSource("tag-guide");

let tagLists: Record<string, Record<string, string>>[] = [];

function extraTagsPush(
    tagList: Record<string, string[][]>,
    pushTarget: Record<string, string>[]
): void {
    for (let type in tagList) {
        if (tagList.hasOwnProperty(type)) {
            for (let [tag, origin] of tagList[type]) {
                pushTarget.push({
                    tag: tag,
                    origin: origin,
                    type: type
                });
            }
        }
    }
}

let ENOriTags: Record<string, string>[] = [];
$BREN(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BREN(element).text();

        let tags: string = $BREN(
            `.yui-navset .yui-content > div:nth-of-type(${index + 1}) td:nth-of-type(1) a`
        )
            .map((_: number, element: cheerio.Element): string => $BREN(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .forEach((tag: string): void => {
                ENOriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });

let CNOriTags: Record<string, string>[] = [];
$BRCN(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRCN(element).text();

        let tags: string = $BRCN(".yui-navset .yui-content > div")
            .filter((divIndex: number): boolean => index === divIndex)
            .find("li")
            .filter(
                (_, element): boolean =>
                    !($BRCN(element).html()?.includes("<strong><em><a") ?? true)
            )
            .find("a:nth-of-type(1):not(strong em a):not(.footnoteref)")
            .map((_: number, element: cheerio.Element): string => $BRCN(element).text())
            .toArray()
            .join("|");
        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .forEach((tag: string): void => {
                CNOriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });
let CNTransTags: Record<string, string>[] = [];
$BRCN(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRCN(element).text();

        let tags: string = $BRCN(".yui-navset .yui-content > div")
            .filter((divIndex: number): boolean => index === divIndex)
            .find("li")
            .filter(
                (_, element): boolean => $BRCN(element).html()?.includes("<strong><em><a") ?? false
            )
            .find("a:nth-of-type(1):not(.footnoteref)")
            .map((_: number, element: cheerio.Element): string => $BRCN(element).text())
            .toArray()
            .join("|");
        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .forEach((tag: string, index: number, array: string[]): void => {
                if (index % 2 === 0) {
                    CNTransTags.push({
                        tag: tag,
                        origin: array[index + 1] ?? "",
                        type: tagtype
                    });
                }
            });
    });
let CNExtraTransTagList: Record<string, string[][]> = {
    "层级/房间特性标签": [
        ["宇宙", "太空"],
        ["降水", "降雨"],
        ["补给可能", "補給可能"]
    ],
    通用特性标签: [
        ["返乡可能", "帰還可能"],
        ["艺术性", "芸術"],
        ["述记影响", "情報影響"],
        ["精神影响", "精神影響"]
    ]
};
extraTagsPush(CNExtraTransTagList, CNTransTags);

let JPOriTags: Record<string, string>[] = [];
$BRJP(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRJP(element).text();

        let tags: string = $BRJP(
            `.yui-navset .yui-content > div:nth-of-type(${index + 1}) li strong a`
        )
            .map((_: number, element: cheerio.Element): string => $BRJP(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .forEach((tag: string): void => {
                JPOriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });

let JPTransTags: Record<string, string>[] = [];
let JPExtraTransTagList: Record<string, string[][]> = {
    システムタグ: [
        ["ワークベンチ", "工房"],
        ["フォーラム", "论坛"]
    ],
    メジャータグ: [
        ["通常階層", "level"],
        ["副次階層", "sub-level"],
        ["例外階層", "unnumbered-level"],
        ["実体", "entity"],
        ["物品", "object"],
        ["発見記録", "tale"],
        ["ガイド", "guide"],
        ["エッセイ", "essay"],
        ["著者ページ", "author-page"],
        ["アートワーク", "艺术集"],
        ["コンポーネント", "component"],
        ["コンポーネント・バックエンド", "组件后端"],
        ["テーマ", "theme"],
        ["フラグメント", "fragment"],
        ["ハブ", "hub"],
        ["イベント", "活动"]
    ],
    世界観タグ: [
        ["屋外", "exterior"],
        ["寒冷", "arctic"],
        ["恐怖", "horror"],
        ["森林", "forested"],
        ["生活空間", "homelike"],
        ["通路", "roadway"],
        ["洞窟", "cavern"]
    ],
    コンテンツマーカー: [
        ["必読", "必读"],
        ["合作", "collaborative"],
        ["共著", "co-authored"],
        ["音声添付", "音频"],
        ["映像添付", "视频"],
        ["リダイレクト", "redirect"],
        ["アダルト", "成人内容"],
        ["注目記事", "featured"]
    ],
    ウィキ運営用: [
        ["アーカイブ", "archived"],
        ["削除通知", "待删除"]
    ],
    利用制限タグ: [["ai画像使用", "_ai-non-cc"]]
};
extraTagsPush(JPExtraTransTagList, JPTransTags);

ENOriTags.forEach((tag: Record<string, string>): void => {
    let cnTag: Record<string, string> | undefined = CNTransTags.find(
        (tags: Record<string, string>): boolean => tags.origin === tag.origin
    );
    let jpTag: Record<string, string> | undefined = JPTransTags.find(
        (tags: Record<string, string>): boolean => tags.origin === tag.origin
    );
    tagLists.push({
        origin: {
            tag: tag.origin,
            type: tag.type
        },
        en: {
            tag: tag.tag,
            type: tag.type
        },
        cn: {
            tag: cnTag?.tag ?? "",
            type: cnTag?.type ?? ""
        },
        jp: {
            tag: jpTag?.tag ?? "",
            type: jpTag?.type ?? ""
        }
    });
});
CNOriTags.forEach((tag: Record<string, string>): void => {
    let jpTag: Record<string, string> | undefined = JPTransTags.find(
        (tags: Record<string, string>): boolean => tags.origin === tag.origin
    );
    let duplateTags: Record<string, Record<string, string>> | undefined = tagLists.find(
        (tags: Record<string, Record<string, string>>): boolean => tags.origin.tag === tag.origin
    );
    if (duplateTags) {
        tagLists[tagLists.indexOf(duplateTags)].cn.tag = tag.tag;
        tagLists[tagLists.indexOf(duplateTags)].cn.type = tag.type;
    } else {
        tagLists.push({
            origin: {
                tag: tag.origin,
                type: tag.type
            },
            en: {
                tag: "",
                type: ""
            },
            cn: {
                tag: tag.tag,
                type: tag.type
            },
            jp: {
                tag: jpTag?.tag ?? "",
                type: jpTag?.type ?? ""
            }
        });
    }
});
JPOriTags.forEach((tag: Record<string, string>): void => {
    let cnTag: Record<string, string> | undefined = CNTransTags.find(
        (tags: Record<string, string>): boolean => tags.origin === tag.origin
    );
    let duplateTags: Record<string, Record<string, string>> | undefined = tagLists.find(
        (tags: Record<string, Record<string, string>>): boolean => tags.origin.tag === tag.origin
    );
    if (duplateTags) {
        tagLists[tagLists.indexOf(duplateTags)].jp.tag = tag.tag;
        tagLists[tagLists.indexOf(duplateTags)].jp.type = tag.type;
    } else {
        tagLists.push({
            origin: {
                tag: tag.origin,
                type: tag.type
            },
            en: {
                tag: "",
                type: ""
            },
            cn: {
                tag: cnTag?.tag ?? "",
                type: cnTag?.type ?? ""
            },
            jp: {
                tag: tag.tag,
                type: tag.type
            }
        });
    }
});

export const load: PageServerLoad = async () => {
    return {
        tagLists
    };
};
