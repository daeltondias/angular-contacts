import { Component, Input, forwardRef } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

type OnChangeType = (value: string) => void;
type OnTouchedType = () => void;

@Component({
  selector: 'app-input',
  providers: [
    provideNgxMask({ dropSpecialCharacters: false }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() name = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() errors?: Record<string, string[]> = {};
  @Input() disabled: string | boolean = false;
  @Input() class?: string;
  @Input() mask?: string;

  value = '';

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};

  writeValue(value: string) {
    this.value = value || '';
  }

  registerOnChange(fn: OnChangeType) {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType) {
    this.onTouched = fn;
  }
}
