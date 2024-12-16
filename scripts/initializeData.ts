import { scrapWebsite } from '../app/utils/scraper';
import { processDocuments } from '../app/utils/documentProcessor';

async function initialize() {
  try {
    const content = await scrapWebsite('https://kofcorporation.com');
    await processDocuments(content);
    console.log('Données initialisées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

initialize(); 