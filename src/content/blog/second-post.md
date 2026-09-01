---
title: 'Second post'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 15 2022'
articleType: 'guides'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

Mi ordenador ideal no llama la atención. No quiero un escritorio espectacular, ni una automatización barroca, ni cincuenta aplicaciones abiertas "por si acaso". Quiero un sistema que desaparezca. Que responda rápido, que sea predecible y que me deje pensar en lo que estoy haciendo: editar, escribir, programar, buscar algo o escuchar música.

Uso macOS como sistema principal. No porque sea perfecto, sino porque en Apple Silicon me da una mezcla muy difícil de igualar: silencio, batería, rendimiento sostenido y un ecosistema de aplicaciones creativas que todavía me compensa. Linux sigue estando muy presente en mi servidor y en mi manera de pensar la informática, pero en el portátil quiero una máquina que no dé guerra.

Mi forma de usar el ordenador se apoya en cuatro ideas:

1. **Instalar poco y saber exactamente qué hay instalado**.
2. **Tener contextos de trabajo fijos**.
3. **Moverme por teclado antes que por interfaz**.
4. **Usar herramientas sencillas y transparentes**.

Esta guía no es teoría. Está basada en mi configuración real de `brew`, `zsh`, `Ghostty`, `Neovim`, `AeroSpace` y `skhd`.

## El sistema: pocas piezas y control explícito

Intento evitar el clásico caos de macOS: aplicaciones instaladas a mano, restos de configuraciones antiguas, `dmg` olvidados y herramientas que ya ni recuerdo para qué servían. Mi solución no es una configuración totalmente declarativa como NixOS, pero sí una versión intermedia bastante práctica.

Mantengo buena parte de mi sistema en un `brewfile` dentro de mis dotfiles. Ahí tengo tanto herramientas de terminal como aplicaciones gráficas:

```bash
# CLI tools
brew "neovim"
brew "git"
brew "curl"
brew "stow"
brew "fzf"
brew "zig"
brew "go"
brew "node"
brew "switchaudio-osx"
brew "zsh-syntax-highlighting"
brew "zsh-autosuggestions"
tap "asmvik/formulae"
brew "asmvik/formulae/skhd"
brew "lazygit"
brew "mole"

# GUI Applications
cask "zen"
cask "qobuz"
cask "ghostty"
cask "obsidian"
cask "iina"
cask "obs"
cask "qbittorrent"
cask "ente-auth"
cask "tailscale-app"
cask "affinity"
cask "imageoptim"
cask "blender"
cask "discord"
cask "nikitabobko/tap/aerospace"
```

No está todo, pero sí casi todo lo importante. El objetivo no es convertir Homebrew en una religión, sino en un inventario fiable.

### Brewsync

Para mantener esa lista viva uso una función propia en `.zshrc` llamada `brewsync`. La idea es muy simple: abro el `brewfile` en Neovim, y al cerrar compruebo si ha cambiado. Si ha cambiado, sincronizo. Si no, actualizo igualmente paquetes y limpio.

```bash
function brewsync() {
    local BREWFILE="$HOME/.dotfiles/brewfile"
    [[ ! -f "$BREWFILE" ]] && echo "$fg[red] Error: Brewfile no encontrado" && return 1

    local OLD_HASH=$(shasum -a 256 "$BREWFILE")
    nvim "$BREWFILE"
    local NEW_HASH=$(shasum -a 256 "$BREWFILE")

    if [[ "$OLD_HASH" != "$NEW_HASH" ]]; then
        echo "$fg[cyan]Cambios detectados. Sincronizando Brewfile..."
        cd "$(dirname "$BREWFILE")" || return
        brew bundle --quiet
        brew bundle cleanup --force --quiet
        brew update
        brew upgrade
        brew cleanup --prune=all
        cd - > /dev/null
        echo "$fg[green] Sincronización completada."
    else
        echo "No hubo cambios en el archivo. Actualizando."
        brew update
        brew upgrade
        brew cleanup --prune=all
    fi
}
```

Esto me gusta por dos motivos. Primero, porque reduce el número de decisiones pequeñas. Segundo, porque me obliga a pensar qué entra en el sistema y qué no.

## El escritorio: tres contextos, no veinte escritorios

Antes usaba un enfoque más directo con ventanas maximizadas y atajos para lanzar aplicaciones. Ahora sigo buscando esa misma rapidez, pero con una capa más: **contexto por workspace**.

Uso [AeroSpace](https://nikitabobko.github.io/AeroSpace/) como gestor de ventanas. Mi configuración es muy pequeña:

```toml
start-at-login = true
accordion-padding = 0

[mode.main.binding]
ctrl-1 = "workspace 1"
ctrl-2 = "workspace 2"
ctrl-3 = "workspace 3"

ctrl-shift-1 = "move-node-to-workspace 1"
ctrl-shift-2 = "move-node-to-workspace 2"
ctrl-shift-3 = "move-node-to-workspace 3"

alt-shift-h = "focus left"
alt-shift-l = "focus right"
alt-shift-k = "focus up"
alt-shift-j = "focus down"

alt-shift-left  = "move left"
alt-shift-right = "move right"
alt-shift-up    = "move up"
alt-shift-down  = "move down"

ctrl-o = "layout tiles"
ctrl-p = "layout accordion"
```

No necesito más. Tengo solo **tres espacios** y cada uno tiene un papel bastante claro:

- **Workspace 1**: código y desarrollo.
- **Workspace 2**: organización personal, navegador y notas.
- **Workspace 3**: trabajo audiovisual y herramientas creativas.

Eso es importante: no uso workspaces como cajones caóticos, sino como contextos funcionales.

## SKHD: el teclado cambia según el contexto

La pieza más interesante del sistema no es AeroSpace, sino `skhd`. Ahí es donde el ordenador empieza a sentirse realmente personal.

Mi `skhdrc` no se limita a abrir una app concreta. Lo que hace es reinterpretar la misma tecla según el workspace donde estoy. Por ejemplo:

```bash
# ALT + Q
alt - q : \
  case "$(aerospace list-workspaces --focused)" in \
    1) open -a "Codex" ;; \
    2) open -a "Things3" ;; \
    3) open -a "DaVinci Resolve" ;; \
  esac

# ALT + W
alt - w : \
  case "$(aerospace list-workspaces --focused)" in \
    1) open -a "Antigravity" ;; \
    2) open -a "Zen" ;; \
    3) open -a "Logic Pro" ;; \
  esac

# ALT + E
alt - e : \
  case "$(aerospace list-workspaces --focused)" in \
    1) open -a "Ghostty" ;; \
    2) open -a "Obsidian" ;; \
    3) open -a "Soundly" ;; \
  esac
```

Esto me encanta porque reduce muchísimo la fricción. No tengo que memorizar veinte combinaciones. Memorizo una pequeña cuadrícula mental:

- `ALT + Q`
- `ALT + W`
- `ALT + E`
- `ALT + R`
- `ALT + A`

Y luego cada tecla adquiere significado según el espacio en el que estoy.

### Mi mapa mental de trabajo

En la práctica, esa cuadrícula queda así:

**Workspace 1: código**
- `ALT + Q` → Codex
- `ALT + W` → Antigravity
- `ALT + E` → Ghostty
- `ALT + R` → Xcode
- `ALT + A` → Finder en `~/Development`

**Workspace 2: organización**
- `ALT + Q` → Things3
- `ALT + W` → Zen
- `ALT + E` → Obsidian
- `ALT + R` → aquí todavía tengo pendiente rematar el caso de Calendar
- `ALT + A` → Finder en `~`

**Workspace 3: audiovisual**
- `ALT + Q` → DaVinci Resolve
- `ALT + W` → Logic Pro
- `ALT + E` → Soundly
- `ALT + R` → Affinity
- `ALT + A` → Finder en `/Volumes/CZM2/`

Ese último detalle es especialmente bueno: el Finder no abre "una carpeta cualquiera", sino **la carpeta correcta según el contexto de trabajo**. En desarrollo entro a proyectos. En organización entro a mi home. En audiovisual entro al volumen donde está el material.

## Audio y utilidades rápidas

También uso `skhd` para tareas pequeñas pero repetitivas. Por ejemplo, cambiar la salida de audio sin tocar menús:

```bash
ctrl - e : SwitchAudioSource -s "iFi (by AMR) HD USB Audio Output"
ctrl - r : SwitchAudioSource -s "BenQ EX2780Q"
ctrl - t : ~/.dotfiles/scripts/toggle-tailscale.sh
```

Son atajos poco glamourosos, pero precisamente por eso merecen ser teclas. Si algo hago constantemente, no debería vivir enterrado en un icono de la barra de menú.

## La terminal: Ghostty grande, limpia y cómoda

Uso [Ghostty](https://ghostty.org/) como terminal. Mi configuración es muy simple y va completamente en la dirección de la legibilidad:

```ini
font-family = "JetBrains Mono"
font-size = 23
theme = Dark+
macos-titlebar-style = tabs
mouse-hide-while-typing = true
shell-integration-features = ssh-env,ssh-terminfo
bell-features = border
adjust-cell-height = 10%
window-save-state = always
window-padding-y = 4
```

Hay dos cosas que destacan aquí:

1. **Tipografía muy grande**. No quiero una terminal diminuta con veinte paneles. Quiero leer sin esfuerzo.
2. **Interfaz casi invisible**. Tabs de macOS, poco padding, campana visual en vez de sonido y estado de ventana persistente.

Mi terminal no intenta ser un dashboard. Es una superficie de trabajo.

## La shell: Zsh con prompt propio

La shell sigue siendo `zsh`, pero no uso un tema complejo. Tengo un prompt hecho a mano que enseña exactamente lo que necesito:

- ruta actual,
- rama git,
- y estado del repositorio.

Además cargo `zsh-syntax-highlighting` y `zsh-autosuggestions`, que para mí son dos mejoras básicas de calidad de vida.

También tengo una función pequeña llamada `ff` para saltar rápidamente entre proyectos dentro de `~/Development` usando `fzf`:

```bash
ff() {
  local dir
  dir=$(find $HOME/Development -type d -maxdepth 1 ! -name '.*' | fzf)
  if [ -n "$dir" ]; then
    cd "$dir" || return
    clear
  fi
}
bindkey -s '^F' 'ff\n'
```

Este tipo de cosas me interesan mucho más que una shell "impresionante". No busco demostrar nada. Busco ir más rápido.

## El editor: Neovim, pero sin convertirlo en un avión

Neovim es mi editor principal. Mi configuración también es relativamente contenida:

- `lazy.nvim` como gestor de plugins,
- `rose-pine` como tema,
- `Treesitter`,
- `Mason`,
- `indent-blankline`,
- `blink.cmp`,
- `Telescope`,
- `lualine`,
- `Neo-tree`.

Y algunas decisiones de base muy importantes:

```lua
vim.g.mapleader = " "
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.termguicolors = true
vim.opt.laststatus = 3
vim.opt.tabstop = 4
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.fillchars = { eob = " " }
vim.opt.clipboard = "unnamedplus"
```

Lo que más me gusta de esta configuración es que se nota que está pensada para trabajar, no para presumir:

- números relativos,
- portapapeles del sistema,
- transparencia forzada,
- Telescope para encontrar archivos,
- Neo-tree para abrir estructura cuando hace falta,
- y una barra de estado global.

No intento meter todas las ideas del ecosistema de Neovim. Solo las que de verdad mejoran mi uso diario.

## Filosofía general

Si tuviera que resumir todo esto en una sola idea, sería esta:

**Quiero que cada tecla tenga contexto y cada herramienta tenga una razón para existir.**

No me interesa optimizar por optimizar. Me interesa reducir ruido. Tener un sistema que:

- instala poco,
- se entiende fácil,
- responde rápido,
- y me permite entrar en modo trabajo sin pelearme con él.

Por eso solo tengo tres workspaces. Por eso mis atajos son contextuales. Por eso mi terminal es enorme. Por eso mantengo un `brewfile`. Por eso prefiero herramientas discretas como Ghostty, `fzf`, `skhd` o AeroSpace.

No necesito un ordenador futurista. Necesito uno que no estorbe.

## Resumen rápido

- **Sistema**: Homebrew + `brewfile` + `brewsync`.
- **Ventanas**: AeroSpace con 3 workspaces.
- **Atajos**: `skhd` contextual según el workspace.
- **Terminal**: Ghostty, grande, limpia y sin ruido.
- **Shell**: Zsh con prompt propio, `fzf`, autocompletado y resaltado.
- **Editor**: Neovim práctico, transparente y orientado a búsqueda rápida.
- **Audio**: cambio directo entre auriculares y altavoces por tecla.

Es probablemente la manera más cercana que he encontrado de hacer que el ordenador se comporte como una herramienta y no como un entretenimiento.
