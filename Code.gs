/**
 * BACKEND — Control Monotributo (multi-dispositivo)
 * ---------------------------------------------------------------
 * Pasos para dejarlo andando:
 * 1. Crear una planilla nueva en sheets.google.com (ej: "Monotributo - Datos").
 * 2. Extensiones → Apps Script. Borrar el código de ejemplo y pegar TODO este
 *    archivo.
 * 3. Guardar (ícono de disquete).
 * 4. Implementar → Nueva implementación.
 * 5. Tipo: "Aplicación web".
 * 6. "Ejecutar como": Yo (tu cuenta).
 * 7. "Quién tiene acceso": Cualquier usuario.
 * 8. Hacé clic en "Implementar". La primera vez te pide autorizar permisos:
 *    aceptá (es tu propia planilla, es seguro — solo esta hoja queda
 *    conectada, no el resto de tu cuenta).
 * 9. Copiá la URL que te da ("Web app URL", termina en /exec) y pegala en
 *    el archivo monotributo_clientes.html, en la constante API_URL
 *    (reemplazá 'PON_TU_URL_ACA').
 *
 * Si más adelante cambiás este código, hacé "Nueva implementación" de
 * nuevo (o Implementar → Administrar implementaciones → editar → nueva
 * versión) para que los cambios se reflejen en la URL ya publicada.
 */

const SHEET_NAME = 'KV';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['key', 'value']);
  }
  return sheet;
}

function doGet(e) {
  const key = e.parameter.key;
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return ContentService.createTextOutput(data[i][1])
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput('null')
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const key = body.key;
  const value = body.value; // ya viene como texto JSON (string)

  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) {
    sheet.appendRow([key, value]);
  } else {
    sheet.getRange(rowIndex, 2).setValue(value);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
