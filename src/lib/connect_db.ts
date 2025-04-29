import { PrismaClient } from '@prisma/client';

// Déclarer la variable globale en utilisant "var" et en autorisant "undefined"
declare global {
  var prisma: PrismaClient;
}

// Utiliser l'opérateur "||" pour réutiliser l'instance globale en développement ou en créer une nouvelle
const prisma = global.prisma || new PrismaClient();

// En environnement de développement, on sauvegarde l'instance dans l'objet global pour éviter de multiples instanciations
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
