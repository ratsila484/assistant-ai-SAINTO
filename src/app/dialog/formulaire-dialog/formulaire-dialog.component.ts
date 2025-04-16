import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulaire-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './formulaire-dialog.component.html',
  styleUrl: './formulaire-dialog.component.css'
})
export class FormulaireDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<FormulaireDialogComponent>
  ) { }
  nom: string = "";
  email: string = "";
  num: string = "";
  adresse: string = "";
  //gestion erreur
  isNotNom: boolean = false;
  isNotEmail: boolean = false;
  isNotNum: boolean = false;
  isNotAdresse: boolean = false;

  //stocker tous les infos dans un tableau
  clientidentity: (
    {
      nom: string,
      email: string,
      num: string,
      adresse: string
    }
  )[] = [];

  validerData() {
    if (this.nom != "" &&
      this.email != "" &&
      this.num != "" &&
      this.adresse != ""
    ) {
      this.clientidentity.push(
        {
          nom: this.nom,
          email: this.email,
          num: this.num,
          adresse: this.adresse
        }
      )
      console.log(this.clientidentity);
      this.dialogRef.close(this.clientidentity)
    }else{
      this.dialogRef.close(false)
      return
    }
  }

}
