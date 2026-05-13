import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchedFilmsService } from '../../core/services/watched-films.service';

@Component({
  selector: 'app-watched-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watched-import.component.html',
  styleUrls: ['./watched-import.component.css']
})
export class WatchedImportComponent {
  feedbackMessage: string | null = null;
  isSuccess = false;

  constructor(public watchedService: WatchedFilmsService) {}

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      this.showFeedback('Format de fichier invalide. Veuillez utiliser un .csv', false);
      return;
    }

    try {
      const count = await this.watchedService.importFromCSV(file);
      this.showFeedback(`${count} films importés — ils ne seront plus proposés`, true);
    } catch (err) {
      this.showFeedback('Erreur lors de l\'importation du fichier.', false);
    }
    
    // On réinitialise l'input pour permettre de réimporter le même fichier
    event.target.value = '';
  }

  onReset() {
    this.watchedService.reset();
    this.showFeedback('Liste supprimée — tous les films peuvent à nouveau être proposés', true);
    this.watchedService.notifyRefresh();
  }

  onRefresh() {
    this.watchedService.notifyRefresh();
    this.showFeedback('Recommandations mises à jour !', true);
  }

  private showFeedback(message: string, success: boolean) {
    this.feedbackMessage = message;
    this.isSuccess = success;
    
    // Auto-hide après 5 secondes pour les succès
    if (success) {
      setTimeout(() => {
        this.feedbackMessage = null;
      }, 5000);
    }
  }
}
