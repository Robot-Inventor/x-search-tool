import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

type SearchOperatorType = "AND" | "OR";

@customElement("search-operator")
class SearchOperator extends LitElement {
    @query("select")
    private selectElement!: HTMLSelectElement;

    @property({ type: String })
    private searchOperatorType: SearchOperatorType = "AND";

    public static override styles = css`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
    `;

    protected override render(): ReturnType<typeof html> {
        return html`
            <div>
                <select .value=${this.searchOperatorType} @change=${this.onSearchOperatorChange.bind(this)}>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
            </div>
        `;
    }

    public getSearchOperator(): SearchOperatorType {
        return this.searchOperatorType;
    }

    private onSearchOperatorChange(): void {
        this.searchOperatorType = this.selectElement.value as SearchOperatorType;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "search-operator": SearchOperator;
    }
}

export { SearchOperator };
