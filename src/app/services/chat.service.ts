import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  constructor() { }

  // Méthode pour envoyer un message comme utilisateur
  sendUserMessage(text: string): void {
    const messages = this.messagesSubject.getValue();
    const newMessage: ChatMessage = {
      text,
      isUser: true,
      timestamp: new Date()
    };
    this.messagesSubject.next([...messages, newMessage]);
  }

  // Méthode pour envoyer un message comme bot
  sendBotMessage(text: string): void {
    const messages = this.messagesSubject.getValue();
    const newMessage: ChatMessage = {
      text,
      isUser: false,
      timestamp: new Date()
    };
    this.messagesSubject.next([...messages, newMessage]);
  }

  // Vous pourriez également ajouter une méthode pour gérer la génération du devis
  genererDevis(commande: { nom: string, nb: number }[]): void {
    // Logique pour générer le devis
    // ...

    // Une fois le devis généré, envoyez un message avec les détails
    setTimeout(() => {
      let devisMessage = "Voici votre devis :\n\n";
      let total = 0;

      commande.forEach(article => {
        const prixUnitaire = this.getPrixArticle(article.nom);
        const sousTotal = prixUnitaire * article.nb;
        total += sousTotal;

        devisMessage += `${article.nom} (${article.nb} packs) : ${sousTotal.toFixed(2)} €\n`;
      });

      devisMessage += `\nTotal : ${total.toFixed(2)} €`;

      this.sendBotMessage(devisMessage);
    }, 2000); // Simuler un délai pour le traitement du devis
  }

  // Méthode fictive pour obtenir le prix d'un article
  private getPrixArticle(nomArticle: string): number {
    // Dans une application réelle, vous récupéreriez ces informations depuis une API ou une base de données
    const prix = {
      'MADO Article 1': 45.99,
      'MADO Article 2': 39.99,
      'GAMO Article 1': 52.50,
      'GAMO Article 2': 48.75
    };

    return prix[nomArticle] || 0;
  }
}