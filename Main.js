function procesarFacturas() {
  var labelName = "Gestionada"; // Cambia el nombre de la etiqueta según tus preferencias
  var threads = GmailApp.search("label:inbox has:attachment -label:" + labelName);
  var folderId = "1I4kYZX1lTROZCDz3B2gIBFirEHcBAjvu"; // Reemplaza "your_folder_id_here" con el ID de la carpeta

  // Inicia un registro
  var log = Logger.log('Procesando facturas...');

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();

    // Muestra número de correos
    log.log('Hilo ' + (i + 1) + ': ' + thread.getFirstMessageSubject());
    
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var attachments = message.getAttachments();

      // Muestra número de correos
      log.log('  Correo ' + (j + 1) + ': ' + message.getSubject());
      
      // Verifica si el correo ya tiene la etiqueta llamada "Gestionada"
      var hasGestionadaLabel = thread.getLabels().some(function (label) {
        return label.getName() === labelName;
      });

      if (!hasGestionadaLabel) {
        // Obtiene el asunto del correo
        var subject = message.getSubject();
        log.log('    Asunto: ' + subject);

        for (var k = 0; k < attachments.length; k++) {
          var attachment = attachments[k];

          // Obtiene el nombre original del archivo y elimina los espacios
          var originalFileName = attachment.getName().replace(/\s/g, '');

          // Muestra el nombre original
          log.log('    Nombre archivo:' + originalFileName);

          // Genera una fecha en formato YYYYMMDD
          var date = Utilities.formatDate(message.getDate(), Session.getScriptTimeZone(), "yyyyMMdd");

          // Combina el nombre original y la fecha para el nombre del archivo
          var fileName = date + "_" + originalFileName;

          // Guarda el PDF en la carpeta "1 - Pendiente" por su ID
          var folder = DriveApp.getFolderById(folderId);
          var file = folder.createFile(attachment.copyBlob());
          file.setName(fileName);

          // Registra el nombre del adjunto en el log
          log.log('    Archivo descargado - ' + fileName);
        }

        // Marca el mensaje como leído
        message.markRead();

        // Agrega la etiqueta "Gestionada" al hilo
        thread.addLabel(GmailApp.getUserLabelByName(labelName));

        // Mueve el hilo a la carpeta de archivado
        thread.moveToArchive();

        
        log.log('    Correo gestionado y marcado como leído.');
      } else {
        log.log('    Correo ya gestionado anteriormente.');
      }
    }
  }

  // Registra un mensaje de finalización
  log.log('Procesamiento de facturas completado.');

  // Muestra el registro
  console.log(log.getLog());
}