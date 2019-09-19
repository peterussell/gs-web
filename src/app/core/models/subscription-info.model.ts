import { Subject } from "./subject.model";

export class SubscriptionInfo {
    public PurchasedCourses: Array<PurchasedCourse>;

    constructor(json: [any]) {
        // load purchased courses
        this.PurchasedCourses = new Array<PurchasedCourse>();
        const purchasedCourses = json["PurchasedCourses"];
        for (let i=0; i<purchasedCourses.length; i++) {
            let pcData = purchasedCourses[i];
            let subjectData = pcData["Subject"];

            let pc = new PurchasedCourse();

            // new Date() in typescript assumes local, append Z to force UTC
            // (TODO: should do this at the server end)
            pc.PurchaseDate = new Date(pcData["PurchaseDate"] + 'Z');
            pc.ExpiryDate = new Date(pcData["ExpiryDate"] + 'Z');
            pc.CoursePath = pcData["CoursePath"];
            pc.Subject = new Subject(
                subjectData["CourseId"],
                subjectData["SubjectId"],
                subjectData["Title"],
                subjectData["Path"],
                subjectData["Version"],
                subjectData["PremiumVersionAvailable"],
                subjectData["FreeVersionAvailable"],
                null
            );
            this.PurchasedCourses.push(pc);
        }
    }

    ownsPurchasedCourseWithSubject(subjectId: string): boolean {
        return this.PurchasedCourses.filter(pc => 
            pc.Subject.SubjectId === subjectId
        ).length > 0;
    }
}

export class PurchasedCourse {
    public PurchaseDate: Date;
    public ExpiryDate: Date;
    public CoursePath: string;
    public Subject: Subject;
}