export class Procedure {
    public Title: string;
    public Order: number;
    public Steps: Array<ProcedureStep>;

    constructor(json?: any) {
        this.Steps = new Array<ProcedureStep>();
        if (json === undefined) { return; }
        
        // Load JSON if provided
        this.Title = json.title;
        this.Order = json.order;
        json.steps.forEach(s => {
            this.Steps.push(new ProcedureStep(s));
        });
    }
}

export class ProcedureStep {
    public Order: number;
    public Item: string;
    public Action: string;
    public IsChecklistItem: boolean;

    constructor(json?: any) {
        if (json === undefined) { return; }

        // Load JSON if provided
        this.Order = json.order;
        this.Item = json.item;
        this.Action = json.action;
        this.IsChecklistItem = json.isChecklistItem || false;
    }
}