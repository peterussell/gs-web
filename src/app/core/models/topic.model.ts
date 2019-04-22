import { Question } from "./question.model";

export class Topic {
    public TopicId: string;
    public SubjectId: string;
    public Title: string;
    public Path: string;
    public SubTopic: string;
    public Questions: Array<Question>;
}