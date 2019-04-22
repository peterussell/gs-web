import { Procedure, ProcedureStep } from './procedure';

export class ProcedureList {
    Title: string;
    Procedures: Array<Procedure>;

    constructor(json?: any) {
        this.Procedures = new Array<Procedure>();
        if (json === undefined) { return; }

        // Load JSON if provided
        this.Title = json.title;
        json.procedures.forEach(p => {
            this.Procedures.push(new Procedure(p));
        })
    }
}