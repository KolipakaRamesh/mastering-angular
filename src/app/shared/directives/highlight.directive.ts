/**
 * FILE: highlight.directive.ts
 * PURPOSE: A custom Attribute Directive that highlights an element's background.
 *
 * ANGULAR CONCEPTS:
 * - Attribute Directives (modifying host element behavior and styling)
 * - `@HostListener` to respond to DOM events on the host element
 * - Dependency Injection (`inject(ElementRef)`)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What is the difference between ngClass and class binding?
 * A: Class binding (`[class.active]=\"isActive\"`) toggles a single class. `ngClass` toggles multiple classes by taking an object, string, or array.
 *
 * Q: What is @HostListener?
 * A: A decorator that declares a DOM event listener on the host element of the directive or component.
 *
 * Q: What is @HostBinding?
 * A: A decorator that binds a host element property (like `style.backgroundColor`) to a property in the directive.
 */


import { Directive, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';

// @Directive decorator — marks class as a directive
// selector: '[appHighlight]' — applied as an ATTRIBUTE: <tr appHighlight>
// standalone: true — no NgModule needed
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {

  // inject() the ElementRef — gives us access to the host DOM element
  // ElementRef wraps the native DOM element so Angular can abstract it
  private el = inject(ElementRef);

  // @Input allows the directive to accept a value from the parent:
  // <tr appHighlight="lightyellow"> or <tr [appHighlight]="color">
  // Default value is 'lightyellow' if none is provided
  @Input('appHighlight') highlightColor: string = '#e3f2fd';

  // Original background color — so we can restore it on mouse leave
  private originalColor: string = '';

  // OnInit lifecycle hook — runs AFTER Angular initializes the component/directive
  ngOnInit(): void {
    // Save the original background color
    this.originalColor = this.el.nativeElement.style.backgroundColor || '';
  }

  // @HostListener listens to events on the HOST element (the element this directive is on)
  // 'mouseenter' fires when the mouse enters the element
  @HostListener('mouseenter')
  onMouseEnter(): void {
    // this.el.nativeElement is the actual DOM element
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.transition = 'background-color 0.2s ease';
  }

  // 'mouseleave' fires when the mouse leaves the element
  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Restore original color
    this.el.nativeElement.style.backgroundColor = this.originalColor;
  }
}
