import fetchTags from "$lib/TagGuideFetch";
import type { PageServerLoad } from "./$types";

let tagLists: Record<string, Record<string, string>>[] = [];

["en", "cn", "fr", "pl", "es", "jp"].forEach((langCode: string): void => {
    let oriTagsName:
        | "ENOriTags"
        | "CNOriTags"
        | "FROriTags"
        | "PLOriTags"
        | "ESOriTags"
        | "JPOriTags" = "ENOriTags";
    switch (langCode) {
        case "en":
            oriTagsName = "ENOriTags";
            break;
        case "cn":
            oriTagsName = "CNOriTags";
            break;
        case "fr":
            oriTagsName = "FROriTags";
            break;
        case "pl":
            oriTagsName = "PLOriTags";
            break;
        case "es":
            oriTagsName = "ESOriTags";
            break;
        case "jp":
            oriTagsName = "JPOriTags";
            break;
    }
    fetchTags[oriTagsName]
        .filter((tag: Record<string, string>): boolean => tag.tag !== "")
        .forEach((tagRecord: Record<string, string>): void => {
            let cnTag: Record<string, string> | undefined = fetchTags.CNTransTags.find(
                (tags: Record<string, string>): boolean => tags.origin === tagRecord.origin
            );
            let esTag: Record<string, string> | undefined = fetchTags.ESTransTags.find(
                (tags: Record<string, string>): boolean => tags.origin === tagRecord.origin
            );
            let frTag: Record<string, string> | undefined = fetchTags.FRTransTags.find(
                (tags: Record<string, string>): boolean => tags.origin === tagRecord.origin
            );
            let plTag: Record<string, string> | undefined = fetchTags.PLTransTags.find(
                (tags: Record<string, string>): boolean => tags.origin === tagRecord.origin
            );
            let jpTag: Record<string, string> | undefined = fetchTags.JPTransTags.find(
                (tags: Record<string, string>): boolean => tags.origin === tagRecord.origin
            );
            let duplicateTags: Record<string, Record<string, string>> | undefined = tagLists.find(
                (tags: Record<string, Record<string, string>>): boolean => {
                    return tags.origin.tag === tagRecord.origin;
                }
            );

            if (duplicateTags && langCode !== "en") {
                tagLists[tagLists.indexOf(duplicateTags)][langCode].tag = tagRecord.tag;
                tagLists[tagLists.indexOf(duplicateTags)][langCode].type = tagRecord.type;
            } else {
                tagLists.push({
                    origin: {
                        tag: tagRecord.origin,
                        type: tagRecord.type
                    },
                    en: {
                        tag: langCode === "en" ? tagRecord.tag : "",
                        type: langCode === "en" ? tagRecord.type : ""
                    },
                    cn: {
                        tag: langCode === "cn" ? tagRecord.tag : (cnTag?.tag ?? ""),
                        type: langCode === "cn" ? tagRecord.type : (cnTag?.type ?? "")
                    },
                    fr: {
                        tag: langCode === "fr" ? tagRecord.tag : (frTag?.tag ?? ""),
                        type: langCode === "fr" ? tagRecord.type : (frTag?.type ?? "")
                    },
                    pl: {
                        tag: langCode === "pl" ? tagRecord.tag : (plTag?.tag ?? ""),
                        type: langCode === "pl" ? tagRecord.type : (plTag?.type ?? "")
                    },
                    es: {
                        tag: langCode === "es" ? tagRecord.tag : (esTag?.tag ?? ""),
                        type: langCode === "es" ? tagRecord.type : (esTag?.type ?? "")
                    },
                    jp: {
                        tag: langCode === "jp" ? tagRecord.tag : (jpTag?.tag ?? ""),
                        type: langCode === "jp" ? tagRecord.type : (jpTag?.type ?? "")
                    }
                });
            }
        });
});

export const load: PageServerLoad = async () => {
    return {
        tagLists
    };
};
