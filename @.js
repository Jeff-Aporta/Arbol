let ARBOLES_CARGADOS = {};

window["CONFIG"] = {};

function _protocolo_ruta_(ruta) {
  function limpiar_ruta(ruta) {
    return ruta.replace(/\/+/g, "/");
  }
  function randomizar_ruta(ruta) {
    if (window["CONFIG"]["anti-cache"]) {
      return `${ruta}?anti-cache=${Math.random()
        .toString()
        .replaceAll("0.", "")}  `;
    }
    return ruta;
  }
  return randomizar_ruta(limpiar_ruta(ruta));
}

window["@CONTEXT"] = (obj) => {
  Object.assign(window, obj);
};

window["@CONFIG"] = (CONFIG) => {
  window["@CONTEXT"]({
    CONFIG: CONFIG ?? {},
  });
};

window["@DOCUMENTAR"] = () => {
  let ks = Object.keys(ARBOLES_CARGADOS);
  ks.sort();
  swal.fire({
    html: `
    <div class="DOC">
      <h1>Documentación</h1>
      <br>
      ${ks.map((k) => {
        let v = ARBOLES_CARGADOS[k];
        return `
            <h1 class="DOC-titulo">
              ${(v["@"]["DOC"]?.titulo ?? "").replaceAll("#URL#", `${k}/@/`)}
            </h1>
            <h2 class="DOC-subtitulo">
              ${
                v["@"]["DOC"]?.subtitulo
                  ? Array.from(
                      { length: (v["@"]["DOC"]?.subnivel ?? 0) + 1 },
                      (v, k) => k
                    )
                      .map((v) => "&block;")
                      .join("")
                  : ""
              }
              ${(v["@"]["DOC"]?.subtitulo ?? "").replaceAll("#URL#", `${k}/@/`)}
            </h2>
            ${v["@"]["DOC"]?.titulo ? "<center>" : ""}
            
              <small>
                ${k}
              </small>
            ${v["@"]["DOC"]?.titulo ? "</center>" : ""}
            <br>
            <div class="DOC-desc"> 
              ${(v["@"]["DOC"]?.descripcion ?? "").replaceAll(
                "#URL#",
                `${k}/@/`
              )}
            </div>
          `;
      })}
    </div>
    `,
    width: "90%",
  });
};

Object.assign(window, {
  "@JS": async (nombre) => {
    let r = `${window["CONFIG"]["raiz"] ?? ""}${nombre}`;
    if (!nombre.endsWith(".js")) {
      r += ".js";
    }
    r = _protocolo_ruta_(r);
    let respuesta = await fetch(r);
    if (respuesta.status != 200) {
      return {
        msg: "el documento no se encontró: " + nombre,
      };
    }
    try {
      console.log(r);
      const js = (await import(r)).default;
      return (
        js ?? {
          msg: "el documento, estaba vacío",
        }
      );
    } catch (error) {}
    return {
      msg: "No se pudo obtener el documento",
    };
  },
  "@JSON": async (nombre) => {
    let r = `${window["CONFIG"]["raiz"] ?? ""}${nombre}`;
    if (!nombre.endsWith(".json")) {
      r += ".json";
    }
    r = _protocolo_ruta_(r);
    let respuesta = await fetch(r);
    if (respuesta.status != 200) {
      return {
        msg: "el documento no se encontró: " + nombre,
      };
    }
    try {
      console.log(r);
      return (
        (await import(_protocolo_ruta_(r), { assert: { type: "json" } }))
          .default ?? {
          msg: "el documento, estaba vacío",
        }
      );
    } catch (error) {
      return {
        msg: "No se pudo obtener el documento",
      };
    }
  },
  "@": async (ruta) => {
    //Carga los contextos del arbol de /@/INDEX.js
    if (typeof ruta == "object") {
      return;
    }
    if (ruta.endsWith(".json")) {
      return await window["@JSON"](ruta);
    }
    if (ruta.endsWith(".js")) {
      return await window["@JS"](ruta);
    }
    return {
      msg: "No se identificó la extensión del archivo.",
    };
  },
  "@ARBOL": async (ruta) => {
    let CONFIG = {};
    let DOC = {};
    let retorno = {};

    let INDEX = await window["@JS"](`${ruta}/@/INDEX.js`);
    for (const k in INDEX) {
      if (k == "NODOS") {
        continue;
      }
      INDEX[k] = await window["@"](`${ruta}/@/${k}.${INDEX[k]}`);
    }

    await sistema_de_carga();

    Object.assign(CONFIG, INDEX["CONFIG"]);
    Object.assign(DOC, INDEX["DOC"]);
    Object.assign(retorno, {
      "@": {
        CONFIG,
        DOC,
      },
    });

    ARBOLES_CARGADOS[ruta] = retorno;

    return retorno;

    async function sistema_de_carga() {
      for (const hijo of INDEX["NODOS"]) {
        if (hijo.startsWith("@")) {
          await interpretar("@ARBOL", hijo);
        } else {
          await interpretar("@JS", hijo);
        }
      }

      async function interpretar(A, e) {
        const js = await window[A](`${ruta}/${e}`);
        if (e.endsWith("!")) {
          //No contextualizar, sólo ejecutar
          return;
        } else if (e.endsWith("_")) {
          //Contexto interno
          Object.assign(retorno, js);
        } else {
          //Contexto agrupado
          retorno[e.replace("@", "")] = js;
        }
      }
    }
  },
});
