/**
 * Lá Na Cabaninha — API da planilha (Google Apps Script)
 *
 * Como publicar:
 * 1. Na planilha, vá em Extensões → Apps Script
 * 2. Apague o conteúdo padrão e cole este arquivo inteiro
 * 3. Clique em Implantar → Nova implantação
 * 4. Tipo: "App da Web"
 * 5. Executar como: "Eu" (sua conta)
 * 6. Quem pode acessar: "Qualquer pessoa"
 * 7. Implantar → copie a URL gerada (termina em /exec) e me envie
 *
 * Sempre que editar este código, é preciso criar uma NOVA implantação
 * (ou "Gerenciar implantações" → editar → nova versão) pra publicar a
 * mudança — só salvar o arquivo não atualiza a URL já publicada.
 */

var ABAS_DE_DADOS = ["Eventos", "Financeiro", "Fornecedores", "Estoque"];

function doGet(e) {
  try {
    var nomeAba = e.parameter.sheet;
    if (ABAS_DE_DADOS.indexOf(nomeAba) === -1) {
      return jsonOutput_({ erro: "Aba inválida: " + nomeAba });
    }
    var aba = getAba_(nomeAba);
    return jsonOutput_(abaParaObjetos_(aba, nomeAba));
  } catch (err) {
    return jsonOutput_({ erro: String(err) });
  }
}

function doPost(e) {
  try {
    var corpo = JSON.parse(e.postData.contents);
    var action = corpo.action;
    var nomeAba = corpo.sheet;
    var id = corpo.id;
    var data = corpo.data;

    if (action === "login") {
      return jsonOutput_(fazerLogin_(data.email, data.senha));
    }

    if (ABAS_DE_DADOS.indexOf(nomeAba) === -1) {
      return jsonOutput_({ erro: "Aba inválida: " + nomeAba });
    }
    var aba = getAba_(nomeAba);

    if (action === "insert") {
      inserirLinha_(aba, nomeAba, data);
      return jsonOutput_({ ok: true });
    }
    if (action === "update") {
      atualizarLinha_(aba, nomeAba, id, data);
      return jsonOutput_({ ok: true });
    }
    if (action === "delete") {
      excluirLinha_(aba, id);
      return jsonOutput_({ ok: true });
    }

    return jsonOutput_({ erro: "Ação inválida: " + action });
  } catch (err) {
    return jsonOutput_({ erro: String(err) });
  }
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getAba_(nome) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(nome);
  if (!aba) throw new Error("Aba não encontrada: " + nome);
  return aba;
}

function cabecalhos_(aba) {
  var ultimaColuna = aba.getLastColumn();
  return aba.getRange(1, 1, 1, ultimaColuna).getValues()[0];
}

function abaParaObjetos_(aba, nomeAba) {
  var ultimaLinha = aba.getLastRow();
  if (ultimaLinha < 2) return [];
  var headers = cabecalhos_(aba);
  var linhas = aba.getRange(2, 1, ultimaLinha - 1, headers.length).getValues();
  var resultado = [];
  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];
    var vazia = linha.every(function (valor) {
      return valor === "" || valor === null;
    });
    if (!vazia) resultado.push(linhaParaObjeto_(headers, linha, nomeAba));
  }
  return resultado;
}

function linhaParaObjeto_(headers, linha, nomeAba) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    var coluna = headers[i];
    var valor = linha[i];

    if (nomeAba === "Eventos" && coluna === "checklist") {
      try {
        obj[coluna] = valor ? JSON.parse(valor) : [];
      } catch (err) {
        obj[coluna] = [];
      }
      continue;
    }

    if (Object.prototype.toString.call(valor) === "[object Date]") {
      valor = Utilities.formatDate(valor, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }

    if (typeof valor === "boolean") {
      obj[coluna] = valor;
      continue;
    }

    if (valor === "" || valor === null) {
      obj[coluna] = undefined;
      continue;
    }

    obj[coluna] = valor;
  }
  return obj;
}

function objetoParaLinha_(headers, obj, nomeAba) {
  return headers.map(function (coluna) {
    var valor = obj[coluna];
    if (nomeAba === "Eventos" && coluna === "checklist") {
      return JSON.stringify(valor || []);
    }
    if (valor === undefined || valor === null) return "";
    return valor;
  });
}

function inserirLinha_(aba, nomeAba, data) {
  var headers = cabecalhos_(aba);
  aba.appendRow(objetoParaLinha_(headers, data, nomeAba));
}

function encontrarLinhaPorId_(aba, id) {
  var ultimaLinha = aba.getLastRow();
  if (ultimaLinha < 2) return -1;
  var idsColuna = aba.getRange(2, 1, ultimaLinha - 1, 1).getValues();
  for (var i = 0; i < idsColuna.length; i++) {
    if (String(idsColuna[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function atualizarLinha_(aba, nomeAba, id, data) {
  var numeroLinha = encontrarLinhaPorId_(aba, id);
  if (numeroLinha === -1) throw new Error("Registro não encontrado: " + id);
  var headers = cabecalhos_(aba);
  var linhaAtual = aba.getRange(numeroLinha, 1, 1, headers.length).getValues()[0];
  var objAtual = linhaParaObjeto_(headers, linhaAtual, nomeAba);
  var objMesclado = Object.assign({}, objAtual, data, { id: id });
  var novaLinha = objetoParaLinha_(headers, objMesclado, nomeAba);
  aba.getRange(numeroLinha, 1, 1, headers.length).setValues([novaLinha]);
}

function excluirLinha_(aba, id) {
  var numeroLinha = encontrarLinhaPorId_(aba, id);
  if (numeroLinha === -1) return;
  aba.deleteRow(numeroLinha);
}

function fazerLogin_(email, senha) {
  var aba = getAba_("Usuarios");
  var ultimaLinha = aba.getLastRow();
  if (ultimaLinha < 2) return { ok: false };
  var dados = aba.getRange(2, 1, ultimaLinha - 1, 3).getValues();
  for (var i = 0; i < dados.length; i++) {
    var emailLinha = dados[i][0];
    var senhaLinha = dados[i][1];
    var role = dados[i][2];
    if (
      String(emailLinha).trim().toLowerCase() === String(email || "").trim().toLowerCase() &&
      String(senhaLinha) === String(senha || "")
    ) {
      return { ok: true, role: role };
    }
  }
  return { ok: false };
}
