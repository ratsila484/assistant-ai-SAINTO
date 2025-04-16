import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../services/chat.service';
import { CommandDialogComponent } from '../command-dialog/command-dialog.component';

@Component({
  selector: 'app-confirmer-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirmer-dialog.component.html',
  styleUrl: './confirmer-dialog.component.css'
})
export class ConfirmerDialogComponent {
  articleCommander: { nom: string, nb: number }[] = [];
  constructor(
    public dialogRef: MatDialogRef<ConfirmerDialogComponent>,
    public dialogRef2: MatDialogRef<CommandDialogComponent>,
    private dialog: MatDialog,
    private chatService : ChatService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.articleCommander = data.articleCommader
    console.log(this.articleCommander)
  }

  responseOk() {
    // Fermer les boîtes de dialogue
    this.dialogRef.close(this.articleCommander);
    this.dialog.closeAll();
  }


}
