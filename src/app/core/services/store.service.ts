import { Injectable } from "@angular/core";
import { FlashcardsBuilderRequest } from "../../flashcards/flashcards-builder/flashcards-builder.component";
import { Subject } from "../models/subject.model";
import { Topic } from "../models/topic.model";
import { ApiService } from "./api.service";

@Injectable()
export class StoreService {
    // TODO: deprecate when flashcards builder is deprecated
    private pendingFlashcardsRequest: FlashcardsBuilderRequest;
    
    public pushPendingFlashcardsBuilderRequest(request: FlashcardsBuilderRequest) {
        this.pendingFlashcardsRequest = request;
    }

    public popPendingFlashcardsBuilderRequest(): FlashcardsBuilderRequest {
        const req = this.pendingFlashcardsRequest;
        this.pendingFlashcardsRequest = undefined;
        return req;
    }
}