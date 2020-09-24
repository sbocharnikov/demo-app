import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainGuard } from './features/main/guards/main.guard';
import { LoginGuard } from './features/login/guards/login.guard';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [LoginGuard, MainGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
