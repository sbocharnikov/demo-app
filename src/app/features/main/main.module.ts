import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { Route, RouterModule } from '@angular/router';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NAVIGATE } from '../../app.config';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent, children: [
      {
        path: '',
        redirectTo: NAVIGATE.SEARCH,
        pathMatch: 'full'
      },
      {
        path: NAVIGATE.SEARCH,
        component: JobSearchComponent
      },
      {
        path: NAVIGATE.IMAGE_GENERATOR,
        component: ImageGeneratorComponent
      }
    ]
  }
];

@NgModule({
  declarations: [MainComponent, JobSearchComponent, ImageGeneratorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class MainModule { }
