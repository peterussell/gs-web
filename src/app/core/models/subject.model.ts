import { isDevMode } from '@angular/core';
import { Topic } from "./topic.model";

export class Subject {
    public CourseId: string;
    public SubjectId: string;
    public Title: string;
    public Path: string;
    public Version: number;
    public PremiumVersionAvailable: boolean;
    public FreeVersionAvailable: boolean;
    public Topics: Array<Topic>;
    public TestStripeSKU: string;
    public StripeSKU: string;
    
    constructor(data: any) {
        this.CourseId = data['CourseId'];
        this.SubjectId = data['SubjectId'];
        this.Title = data['Title'];
        this.Path = data['Path'];
        this.Version = data['Version'];
        this.PremiumVersionAvailable = data['PremiumVersionAvailable'];
        this.FreeVersionAvailable = data['FreeVersionAvailable'];
        this.TestStripeSKU = data['TestStripeSKU'];
        this.StripeSKU = data['StripeSKU'];

        let topics = data['Topics'];
        if (topics) {
            this.Topics = topics.sort();
        }
    }

    public getStripeSKU(): string {
        return isDevMode() ? this.TestStripeSKU : this.StripeSKU;
    }
}