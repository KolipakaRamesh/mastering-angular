/**
 * FILE: highlight.directive.ts
 * PURPOSE: A custom Attribute Directive that highlights an element's background on hover.
 *
 * ANGULAR CONCEPT: Directives
 * There are 3 types of directives:
 * 1. COMPONENT Directives — a component IS a directive with a template
 * 2. ATTRIBUTE Directives — change APPEARANCE/BEHAVIOR, no template (e.g., ngClass, ngStyle)
 * 3. STRUCTURAL Directives — change DOM STRUCTURE (e.g., *ngIf, *ngFor → @if, @for)
 *
 * @if vs *ngIf:
 *   OLD: <div *ngIf="isLoading">Loading...</div> — needed CommonModule
 *   NEW: @if (isLoading) { <div>Loading...</div> } — built-in, no import needed
 *
 * INTERVIEW:
 * Q: What is @HostListener?
 * A: Decorator that listens to DOM events on the HOST element.
 *
 * Q: What is @HostBinding?
 * A: Decorator that binds a property of the host element.
 */

import { Directive, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  private el = inject(ElementRef);

  @Input('appHighlight') highlightColor: string = '#e3f2fd';
  private originalColor: string = '';

  ngOnInit(): void {
    this.originalColor = this.el.nativeElement.style.backgroundColor || '';
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.transition = 'background-color 0.2s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = this.originalColor;
  }
}
