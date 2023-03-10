import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-go-back-button",
  templateUrl: "./go-back-button.component.html",
  styleUrls: ["./go-back-button.component.css"],
})
export class GoBackButtonComponent {
  constructor(private router: Router) {}

  onGoBack() {
    this.router.navigate(['/menu']);
  }
}
