import test from "node:test";
import assert from "node:assert/strict";

import { LINK, montarMensagemSinal, validarMensagemSinal } from "../bot.js";

test("mensagem do sinal contém termos obrigatórios e link afiliado", () => {
  const mensagem = montarMensagemSinal({
    entrada: "14:32",
    saque: "2.15",
    link: LINK,
  });

  assert.equal(validarMensagemSinal(mensagem, LINK), true);
  assert.match(mensagem, /AVIATOR/);
  assert.match(mensagem, /ENTRE PELO LINK OFICIAL/);
  assert.match(mensagem, new RegExp(LINK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
