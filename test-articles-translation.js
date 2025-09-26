// Script de test pour créer des articles avec traductions
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestArticles() {
  console.log('🔄 Création d\'articles de test avec traductions...')
  
  try {
    // Récupérer un utilisateur admin pour l'auteur
    const admin = await prisma.user.findFirst({
      where: { 
        userRoles: {
          some: { role: 'SUPER_ADMIN' }
        }
      }
    })
    
    if (!admin) {
      console.log('❌ Aucun admin trouvé. Créez d\'abord un utilisateur admin.')
      return
    }
    
    // Article de test 1
    const article1 = await prisma.article.create({
      data: {
        titre: 'Tendances du recrutement industriel au Québec',
        titre_en: 'Industrial Recruitment Trends in Quebec',
        contenu: [{
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Le secteur industriel québécois connaît une transformation majeure. Découvrez les dernières tendances en matière de recrutement et les compétences les plus recherchées.'
              }
            }
          ]
        }],
        contenu_en: [{
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Quebec\'s industrial sector is undergoing a major transformation. Discover the latest recruitment trends and the most sought-after skills.'
              }
            }
          ]
        }],
        published: true,
        image: '/images/ir_blog.png',
        authorId: admin.id
      }
    })
    
    // Article de test 2
    const article2 = await prisma.article.create({
      data: {
        titre: 'Guide des salaires dans la construction',
        titre_en: 'Construction Salary Guide',
        contenu: [{
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Tout ce que vous devez savoir sur les salaires dans le secteur de la construction au Québec en 2025.'
              }
            }
          ]
        }],
        contenu_en: [{
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Everything you need to know about construction sector salaries in Quebec for 2025.'
              }
            }
          ]
        }],
        published: true,
        image: '/images/sectors/construction.png',
        authorId: admin.id
      }
    })
    
    console.log(`✅ Articles créés:`)
    console.log(`   - ${article1.titre} (ID: ${article1.id})`)
    console.log(`   - ${article2.titre} (ID: ${article2.id})`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des articles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestArticles()