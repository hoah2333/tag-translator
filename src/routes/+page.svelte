<script lang="ts">
    import _ from "lodash";
    export let data;

    const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

    let input: string = "";
    let translateTags: Record<string, Record<string, string>>[] = [{}];

    let pointerPos: Record<string, number> = { X: 0, Y: 0 };

    function pointerMove(event: PointerEvent): void {
        pointerPos.X = event.offsetX;
        pointerPos.Y = event.offsetY;
    }

    // Update translate once when first load
    handleTranslate();

    /**
     * Translates the input tags to the corresponding translations.
     */
    function handleTranslate(): void {
        let inputTags: string[] = _.chain(input)
            .replace(/\n/g, " ")
            .toLower()
            .split(" ")
            .filter((tag: string): boolean => !!tag)
            .value();
        translateTags = _.map(inputTags, (tag: string): Record<string, Record<string, string>> => {
            if (["隐秘层级", "隐秘实体"].includes(tag)) {
                return defaultTranslates(tag);
            }

            if (tag === "隐秘系列") {
                if (inputTags.includes("层级")) {
                    tag = "隐秘层级";
                }
                if (inputTags.includes("实体")) {
                    tag = "隐秘实体";
                }
            }

            let returnTranslate: Record<string, Record<string, string>> = _.find(
                _.cloneDeep(data.tagLists),
                (tagLists: Record<string, Record<string, string>>): boolean =>
                    _.some(tagLists, (lang: Record<string, string>): boolean => lang.tag === tag)
            ) ?? defaultTranslates(tag);

            tagTransform(returnTranslate, "", tag);
            tagTransform(returnTranslate, "隐秘层级", "隐秘系列");

            return returnTranslate;
        });

        /**
         * Combines two tags into one, and adds the combined tag to the input tags array.
         * @param firstTag - first tag to combine
         * @param secondTag - second tag to combine
         * @param output - combined tag
         */
        function multiTagsToOne(firstTag: string, secondTag: string, output: string): void {
            if (inputTags.includes(firstTag) && inputTags.includes(secondTag)) {
                inputTags = _.filter(
                    inputTags,
                    (tag: string): boolean => tag !== firstTag && tag !== secondTag
                );
                inputTags.push(output);
                return;
            }
            if (inputTags.includes(output)) {
                inputTags = _.filter(inputTags, (tag: string): boolean => tag !== output);
                inputTags.push(firstTag);
                inputTags.push(secondTag);
                return;
            }
        }

        /**
         * Transforms the tags in the given object to the target tag.
         * @param object - The object to transform the tags in.
         * @param originTag - The tag to transform.
         * @param targetTag - The tag to transform to.
         */
        function tagTransform(
            object: Record<string, Record<string, string>>,
            originTag: string,
            targetTag: string
        ): void {
            _.chain(object)
                .filter((lang: Record<string, string>): boolean => lang.tag === originTag)
                .map((tag: Record<string, string>): string => (tag.tag = targetTag))
                .value();
        }
    }

    /**
     * Creates a default translation object, used when the tag is not found in the given array.
     * @param tag - The tag to create a default translation object for.
     * @returns A default translation object with the given tag and an empty type.
     * @example
     *      >> defaultTranslates("foo")
     *      << {
     *             origin: { tag: "foo", type: "" },
     *             en: { tag: "foo", type: "" },
     *             cn: { tag: "foo", type: "" },
     *             fr: { tag: "foo", type: "" },
     *             pl: { tag: "foo", type: "" },
     *             es: { tag: "foo", type: "" },
     *             jp: { tag: "foo", type: "" }
     *         }
     */
    function defaultTranslates(tag: string): Record<string, Record<string, string>> {
        let defaultTags: Record<string, string> = {
            tag: tag,
            type: ""
        };
        return {
            origin: defaultTags,
            en: defaultTags,
            cn: defaultTags,
            fr: defaultTags,
            pl: defaultTags,
            es: defaultTags,
            jp: defaultTags
        };
    }

    let isShowTexts: Record<string, boolean> = {
        origin: false,
        en: false,
        cn: false,
        fr: false,
        pl: false,
        es: false,
        jp: false
    };
    let outputTextarea: Record<string, HTMLTextAreaElement> = {};
    /**
     * Toggle the visibility of the output textareas. Not using inline function is because it
     * need "await" so that outputTextarea[lang_code] can be accessed.
     * @param lang_code - The language code of the textarea to toggle.
     *
     */
    async function handleOutput(lang_code: string): Promise<void> {
        isShowTexts[lang_code] = !isShowTexts[lang_code];
        await sleep(100);
        outputTextarea[lang_code].focus();
        outputTextarea[lang_code].select();
    }
</script>

<div class="input-wrapper">
    <textarea
        name="input"
        id="input"
        bind:value={input}
        on:input={() => {
            handleTranslate();
        }}
    />
</div>

<div class="output-wrapper">
    {#each ["origin", "en", "cn", "fr", "pl", "es", "jp"] as lang_code (lang_code)}
        <div class="{lang_code} lang-wrap">
            <span class="title">{lang_code.toUpperCase()}</span>
            <div
                class="output-tags"
                role="button"
                tabindex="0"
                aria-pressed={isShowTexts[lang_code]}
                on:click={() => {
                    handleOutput(lang_code);
                }}
                on:keydown={(event) => {
                    if (event.key === "Enter") {
                        handleOutput(lang_code);
                    }
                }}
            >
                {#if isShowTexts[lang_code]}
                    <textarea
                        readonly
                        bind:this={outputTextarea[lang_code]}
                        on:blur={() => {
                            isShowTexts[lang_code] = !isShowTexts[lang_code];
                        }}
                        >{translateTags
                            .map((tag) => tag[lang_code].tag)
                            .join(" ")
                            .trim()}</textarea
                    >
                {:else}
                    {#each translateTags as tag}
                        <span class="tag" on:pointermove={(event) => pointerMove(event)}>
                            <i
                                class="fas fa-{tag[lang_code].type != ''
                                    ? 'check'
                                    : 'times'}-circle"
                            />{tag[lang_code].tag}
                            <span
                                class="hover"
                                style="left: {pointerPos.X + 8}px; top: {pointerPos.Y + 8}px"
                            >
                                Category: {tag[lang_code].type || "?"}
                            </span>
                        </span>
                    {/each}
                {/if}
            </div>
        </div>
    {/each}
</div>

<style lang="scss" type="text/scss">
    @import "./page";
</style>
