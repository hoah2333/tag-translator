<script lang="ts">
    let input: string = "";
    let inputTags: string[] = [];
    let translateTags: Record<string, Record<string, string>>[] = [{}];

    let example: Record<string, Record<string, string>>[] = [
        {
            origin: { tag: "level", type: "Category Tags" },
            en: { tag: "level", type: "Category Tags" },
            cn: { tag: "层级", type: "虚拟作品和其他文艺作品" },
            jp: { tag: "level", type: "" }
        }
    ];

    handleTranslate();
    
    /**
     * Translates the input tags to the corresponding translations.
     */
    function handleTranslate() {
        inputTags = input.split(" ").filter((tag: string) => {
            if (tag != "") {
                return tag;
            }
        });
        inputTags.includes("tag");
        translateTags = inputTags.map((tag: string) => {
            return (
                example.find((tagLists: Record<string, Record<string, string>>) =>
                    Object.values(tagLists).some((lang: Record<string, string>) => lang.tag === tag)
                ) ?? defaultTranslates(tag)
            );
        });
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
            jp: defaultTags
        };
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
    {#each ["origin", "en", "cn", "jp"] as lang_code}
        <div class="{lang_code} lang-wrap">
            <span class="title">{lang_code.toUpperCase()}</span>
            <div class="output-tags">
                {#each translateTags as tag}
                    <span class="tag">
                        <i
                            class="fas fa-{tag[lang_code].type != '' ? 'check' : 'times'}-circle"
                        />{tag[lang_code].tag}
                    </span>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="scss" type="text/scss">
    @import "./page";
</style>
