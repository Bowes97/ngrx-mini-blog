import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { StyleClassModule } from 'primeng/styleclass';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

const PRIME_IMPORTS = [
  InputTextModule,
  ButtonModule,
  CardModule,
  AccordionModule,
  ProgressSpinnerModule,
  PaginatorModule,
  StyleClassModule,
  DatePickerModule,
  InputNumberModule
]

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PRIME_IMPORTS
  ]
})

export class SharedModule {}
