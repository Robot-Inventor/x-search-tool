// eslint-disable-next-line import-x/no-unassigned-import
import "./search-operator";
import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { CommandItem } from "./command-item";
// eslint-disable-next-line no-duplicate-imports
import type { SearchOperator } from "./search-operator";

@customElement("command-group")
class CommandGroup extends LitElement {
    @query("slot")
    private slotElement!: HTMLSlotElement;

    @property({ attribute: "top-level", reflect: true, type: Boolean })
    public isTopLevel = false;

    public static override styles = css`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :host {
            display: block;
        }

        .command-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
        }

        .command-group:not(.top-level) {
            background: #009fff2e;
        }

        .add-group {
            flex-shrink: 1;
            width: fit-content;
        }
    `;

    protected override render(): ReturnType<typeof html> {
        return html`
            <div class="command-group ${this.isTopLevel ? "top-level" : ""}">
                <slot>
                    <command-item
                        @add-command-item=${this.addItem.bind(this)}
                        @remove-command-item=${this.removeItemOrGroup.bind(this)}
                        .showRemoveButton=${!this.isTopLevel}
                    ></command-item>
                </slot>
                <button class="add-group" @click=${this.onAddGroupButtonClick.bind(this)}>グループを追加</button>
            </div>
        `;
    }

    public getCommand(): string {
        const elements = this.slotElement.querySelectorAll<CommandItem | SearchOperator | CommandGroup>(
            "command-item, search-operator, command-group"
        );
        const commands = Array.from(elements)
            .map((item) => {
                if (item instanceof CommandItem || item instanceof CommandGroup) {
                    return item.getCommand();
                }

                const searchOperator = item.getSearchOperator();
                return searchOperator === "AND" ? "" : searchOperator;
            })
            .filter((command) => command !== "");

        const commandString = commands.join(" ");
        // eslint-disable-next-line no-magic-numbers
        return this.isTopLevel || commands.length === 1 ? commandString : `(${commandString})`;
    }

    private onAddGroupButtonClick(): void {
        const fragment = document.createDocumentFragment();

        const searchOperator = document.createElement("search-operator");
        fragment.appendChild(searchOperator);

        const commandGroup = document.createElement("command-group");
        commandGroup.addEventListener("remove-command-group", this.removeItemOrGroup.bind(this));
        fragment.appendChild(commandGroup);

        this.slotElement.appendChild(fragment);
    }

    // eslint-disable-next-line max-statements
    private addItem(event: Event): void {
        const { target } = event;
        if (!(target instanceof HTMLElement)) return;

        const fragment = document.createDocumentFragment();

        const searchOperator = document.createElement("search-operator");
        fragment.appendChild(searchOperator);

        const commandItem = document.createElement("command-item");
        commandItem.addEventListener("add-command-item", this.addItem.bind(this));
        commandItem.addEventListener("remove-command-item", (removeEvent) => {
            searchOperator.remove();
            this.removeItemOrGroup(removeEvent);
        });
        fragment.appendChild(commandItem);

        target.parentElement?.insertBefore(fragment, target.nextSibling);

        const commandItems = this.slotElement.querySelectorAll("command-item");
        commandItems.forEach((item) => {
            item.showRemoveButton = true;
        });
    }

    // eslint-disable-next-line max-statements
    private removeItemOrGroup(event: Event): void {
        const { target } = event;
        if (!(target instanceof HTMLElement)) return;

        const commandsAndGroups = this.slotElement.querySelectorAll("command-item, command-group");
        const [firstCommandOrGroup] = commandsAndGroups;

        const previousSibling = target.previousElementSibling;
        if (previousSibling?.tagName.toLowerCase() === "search-operator") {
            previousSibling.remove();
        }

        if (target === firstCommandOrGroup) {
            const nextSibling = target.nextElementSibling;
            if (nextSibling?.tagName.toLowerCase() === "search-operator") {
                nextSibling.remove();
            }
        }

        target.remove();

        const updatedElements = this.slotElement.querySelectorAll("command-item, command-group");
        const [firstElement] = updatedElements;

        // eslint-disable-next-line no-magic-numbers
        if (updatedElements.length === 1 && firstElement && this.isTopLevel && firstElement instanceof CommandItem) {
            firstElement.showRemoveButton = false;
        }

        if (!updatedElements.length && !this.isTopLevel) {
            this.dispatchEvent(new CustomEvent("remove-command-group", { bubbles: true, composed: true }));
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "command-group": CommandGroup;
    }
}

export { CommandGroup };
