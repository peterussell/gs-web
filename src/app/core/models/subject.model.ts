import { Topic } from "./topic.model";

export class Subject {
    public topics: Array<Topic>;
    
    constructor(
        public CourseId: string,
        public SubjectId: string,
        public Title: string,
        public Path: string,
        public Version: number,
        public PremiumVersionAvailable: boolean,
        public FreeVersionAvailable: boolean,
        public Topics: Array<Topic>) {
            if (Topics) {
                this.topics = Topics.sort();
            }
        }
}