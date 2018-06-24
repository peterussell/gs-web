import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule
    ],
    exports: [
        MatSidenavModule,
        MatExpansionModule,
        MatListModule
    ]
})
export class MaterialModule {}