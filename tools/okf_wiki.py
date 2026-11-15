"""Herramientas de la wiki en formato OKF (Open Knowledge Format) v0.2.

    python tools/okf_wiki.py index     # regenera los index.md de cada carpeta desde el frontmatter
    python tools/okf_wiki.py check     # verifica la conformidad con OKF v0.2 (§11) y reporta links rotos

Especificación: https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
Requiere PyYAML (pip install pyyaml).
"""
import re
import sys
from pathlib import Path

import yaml

WIKI = Path(__file__).resolve().parents[1] / "wiki"
OKF_VERSION = "0.2"
RESERVADOS = {"index.md", "log.md"}
LINK = re.compile(r"\]\((/[^)#\s]+\.md)(?:#[^)]*)?\)")
# Títulos de sección de cada carpeta en los index.md (el orden del dict es el orden en el índice raíz).
SECCIONES = {
    "proyecto": "Proyecto",
    "reto": "El reto de NASA Space Apps",
    "datos": "Datos",
    "datos/nasa": "Datos de NASA",
    "datos/socios": "Datos de agencias socias y globales",
    "datos/argentina": "Datos de Argentina",
    "modelo": "Modelo de rendimiento",
    "motor": "Motor de recomendación",
    "app": "Aplicación y despliegue",
    "pipeline": "Pipeline de datos",
    "glosario": "Glosario",
    "referencias": "Referencias y convenciones",
}


def frontmatter(path):
    """Devuelve (dict, cuerpo) o lanza ValueError si el bloque no es YAML válido."""
    texto = path.read_text(encoding="utf-8")
    if not texto.startswith("---\n"):
        raise ValueError("no empieza con un bloque de frontmatter '---'")
    fin = texto.find("\n---\n", 4)
    if fin < 0:
        raise ValueError("el frontmatter no tiene el '---' de cierre")
    datos = yaml.safe_load(texto[4:fin]) or {}
    if not isinstance(datos, dict):
        raise ValueError("el frontmatter no es un mapa YAML")
    return datos, texto[fin + 5:]


def conceptos(carpeta):
    return sorted(p for p in carpeta.glob("*.md") if p.name not in RESERVADOS)


def generar_indices():
    for carpeta in sorted([WIKI] + [d for d in WIKI.rglob("*") if d.is_dir()]):
        rel = carpeta.relative_to(WIKI).as_posix()
        subdirs = sorted(d for d in carpeta.iterdir() if d.is_dir())
        partes = []
        if carpeta == WIKI:
            partes.append(f'---\nokf_version: "{OKF_VERSION}"\n---\n')
            partes.append("# Field Shift — Wiki\n\nBase de conocimiento del proyecto en formato OKF v0.2: un concepto por archivo, "
                          "con frontmatter YAML. Empezá por [la visión](proyecto/vision.md) o por [el reto](reto/desafio-field-shift.md). "
                          "Historial de cambios en [log.md](log.md).\n")
        filas = []
        for p in conceptos(carpeta):
            fm, _ = frontmatter(p)
            filas.append(f"* [{fm.get('title', p.stem)}]({p.name}) - {fm.get('description', '')}".rstrip(" -"))
        if filas:
            partes.append(f"# {SECCIONES.get(rel, 'Conceptos') if rel != '.' else 'Conceptos'}\n\n" + "\n".join(filas) + "\n")
        if subdirs:
            orden = {k: i for i, k in enumerate(SECCIONES)}
            subdirs.sort(key=lambda d: orden.get(d.relative_to(WIKI).as_posix(), 999))
            items = []
            for d in subdirs:
                n = len(list(d.rglob("*.md"))) - len(list(d.rglob("index.md"))) - len(list(d.rglob("log.md")))
                items.append(f"* [{SECCIONES.get(d.relative_to(WIKI).as_posix(), d.name)}]({d.name}/) - {n} conceptos")
            partes.append("# Secciones\n\n" + "\n".join(items) + "\n")
        (carpeta / "index.md").write_text("\n".join(partes), encoding="utf-8")
    print("index.md regenerados")


def verificar():
    errores, avisos, n = [], [], 0
    for p in sorted(WIKI.rglob("*.md")):
        rel = p.relative_to(WIKI).as_posix()
        if p.name == "index.md":
            texto = p.read_text(encoding="utf-8")
            if texto.startswith("---") and p.parent != WIKI:
                errores.append(f"{rel}: solo el index.md raíz puede tener frontmatter (§8)")
            continue
        if p.name == "log.md":
            for h in re.findall(r"^## (.+)$", p.read_text(encoding="utf-8"), re.M):
                if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", h.strip()):
                    errores.append(f"{rel}: encabezado de fecha no ISO 8601: {h!r} (§9)")
            continue
        n += 1
        try:
            fm, cuerpo = frontmatter(p)
        except Exception as e:  # noqa: BLE001
            errores.append(f"{rel}: {e}")
            continue
        if not str(fm.get("type", "")).strip():
            errores.append(f"{rel}: falta 'type' (único campo obligatorio, §4.1)")
        gen = fm.get("generated")
        if gen is not None and not (isinstance(gen, dict) and gen.get("by")):
            errores.append(f"{rel}: 'generated' necesita 'by' (§5.2)")
        for s in fm.get("sources") or []:
            if not isinstance(s, dict) or not s.get("resource"):
                errores.append(f"{rel}: cada entrada de 'sources' necesita 'resource' (§5.1)")
        if fm.get("status") not in (None, "draft", "stable", "deprecated"):
            errores.append(f"{rel}: status inválido {fm.get('status')!r} (§5.4)")
        ids = {s.get("id") for s in fm.get("sources") or [] if isinstance(s, dict)}
        for nota in set(re.findall(r"\[\^([^\]]+)\]", cuerpo)):
            if nota not in ids:
                avisos.append(f"{rel}: la nota [^{nota}] no coincide con ningún sources[].id")
        for destino in LINK.findall(cuerpo):
            if not (WIKI / destino.lstrip("/")).exists():
                avisos.append(f"{rel}: link roto {destino} (permitido por §6.1, pero revisar)")
    print(f"{n} conceptos revisados · {len(errores)} errores · {len(avisos)} avisos")
    for e in errores:
        print("ERROR", e)
    for a in avisos:
        print("aviso", a)
    return 1 if errores else 0


if __name__ == "__main__":
    accion = sys.argv[1] if len(sys.argv) > 1 else "check"
    if accion == "index":
        generar_indices()
    elif accion == "check":
        sys.exit(verificar())
    else:
        sys.exit(__doc__)
