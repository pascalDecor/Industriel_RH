async function createCities(prisma: any) {
  console.log("🔹 seed cities...");
  const country = await prisma.country.findFirst({
    where: { libelle: "Canada" }
  });
  if (!country) {
    console.log("⚠️ Canada non trouvé. Exécutez d'abord le seed des pays (createCountries).");
    return;
  }
  const noms = [
    "Alma",
    "Amos",
    "Amqui",
    "Québec",
    "Saguenay",
    "Sherbrooke",
    "Trois-Rivières",
    "Baie-Comeau",
    "Baie-Saint-Paul",
    "Basse-Terre",
    "Beaupré",
    "Bellechasse",
    "Berthierville",
    "Blainville",
    "Boisbriand",
    "Boucherville",
    "Bourassa",
    "Bourget",
    "Brossard",
    "Chambly",
    "Champigny",
    "Chandler",
    "Charleville",
    "Château-Richer",
    "Château-Richer-Est",
    "Château-Richer-Ouest",
    "Château-Richer-Sud",
    "Châteauneuf-du-Pape",
    "Châtillon",
    "Chertsey",
    "Clarence-Rockland",
    "Coaticook",
    "Côte-Saint-Luc",
    "Côte-Saint-Luc-Est",
    "Côte-Saint-Luc-Ouest",
    "Côte-Saint-Luc-Sud",
    "Côte-Saint-Luc-Sud-Est",
    "Côte-Saint-Luc-Sud-Ouest",
    "Cowansville",
    "Cramaheu",
    "Croche",
    "D'Arcy-le-Fortin",
    "Deux-Montagnes",
    "Dorval",
    "Drummondville",
    "Duhamel",
    "Dunham",
    "Émard",
    "Épinal",
    "Étampes",
    "Étaples",
    "Évreux",
    "Évry",
    "Eysines",
    "Fécamp",
    "Fécamp-Nord",
    "Fère-Champenoise",
    "Flers",
    "Fontenay-le-Comte",
    "Fos-sur-Mer",
    "Gap",
    "Granville",
    "Grenoble",
    "Haguenau",
    "Ham",
    "Hambourg",
    "Hamm",
    "Hanoï",
    "Harfleur",
    "Haubourdin",
    "Havre",
    "Herblay",
    "Hérouville-Saint-Clair",
    "Hérouville-Saint-Clair-Sud",
    "Hull",
    "Illkirch-Graffenstaden",
    "Ingwiller",
    "Isigny-sur-Mer",
    "Ivry",
    "Izegem",
    "Jargeau",
    "Juvisy-sur-Orge",
    "Laon",
    "Lausanne",
    "Lavaux-Oron",
    "Le Havre",
    "Le Mans",
    "Le Tréport",
    "Les Moulins",
    "Les Éboulements",
    "Liège",
    "Longueuil",
    "Luxembourg",
    "Maisonnette",
    "Manseau",
    "Marly",
    "Mascouche",
    "Maubeuge",
    "Mazamet",
    "Métis-sur-Mer",
    "Mirabel"
  ];

  for (const libelle of noms) {
    const sp = await prisma.city.findFirst({
      where: { libelle: libelle }
    });
    if (!sp) {
      await prisma.city.create({
        data: {
          libelle: libelle,
          countryId: country.id
        }
      });
    }
  }
}

module.exports = createCities;
export default createCities;
