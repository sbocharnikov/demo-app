import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { Route, RouterModule } from '@angular/router';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent, children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: JobSearchComponent
      },
      {
        path: 'generator',
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
