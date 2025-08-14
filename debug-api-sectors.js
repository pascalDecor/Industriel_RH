// Script de diagnostic pour l'erreur 500 sur /api/sectors/[id]

const { PrismaClient } = require('@prisma/client');

async function diagnosticSectorsAPI() {
    const prisma = new PrismaClient();
    
    console.log('🔍 Diagnostic de l\'API /api/sectors/[id]');
    console.log('=====================================\n');
    
    try {
        // 1. Tester la connexion à la base de données
        console.log('1. Test connexion base de données...');
        await prisma.$connect();
        console.log('✅ Connexion DB réussie\n');
        
        // 2. Vérifier qu'il y a des secteurs
        console.log('2. Vérification des secteurs...');
        const sectorCount = await prisma.sector.count();
        console.log(`📊 Nombre de secteurs: ${sectorCount}`);
        
        if (sectorCount === 0) {
            console.log('⚠️  PROBLÈME: Aucun secteur en base de données\n');
            return;
        }
        
        // 3. Récupérer un secteur de test
        console.log('\n3. Test avec un secteur existant...');
        const firstSector = await prisma.sector.findFirst({
            select: { id: true, libelle: true }
        });
        
        if (!firstSector) {
            console.log('❌ Aucun secteur trouvé\n');
            return;
        }
        
        console.log(`📋 Secteur de test: ${firstSector.libelle} (ID: ${firstSector.id})`);
        
        // 4. Tester la requête exacte de l'API
        console.log('\n4. Test de la requête complète...');
        const testSector = await prisma.sector.findUnique({
            where: { id: firstSector.id },
            select: {
                id: true,
                libelle: true,
                description: true,
                alternativeDescriptions: true,
                createdAt: true,
                updatedAt: true,
                // Compter les relations
                _count: {
                    select: { 
                        functions: true,
                        candidats: true,
                        hires: true,
                        Sections: true 
                    },
                },
                // Sections avec images et descriptions complètes
                Sections: {
                    select: {
                        id: true,
                        libelle: true,
                        slug: true,
                        description: true,
                        image: true,
                        page: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'asc' }
                },
                // Fonctions avec détails
                functions: {
                    select: {
                        id: true,
                        libelle: true,
                        createdAt: true,
                        _count: {
                            select: {
                                candidats: true,
                                hires: true
                            }
                        }
                    },
                    orderBy: { libelle: 'asc' }
                }
            },
        });
        
        if (!testSector) {
            console.log('❌ Erreur lors de la récupération du secteur');
            return;
        }
        
        console.log('✅ Requête réussie !');
        console.log(`📊 Fonctions: ${testSector._count.functions}`);
        console.log(`📊 Candidats: ${testSector._count.candidats}`);  
        console.log(`📊 Embauches: ${testSector._count.hires}`);
        console.log(`📊 Sections: ${testSector._count.Sections}`);
        
        // 5. Tester l'enrichissement des données
        console.log('\n5. Test enrichissement des données...');
        const enrichedSector = {
            ...testSector,
            mainImage: testSector.Sections[0]?.image || '/images/default-sector.jpg',
            fullDescription: testSector.description,
            alternativeDescriptions: testSector.alternativeDescriptions,
            stats: {
                totalFunctions: testSector._count.functions,
                totalCandidates: testSector._count.candidats,
                totalHires: testSector._count.hires,
                totalSections: testSector._count.Sections
            }
        };
        
        console.log('✅ Enrichissement réussi !');
        console.log(`🖼️  Image principale: ${enrichedSector.mainImage}`);
        
        // 6. Rechercher des problèmes potentiels
        console.log('\n6. Recherche de problèmes potentiels...');
        
        // Vérifier les relations manquantes
        const sectorsWithBrokenRelations = await prisma.sector.findMany({
            where: {
                OR: [
                    { functions: { none: {} } },
                    { Sections: { none: {} } }
                ]
            },
            select: { id: true, libelle: true }
        });
        
        if (sectorsWithBrokenRelations.length > 0) {
            console.log('⚠️  Secteurs sans fonctions ou sections:');
            sectorsWithBrokenRelations.forEach(s => 
                console.log(`   - ${s.libelle} (${s.id})`)
            );
        } else {
            console.log('✅ Toutes les relations semblent correctes');
        }
        
        console.log('\n🎉 Diagnostic terminé - L\'API devrait fonctionner correctement');
        
    } catch (error) {
        console.error('❌ ERREUR DÉTECTÉE:');
        console.error('===================');
        console.error('Type:', error.constructor.name);
        console.error('Message:', error.message);
        
        if (error.code) {
            console.error('Code:', error.code);
        }
        
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        
        // Suggestions en fonction du type d'erreur
        console.log('\n💡 SUGGESTIONS DE CORRECTION:');
        console.log('=============================');
        
        if (error.message.includes('connect')) {
            console.log('- Vérifier la chaîne de connexion DATABASE_URL');
            console.log('- S\'assurer que la base de données est démarrée');
            console.log('- Vérifier les permissions de connexion');
        }
        
        if (error.message.includes('relation')) {
            console.log('- Exécuter: npx prisma db push');
            console.log('- Vérifier que le schéma Prisma est à jour');
            console.log('- Régénérer le client: npx prisma generate');
        }
        
        if (error.message.includes('Unknown column')) {
            console.log('- Une colonne référencée n\'existe pas en base');
            console.log('- Vérifier la migration de la base de données');
        }
        
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Connexion fermée');
    }
}

// Exécuter le diagnostic
diagnosticSectorsAPI().catch(console.error);