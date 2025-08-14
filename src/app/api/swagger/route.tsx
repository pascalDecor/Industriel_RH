import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { apiBaseWithoutProtocol } from '@/constant/api';

export async function GET() {
  try {
    // Lecture du fichier swagger.json depuis la racine du projet
    const swaggerPath = join(process.cwd(), 'swagger.json');
    const swaggerSpec = readFileSync(swaggerPath, 'utf8');
    const swaggerJson = JSON.parse(swaggerSpec);

    // Mise à jour dynamique de l'URL du serveur basé sur l'environnement
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || apiBaseWithoutProtocol;
    
    swaggerJson.servers = [
      {
        url: `${protocol}://${host}/api`,
        description: process.env.NODE_ENV === 'production' ? 'Serveur de production' : 'Serveur de développement'
      }
    ];

    return NextResponse.json(swaggerJson, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache pendant 1 heure
      },
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier swagger.json:', error);
    return NextResponse.json(
      { 
        error: 'Impossible de charger la spécification Swagger',
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}