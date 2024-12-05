import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

type CommandType = "keyword" | "from" | "filter" | "url";

type FilterType = "images" | "videos" | "media";

@customElement("command-item")
class CommandItem extends LitElement {
    @query(".command-type")
    private commandTypeSelect!: HTMLSelectElement;

    @query(".command-text")
    private commandTextInput!: HTMLInputElement;

    @query(".exact-match")
    private exactMatchCheckbox!: HTMLInputElement;

    @query(".filter-type")
    private filterTypeSelect!: HTMLSelectElement;

    @query(".include-exclude")
    private includeExcludeSelect!: HTMLSelectElement;

    @property({ type: Boolean })
    public showRemoveButton = true;

    @property({ type: String })
    private commandType: CommandType = "keyword";

    @property({ type: String })
    private filterType: FilterType = "images";

    @property({ type: String })
    private includeExclude: "include" | "exclude" = "include";

    public static override styles = css`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :host {
            display: block;
        }

        .command-item {
            display: flex;
            gap: 1rem;
        }
    `;

    protected override render(): ReturnType<typeof html> {
        return html`
            <div class="command-item">
                <select class="command-type" @change=${this.onCommandTypeChange.bind(this)} .value=${this.commandType}>
                    <option value="keyword">キーワード</option>
                    <option value="from">ユーザー</option>
                    <option value="filter">フィルター</option>
                    <option value="url">URL</option>
                </select>
                <input
                    type="text"
                    class="command-text"
                    style="display: ${this.commandType === "filter" ? "none" : "block"};"
                />
                <label style="display: ${this.commandType === "keyword" ? "block" : "none"};">
                    <input type="checkbox" class="exact-match" />
                    完全一致
                </label>
                <select
                    class="filter-type"
                    @change=${this.onFilterTypeChange.bind(this)}
                    .value=${this.filterType}
                    style="display: ${this.commandType === "filter" ? "block" : "none"};"
                >
                    <option value="images">画像</option>
                    <option value="videos">動画</option>
                    <option value="media">画像または動画</option>
                </select>
                <select
                    class="include-exclude"
                    @change=${this.onIncludeExcludeChange.bind(this)}
                    .value=${this.includeExclude}
                >
                    <option value="include">含む</option>
                    <option value="exclude">除外</option>
                </select>
                <div class="container-controls">
                    <button @click=${this.dispatchAddEvent.bind(this)}>追加</button>
                    <button
                        @click=${this.dispatchRemoveEvent.bind(this)}
                        style="display: ${this.showRemoveButton ? "inline-block" : "none"};"
                    >
                        削除
                    </button>
                </div>
            </div>
        `;
    }

    private onCommandTypeChange(): void {
        this.commandType = this.commandTypeSelect.value as CommandType;
    }

    private onFilterTypeChange(): void {
        this.filterType = this.filterTypeSelect.value as FilterType;
    }

    private onIncludeExcludeChange(): void {
        this.includeExclude = this.includeExcludeSelect.value as "include" | "exclude";
    }

    private dispatchAddEvent(): void {
        this.dispatchEvent(new CustomEvent("add-command-item", { bubbles: true, composed: true }));
    }

    private dispatchRemoveEvent(): void {
        this.dispatchEvent(new CustomEvent("remove-command-item", { bubbles: true, composed: true }));
    }

    public getCommand(): string {
        switch (this.commandType) {
            case "keyword":
                return `${this.includeExclude === "include" ? "" : "-"}${this.exactMatchCheckbox.checked ? '"' : ""}${this.commandTextInput.value}${this.exactMatchCheckbox.checked ? '"' : ""}`;

            case "from":
                return `${this.includeExclude === "include" ? "" : "-"}from:${this.commandTextInput.value}`;

            case "filter":
                return `${this.includeExclude === "include" ? "" : "-"}filter:${this.filterType}`;

            case "url":
                return `${this.includeExclude === "include" ? "" : "-"}url:${this.commandTextInput.value}`;

            default:
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`Unknown command type: ${this.commandType}`);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "command-item": CommandItem;
    }
}

export { CommandItem };
