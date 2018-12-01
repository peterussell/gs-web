import { ProcedureItem } from "./procedure-item.model";

export class Procedure {
    title: string;
    type: ChecklistType;
    items: Array<ProcedureItem>;

    constructor(json) {
        this.title = json.title;

        this.items = new Array<ProcedureItem>();
        if (json.items !== undefined) {
            json.items.forEach((itemJson) => {
                this.items.push(new ProcedureItem(itemJson));
            })
        }
    }
}

enum ChecklistType {
    Normal,
    Emergency
}