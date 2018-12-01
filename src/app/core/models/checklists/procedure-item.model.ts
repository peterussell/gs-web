export class ProcedureItem {
    item: string;
    value: string;
    style: Array<{ attribute: string, value: string }>;
    
    constructor(json) {
        this.item = json.item;
        this.value = json.value;

        this.style = new Array<{ attribute: string, value: string }>();

        if (json.style !== undefined) {
            json.style.forEach((jsonStyle: { attribute: string, value: string }) => {
                this.style.push(jsonStyle);
            })
        }
    }
}