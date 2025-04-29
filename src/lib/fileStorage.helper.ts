// const multer = require('multer');

// const path = require('path');

// const fs = require('fs').promises;


// // Configurez Multer pour stocker les images dans le dossier 'uploads'
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../public/uploads/images');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });


// exports.storeImage = async (uploadedFile, req, res, storagePath) => {
//   const imagePath = path.join(storagePath + Date.now().toString() + uploadedFile.name.replace(/\s/g, ''));
//   const host = req.get('host');
//   console.log(imagePath);

//   // Assurez-vous que uploadedFile est défini
//   if (!uploadedFile) {
//     return res.status(400).send("Aucun fichier n'a été téléchargé.");
//   }
//   try {
//     // Déplacez le fichier vers le chemin de stockage
//     await uploadedFile.mv(imagePath);
//     console.log('Fichier téléchargé avec succès !');
//     return host + '/' + imagePath;
//   } catch (error) {
//     console.error('Erreur lors du téléchargement du fichier:', error);
//     return res.status(500).send("Erreur lors du téléchargement du fichier.");
//   }
// }


// exports.makeDirectory = (cheminDossier: unknown) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Check if the directory exists
//       await fs.stat(cheminDossier);
//       console.log('Le dossier existe déjà.');
//       resolve(cheminDossier);
//     } catch (err) {
//       // Directory does not exist, create it
//       try {
//         await fs.mkdir(cheminDossier, { recursive: true });
//         console.log('Dossier créé avec succès !');
//         resolve(cheminDossier);
//       } catch (mkdirError) {
//         console.error('Erreur lors de la création du dossier :', mkdirError);
//         reject(mkdirError);
//       }
//     }
//   });
// }