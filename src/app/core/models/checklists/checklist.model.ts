import { Procedure } from "./procedure.model";
import { ProcedureItem } from "./procedure-item.model";

export class Checklist {
    public id: string;
    public title: string;
    public manufacturer: string;
    public aircraftModel: string;
    public glassCockpit: boolean;
    public author: string;
    public authorUrl: string;
    public procedures: Array<Procedure>;

    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.aircraftModel = json.aircraftModel;
        this.glassCockpit = json.glassCockpit;
        this.manufacturer = json.manufacturer;
        this.author = json.author;
        this.authorUrl = json.authorUrl;

        this.procedures = new Array<Procedure>();
        
        let normalProcedures = json.normal;
        if (normalProcedures !== undefined) {
            console.log(normalProcedures);
            normalProcedures.forEach((normalProcedure) => {
                this.procedures.push(new Procedure(normalProcedure));
            });
        }

        let emergencyProcedures = json.emergency;
        if (emergencyProcedures !== undefined) {
            emergencyProcedures.forEach((emergencyProcedure) => {
                this.procedures.push(emergencyProcedure);
            });
        }
    }
}