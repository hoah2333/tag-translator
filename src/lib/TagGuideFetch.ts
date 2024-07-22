import WDmodule from "$lib/WDmodule";
import * as cheerio from "cheerio";

async function getTagGuide(siteName: string, https: boolean = false): Promise<cheerio.CheerioAPI> {
    return new WDmodule(`http${https ? "s" : ""}://${siteName}.wikidot.com`).getPageSource(
        "tag-guide"
    );
}

const $BREN: cheerio.CheerioAPI = await getTagGuide("backrooms-wiki");
const $BRCN: cheerio.CheerioAPI = await getTagGuide("backrooms-wiki-cn", true);
const $BRJP: cheerio.CheerioAPI = await getTagGuide("japan-backrooms-wiki");
const $BRES: cheerio.CheerioAPI = await getTagGuide("es-backrooms-wiki");
const $BRFR: cheerio.CheerioAPI = await getTagGuide("fr-backrooms-wiki");
const $BRPL: cheerio.CheerioAPI = await getTagGuide("pl-backrooms-wiki");
const $BRRU: cheerio.CheerioAPI = await getTagGuide("ru-backrooms-wiki");
const $BRVN: cheerio.CheerioAPI = await getTagGuide("backrooms-vn");

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
            .filter((tag: string): boolean => tag != "")
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
                (_: number, element: cheerio.Element): boolean =>
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
            .filter((tag: string): boolean => tag != "")
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
                (_: number, element: cheerio.Element): boolean =>
                    $BRCN(element).html()?.includes("<strong><em><a") ?? false
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
            .filter((tag: string): boolean => tag != "")
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
    写作类别水印: [
        ["隐秘层级", "unnumbered-level"],
        ["隐秘实体", "unnumbered-entity"]
    ],
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
            .filter((tag: string): boolean => tag != "")
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
        ["洞窟", "cavern"],
        ["メタ", "meta"]
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

let ESOriTags: Record<string, string>[] = [];
$BRES(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRES(element).text();

        let tags: string = $BRES(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) table`)
            .filter(
                (_: number, element: cheerio.Element): boolean =>
                    $BRES(element).find("tr:nth-of-type(1) th:nth-of-type(2)").text() !==
                    "Etiqueta EN"
            )
            .find("td:nth-of-type(1) a")
            .map((_: number, element: cheerio.Element): string => $BRES(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string): void => {
                ESOriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });
let ESTransTags: Record<string, string>[] = [];
$BRES(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRES(element).text();

        let tags: string = $BRES(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) table`)
            .filter(
                (_: number, element: cheerio.Element): boolean =>
                    $BRES(element).find("tr:nth-of-type(1) th:nth-of-type(2)").text() ===
                    "Etiqueta EN"
            )
            .find("td:is(:nth-of-type(1), :nth-of-type(2)) a")
            .map((_: number, element: cheerio.Element): string => $BRES(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string, index: number, array: string[]): void => {
                if (index % 2 === 0) {
                    ESTransTags.push({
                        tag: tag,
                        origin: array[index + 1] ?? "",
                        type: tagtype
                    });
                }
            });
    });

let FROriTags: Record<string, string>[] = [];
$BRFR(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRFR(element).text();

        let tags: string = $BRFR(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) table`)
            .filter(
                (_: number, element: cheerio.Element): boolean =>
                    !["Équivalent anglais", "Description"].includes(
                        $BRFR(element).find("tr:nth-of-type(1) th:nth-of-type(2)").text()
                    )
            )
            .find("td:nth-of-type(1) a")
            .map((_: number, element: cheerio.Element): string => $BRFR(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string): void => {
                FROriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });
let FRTransTags: Record<string, string>[] = [];
$BRFR(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRFR(element).text();

        let tags: string = $BRFR(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) table`)
            .filter((_: number, element: cheerio.Element): boolean =>
                ["Équivalent anglais", "Description"].includes(
                    $BRFR(element).find("tr:nth-of-type(1) th:nth-of-type(2)").text()
                )
            )
            .find("td:is(:nth-of-type(1), :nth-of-type(2))")
            .map((_: number, element: cheerio.Element): string => $BRFR(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string, index: number, array: string[]): void => {
                if (index % 2 === 0) {
                    FRTransTags.push({
                        tag: tag,
                        origin:
                            array[index + (["-", "/"].includes(array[index + 1]) ? 0 : 1)] ?? "",
                        type: tagtype
                    });
                }
            });
    });
let FRExtraTransTagList: Record<string, string[][]> = {
    "Tags de genre/style": [
        ["doux-amer", "bittersweet"],
        ["comédie", "comedy"],
        ["horreur", "horror"],
        ["mystère", "mystery"],
        ["nostalgie", "nostalgia"],
        ["tragédie", "tragedy"],
        ["émerveillement", "wonder"]
    ],
    "Tags de concours/autres tags": [["sélection-annuelle", "annual-feature"]]
};
extraTagsPush(FRExtraTransTagList, FRTransTags);

let PLOriTags: Record<string, string>[] = [];
$BRPL(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRPL(element).text();

        let tags: string = $BRPL(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) li`)
            .filter(
                (_: number, element: cheerio.Element): boolean =>
                    !($BRPL(element).html()?.includes("(") ?? true)
            )
            .find("a:not(.footnoteref)")
            .map((_: number, element: cheerio.Element): string => $BRPL(element).text())
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string): void => {
                PLOriTags.push({
                    tag: tag,
                    origin: tag,
                    type: tagtype
                });
            });
    });
let PLExtraOriTagList: Record<string, string[][]> = {
    Konkursy: [["baner-2023", "baner-2023"]]
};
extraTagsPush(PLExtraOriTagList, PLOriTags);

let PLTransTags: Record<string, string>[] = [];
$BRPL(".yui-nav li")
    .map((index: number, element: cheerio.Element): string => {
        let types: string = $BRPL(element).text();

        let tags: string = $BRPL(`.yui-navset .yui-content > div:nth-of-type(${index + 1}) li`)
            .filter(
                (_: number, element: cheerio.Element): boolean =>
                    $BRPL(element).html()?.includes("(") ?? false
            )
            .map(
                (_: number, element: cheerio.Element): string =>
                    `${$BRPL(element).find("a:not(.footnoteref)").text()}|${
                        $BRPL(element)
                            .text()
                            .match(/\(([^\(\)]+)\)/)?.[1] ??
                        $BRPL(element).find("a:not(.footnoteref)").text()
                    }`
            )
            .toArray()
            .join("|");

        return `${types}|${tags}`;
    })
    .toArray()
    .forEach((tags: string): void => {
        let tagtype: string = tags.split("|")[0];
        tags.split("|")
            .slice(1)
            .filter((tag: string): boolean => tag != "")
            .forEach((tag: string, index: number, array: string[]): void => {
                if (index % 2 === 0) {
                    PLTransTags.push({
                        tag: tag,
                        origin: array[index + 1] ?? "",
                        type: tagtype
                    });
                }
            });
    });
let PLExtraTransTagList: Record<string, string[][]> = {
    Użyteczne: [["nieaktualne", "旧页面"]],
    Inne: [["kolaboracja", "co-authored"]]
};
extraTagsPush(PLExtraTransTagList, PLTransTags);

export default {
    ENOriTags,
    CNOriTags,
    CNTransTags,
    FROriTags,
    FRTransTags,
    PLOriTags,
    PLTransTags,
    ESOriTags,
    ESTransTags,
    JPOriTags,
    JPTransTags
};
