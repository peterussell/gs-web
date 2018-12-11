import { Injectable } from "@angular/core";
import { FlashcardsBuilderRequest } from "../../flashcards/flashcards-builder/flashcards-builder.component";

@Injectable()
export class StoreService {
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