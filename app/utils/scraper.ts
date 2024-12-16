import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapWebsite(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Récupérer le contenu pertinent
    const content = {
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content') || '',
      mainContent: $('main').text().trim(),
      // Ajoutez d'autres sélecteurs selon la structure du site
      products: $('.product').map((_, el) => ({
        name: $(el).find('.product-name').text(),
        description: $(el).find('.product-description').text(),
      })).get(),
    };

    return content;
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    throw error;
  }
} 