import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule
    ],
    exports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule,
        MatCardModule,
        MatSelectModule
    ]
})
export class MaterialModule {}