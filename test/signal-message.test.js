import test from "node:test";
import assert from "node:assert/strict";

import { LINK, build_signal_message, validarMensagemSinal } from "../bot.js";

test("mensagem do sinal contém termos obrigatórios e link afiliado", () => {
  const mensagem = build_signal_message("14:32", "2.15", LINK);

  assert.equal(validarMensagemSinal(mensagem, LINK), true);
  assert.match(mensagem, /AVIATOR/);
  assert.match(mensagem, /ENTRE PELO LINK OFICIAL/);
  assert.match(mensagem, new RegExp(LINK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
