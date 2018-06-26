import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class MaterialModule {}