/**
 * WebDev 11-11 — Google Apps Script API
 *
 * Configure BRIDGE_SECRET in Apps Script > Project Settings > Script Properties.
 * Deploy as a Web App executing as the deploying user.
 */

function doGet() {
  return json_({ ok: true, service: "webdev-11-11-sheets-api", version: 1 });
}

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var expected = PropertiesService.getScriptProperties().getProperty("BRIDGE_SECRET");

    if (!expected || !payload.bridgeSecret || !constantTimeEquals_(String(payload.bridgeSecret), expected)) {
      return json_({ ok: false, error: "Unauthorized" });
    }

    var result = dispatch_(payload);
    return json_({ ok: true, result: result });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function dispatch_(p) {
  switch (p.action) {
    case "createSpreadsheet":
      return createSpreadsheet_(p);
    case "listSheets":
      return listSheets_(p);
    case "readRange":
      return readRange_(p);
    case "appendRows":
      return appendRows_(p);
    case "updateRange":
      return updateRange_(p);
    default:
      throw new Error("Unsupported action");
  }
}

function createSpreadsheet_(p) {
  var title = String(p.title || "Nova planilha — WebDev 11-11").trim().slice(0, 150);
  if (!title) throw new Error("Informe o título da planilha");
  var ss = SpreadsheetApp.create(title);
  return { spreadsheetId: ss.getId(), title: ss.getName(), url: ss.getUrl(), sheets: ss.getSheets().map(function(s) { return s.getName(); }) };
}

function openSpreadsheet_(id) {
  if (!id || typeof id !== "string") throw new Error("Informe spreadsheetId");
  return SpreadsheetApp.openById(id);
}

function getSheet_(ss, name) {
  var sheet = name ? ss.getSheetByName(name) : ss.getSheets()[0];
  if (!sheet) throw new Error("A aba informada não foi encontrada");
  return sheet;
}

function listSheets_(p) {
  var ss = openSpreadsheet_(p.spreadsheetId);
  return { spreadsheetId: ss.getId(), title: ss.getName(), sheets: ss.getSheets().map(function(s) { return { name: s.getName(), rows: s.getLastRow(), columns: s.getLastColumn() }; }) };
}

function readRange_(p) {
  var ss = openSpreadsheet_(p.spreadsheetId);
  var sheet = getSheet_(ss, p.sheetName);
  var rangeA1 = String(p.range || "A1:Z50");
  var values = sheet.getRange(rangeA1).getDisplayValues();
  return { spreadsheetId: ss.getId(), sheetName: sheet.getName(), range: rangeA1, values: values };
}

function appendRows_(p) {
  var ss = openSpreadsheet_(p.spreadsheetId);
  var sheet = getSheet_(ss, p.sheetName);
  var values = validateValues_(p.values);
  if (!values.length) throw new Error("values não pode estar vazio");
  var width = values[0].length;
  if (values.some(function(row) { return row.length !== width; })) throw new Error("Todas as linhas devem ter o mesmo número de colunas");
  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, values.length, width).setValues(values);
  return { spreadsheetId: ss.getId(), sheetName: sheet.getName(), rowsAdded: values.length, startRow: startRow };
}

function updateRange_(p) {
  var ss = openSpreadsheet_(p.spreadsheetId);
  var sheet = getSheet_(ss, p.sheetName);
  var rangeA1 = String(p.range || "");
  if (!rangeA1) throw new Error("Informe o intervalo A1 em range");
  var values = validateValues_(p.values);
  if (!values.length) throw new Error("values não pode estar vazio");
  var range = sheet.getRange(rangeA1);
  if (range.getNumRows() !== values.length || range.getNumColumns() !== values[0].length) {
    throw new Error("O tamanho de values deve corresponder exatamente ao intervalo informado");
  }
  range.setValues(values);
  return { spreadsheetId: ss.getId(), sheetName: sheet.getName(), range: rangeA1, rowsUpdated: values.length };
}

function validateValues_(values) {
  if (!Array.isArray(values) || !values.length || !Array.isArray(values[0])) throw new Error("values deve ser uma matriz de linhas");
  if (values.length > 500 || values[0].length > 30) throw new Error("Limite: 500 linhas e 30 colunas por operação");
  return values.map(function(row) {
    if (!Array.isArray(row) || row.length !== values[0].length) throw new Error("Matriz irregular");
    return row.map(function(value) {
      if (value === null || ["string", "number", "boolean"].indexOf(typeof value) >= 0) return value;
      throw new Error("Use apenas texto, números, booleanos ou null nas células");
    });
  });
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
