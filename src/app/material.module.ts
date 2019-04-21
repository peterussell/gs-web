import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatChipsModule
    ],
    exports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatChipsModule
    ]
})
export class MaterialModule {}