import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { marked } from 'marked'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//import de l'api gemini
import { GoogleGenerativeAI } from '@google/generative-ai'
//import emailJS
import emailjs, { send } from 'emailjs-com';
import { response } from 'express';

@Component({
  selector: 'app-chat-assistant',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './chat-assistant.component.html',
  styleUrl: './chat-assistant.component.css'
})
export class ChatAssistantComponent {

  userInput: string = '';
  messages: { text: string, from: 'user' | 'bot' }[] = [];

  apiKey: string = 'AIzaSyDBphs9gi7vUDoMZdYMHXCiFxY7Sb8KaRc';

  @ViewChild('chatBox') chatBox!: ElementRef;

  async envoyerMessage() {
    if (!this.userInput.trim()) return;

    // Ajoute le message utilisateur
    this.messages.push({ text: this.userInput, from: 'user' });

    const question = this.userInput;
    this.userInput = '';

    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: `Tu est un agent commerciale de l'entreprise SAINTO \nL'entreprise est siégé à Ampasampito qui vend principalement des eau minérale : SAINTO 1.5L qui coute 2 750 Ar HT; SAINTO 1L qui coute 1 666 Ar HT; SAINTO 5L qui coute 5000 Ar ;SAINTO 0.5L qui coute 1 416 Ar HT; Bonbone 1er Livraison 88 000 Ar HT; Bonbone recharge qui coute 36 166 Ar HT, mais aussi des ICE TEA dont il y a plusieurs parfum tels que Pêche, Pomme, Citron qui à aussi différent taille de bouteils ,, ICE TEA 1.5L qui coute 8 166 Ar HT,; ICE TEA 0.5L qui coute 3 500 Ar HT \nUn pack de bouteille 1.5L,1L est 6 bouteilles,\nUn pack de bouteilles 0.5L est 8 bouteilles \nSAINTO ne livre que des packs , pour les livraisons on accepte que des pack et non pas de bouteille, si un client veut acheter un quantité de bouteilles inferieure à 6 si 1.5l et 8 si inferieure à 0.5l\nSi une personne te demande de commander un article chez nous tu luis demande son Nom complet, son numero, addrèsse mail et addrèsse physique ou la livraison se fera 48h après 
   \n\n`,
   
    });

    try {
      
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = await response.text();
      
      // Ajoute la réponse de l'IA
      this.messages.push({ text, from: 'bot' });

      //si l'IA detecte l'intention de commander
      console.log(text);
      if(this.contientUneCommande(text)){
        this.envoyerCommande("RSAINTO 1.5L",2,"Tsilavina","tsilavina484@gmail.com","Antananarivo","0349688396");
      }

      // Scroll automatique en bas
      setTimeout(() => {
        if (this.chatBox?.nativeElement) {
          this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
        }
      }, 100);
    } catch (err) {
      this.messages.push({ text: "Erreur lors de la réponse de l'assistant.", from: 'bot' });
      console.error(err);
    }
  }

  //detecte si le client a l'intention de comande run article
  private contientUneCommande(message: string): boolean {
    const motsCles = ['commande', 'commander', 'je veux', 'acheter', 'achat'];
    const messageMin = message.toLowerCase();
    return motsCles.some(motCle => messageMin.includes(motCle));
  }




  envoyerCommande(nom_article: string, nb_article: number, nom_client: string, email_client: string, adresse_client: string, numero_tel_client: string) {
    const templateParams = {
      to: 'tsilavina484@gmail.com',
      subject: 'Nouvelle commande',
      message: `Nouvelle commande :\nNom article : ${nom_article}\nQuantité : ${nb_article}\nClient : ${nom_client}\nEmail : ${email_client}\nTéléphone : ${numero_tel_client}\nAdresse : ${adresse_client}`
    };

    const serviceID = 'service_pphy19i';
    const templateID = 'template_67lb80k';
    const publicKey = 'DErRj_-naJrrIfgqn';

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        alert('Commande envoyée par email ✅');
      }, (error) => {
        alert('Erreur lors de l’envoi de l’email ❌ : ' + JSON.stringify(error));
      });
  }


  private isCommandeJson(text: string): boolean {
    try {
      const parsed = JSON.parse(text);
      return parsed && parsed.intention === 'commander';
    } catch {
      return false;
    }
  }


}


  // sendEmail() {

  //   const templateParams = {
  //     to: 'tsilavina484@gmail.com',
  //     subject: '',
  //     message: "Nouvelle commande"
  //   };

  //   const serviceID = 'service_pphy19i';
  //   const templateID = 'template_67lb80k';
  //   const publicKey = 'DErRj_-naJrrIfgqn'; // Ex: 'aBcD1234...'

  //   emailjs.send(serviceID, templateID, templateParams, publicKey)
  //     .then(() => {
  //       alert('Email envoyé avec succès ✅');
  //     }, (error) => {
  //       alert('Erreur ❌ : ' + JSON.stringify(error));
  //     });
  // }


    // userInput: string = '';
  // messages: { from: 'user' | 'bot', text: string }[] = [];
  // apiKey: string = 'AIzaSyDBphs9gi7vUDoMZdYMHXCiFxY7Sb8KaRc';
  // aiResponse : string = '';

  // @ViewChild('chatBox') chatBox!: ElementRef;

  // constructor(private http: HttpClient) { }

  // //evoie du message
  // async envoyerMessage(){
  //   //initialisation de l'API Gemini
  //   const genAI = new GoogleGenerativeAI(this.apiKey);
  //   const model = genAI.getGenerativeModel({model: 'gemini-1.5-pro'});

  //   try{
  //     const result = await model.generateContent(this.userInput);
  //     const response = await result.response;
  //     const text = await response.text();
  //     this.aiResponse = text
  //   }catch(err){
  //     this.aiResponse = 'Erreur: ' + err;
  //   }
  // }