---
title: 'Mi configuración de macOS'
description: 'Mi entorno de trabajo en macOS: Homebrew, AeroSpace, Rex, Neovim y un flujo de desarrollo con agentes.'
pubDate: 'Jul 15 2022'
updatedDate: '2026-11-10'
articleType: 'guides'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

Mi ordenador ideal no llama la atención. Quiero que responda rápido, que sea predecible y que me deje pensar en lo que estoy haciendo: editar, escribir, programar, buscar algo o escuchar música.

Uso macOS como sistema principal. En Apple Silicon encuentro una combinación de silencio, batería, rendimiento sostenido y aplicaciones creativas que me resulta cómoda para trabajar. Linux sigue estando presente en mi servidor y en mi manera de pensar la informática.

Mi forma de usar el ordenador se apoya en cuatro ideas:

1. **Saber qué tengo instalado y por qué**.
2. **Dar un lugar predecible a cada aplicación**.
3. **Moverme por teclado**.
4. **Mantener la configuración comprensible**.

Esta guía recoge el estado de mi entorno de trabajo en noviembre de 2026. Ahora tengo siete espacios en AeroSpace, uso Rex como terminal en lugar de Ghostty y Neovim se apoya en LazyVim, con ajustes propios para navegar, compilar y trabajar con notas. Los agentes también forman parte de mi manera de desarrollar.

## Los dotfiles: configuración que puedo revisar

Guardo la configuración en `~/.dotfiles` y uso Stow para enlazarla con las ubicaciones donde la esperan las aplicaciones. Mantengo ahí la shell, Git, Ghostty, AeroSpace y Neovim, además del Brewfile y algunos scripts.

Me interesa poder abrir un archivo, entender qué hace y revisar cómo ha cambiado con el tiempo. El repositorio también me permite distinguir entre una decisión que sigo usando y una prueba que ya he retirado.

## Homebrew: un inventario más pequeño

Mi `brewfile` actual contiene estas herramientas y aplicaciones:

```ruby
# CLI tools
brew "neovim"
brew "stow"
brew "fzf"
brew "zig"
brew "go"
brew "node"
brew "php"
brew "composer"

# GUI Applications
cask "zen"
cask "helium-browser"
cask "qobuz"
cask "ghostty"
cask "obsidian"
cask "iina"
cask "obs"
cask "affinity"
cask "blender"
cask "nikitabobko/tap/aerospace"
```

Respecto a la configuración anterior, aparecen PHP y Composer entre las herramientas de desarrollo, y Helium entre los navegadores. Otras entradas han salido del archivo. El Brewfile todavía incluye Ghostty, aunque mi terminal actual es Rex, que tiene una regla en AeroSpace y no figura en esta lista.

### Brewsync

Sigo manteniendo una función `brewsync` en `.zshrc`. Abre `~/.dotfiles/brewfile` en Neovim y compara su hash antes y después de editarlo.

Si detecta cambios, entra en el directorio de los dotfiles y ejecuta `brew bundle --quiet` y `brew bundle cleanup --force --quiet`. Después actualiza Homebrew, actualiza los paquetes y limpia la caché con `brew cleanup --prune=all`. Si el archivo no cambia, ejecuta esa última parte de actualización y limpieza.

Hay un detalle práctico: la limpieza de Bundle elimina las instalaciones gestionadas por Homebrew que no estén declaradas en el Brewfile. Mantener la lista al día forma parte del uso de esta función.

## AeroSpace: siete espacios con aplicaciones asignadas

Antes organizaba el escritorio en tres grandes contextos. Ahora la distribución es más concreta: tengo accesos directos a **siete espacios**, y varias aplicaciones tienen un destino asignado cuando AeroSpace detecta sus ventanas.

| Espacio | Aplicación asignada |
| --- | --- |
| 1 | Rex |
| 2 | Zen |
| 3 | Calendario |
| 4 | Notas de Apple |
| 5 | Qobuz |
| 6 | Safari |
| 7 | Logic Pro |

Las reglas mueven las ventanas al espacio correspondiente. Por ejemplo, la de Rex es así:

```toml
[[on-window-detected]]
if.app-id = 'com.superlogical.rex'
run = ['move-node-to-workspace 1']
```

La regla actúa cuando aparece una ventana, y yo cambio de espacio con `Ctrl` y su número. Para enviar la ventana actual a otro espacio, añado `Shift`:

```toml
[mode.main.binding]
ctrl-1 = "workspace 1"
ctrl-2 = "workspace 2"
ctrl-3 = "workspace 3"
ctrl-4 = "workspace 4"
ctrl-5 = "workspace 5"
ctrl-6 = "workspace 6"
ctrl-7 = "workspace 7"

ctrl-shift-1 = "move-node-to-workspace 1"
ctrl-shift-2 = "move-node-to-workspace 2"
ctrl-shift-3 = "move-node-to-workspace 3"
ctrl-shift-4 = "move-node-to-workspace 4"
ctrl-shift-5 = "move-node-to-workspace 5"
ctrl-shift-6 = "move-node-to-workspace 6"
ctrl-shift-7 = "move-node-to-workspace 7"
```

AeroSpace arranca al iniciar sesión y mantiene `accordion-padding = 0`. Los atajos de foco y distribución también han cambiado:

| Atajo | Acción |
| --- | --- |
| `Ctrl + J` | Foco a la izquierda |
| `Ctrl + K` | Foco a la derecha |
| `Ctrl + Q` | Distribución en mosaico |
| `Ctrl + W` | Distribución en acordeón |

FaceTime tiene una excepción: sus ventanas se configuran como flotantes.

La antigua cuadrícula de lanzadores contextuales con `skhd` ya no está en el repositorio. Los atajos que describo aquí están definidos directamente en AeroSpace.

## Audio y red desde el teclado

El cambio de salida de audio y el acceso a Tailscale también viven ahora en la configuración de AeroSpace:

```toml
ctrl-e = 'exec-and-forget SwitchAudioSource -s "iFi (by AMR) HD USB Audio Output"'
ctrl-r = 'exec-and-forget SwitchAudioSource -s "Altavoces del MacBook Pro"'
ctrl-t = 'exec-and-forget ~/.dotfiles/scripts/toggle-tailscale.sh'
```

La segunda salida ya es la de los altavoces del MacBook Pro. El script de Tailscale consulta el estado de la conexión y ejecuta `tailscale up` o `tailscale down` según el resultado.

Estos accesos usan `SwitchAudioSource` y el comando `tailscale`, que deben estar disponibles aunque no figuren en el Brewfile actual.

## Rex: mi terminal actual

He sustituido Ghostty por **Rex** para el trabajo diario. Tiene asignado el primer espacio de AeroSpace, y mi configuración de Neovim detecta cuándo se está ejecutando dentro de él para adaptar los colores.

La configuración de Ghostty sigue guardada en los dotfiles como referencia de mi entorno anterior. Sus ajustes de fuente, padding y apariencia corresponden a Ghostty; la integración de Neovim con Rex se configura por separado.

La legibilidad sigue teniendo mucho peso en estas decisiones. Quiero leer la terminal con comodidad durante sesiones largas y mantener una apariencia coherente entre ella y el editor.

## Desarrollo con agentes

Los agentes de programación forman parte de mi flujo de trabajo. Les encargo tareas concretas sobre un repositorio: investigar un problema, implementar un cambio o actualizar la documentación a partir del código. La conversación sirve para definir el resultado y corregir el rumbo mientras avanzan.

Mantengo mis preferencias en archivos `AGENTS.md`: soluciones sencillas, aprovechar el sistema de tipos, comentarios al día y pruebas centradas en el comportamiento que importa. También distingo entre pedir una explicación y encargar una modificación: una pregunta sobre el código debe poder quedarse en una respuesta, sin provocar cambios en los archivos.

El recorrido habitual de una tarea es este:

1. **Definir el resultado.** Explico qué quiero conseguir y las restricciones que debe respetar el cambio.
2. **Consultar el contexto.** El agente revisa el repositorio, sus instrucciones y los archivos relacionados antes de proponer o implementar una solución.
3. **Trabajar y comprobar.** Hace los cambios y ejecuta las comprobaciones pertinentes: compilar, probar el comportamiento afectado o revisar el resultado generado, según la tarea.
4. **Revisar la entrega.** Deja un resumen de lo que ha cambiado, cómo lo ha comprobado y cualquier limitación pendiente.
5. **Guardar y publicar.** El agente crea el commit; yo reviso el resultado y hago el push.

Ese último reparto es una preferencia explícita de mi configuración. Me permite delegar el trabajo sobre los archivos y conservar un punto de revisión antes de enviar los cambios al repositorio remoto.

También me interesa que el contexto sea verificable. Al encargar la documentación de una configuración, el punto de partida son sus archivos actuales. Las preguntas sirven para completar lo que el repositorio no explica.

## Zsh: un prompt propio y acceso directo a los proyectos

La shell sigue siendo Zsh con Oh My Zsh y los plugins `zsh-syntax-highlighting` y `zsh-autosuggestions`.

El prompt muestra la ruta en una línea y el símbolo `❯` en la siguiente. En los repositorios añade la rama de Git: gris cuando el árbol de trabajo está limpio y roja cuando hay cambios. La información de la rama se obtiene con `vcs_info`, y la comprobación del estado se realiza en `precmd`, antes de dibujar el prompt.

La función `ff` también ha cambiado. Ahora busca proyectos en `~/Dev`, usa la presentación mínima de `fzf` y abre el directorio seleccionado en Neovim:

```zsh
ff() {
  local dir
  dir=$(find $HOME/Dev -type d -maxdepth 1 ! -name '.*' | fzf --style minimal)
  if [ -n "$dir" ]; then
    cd "$dir" || return
    nvim . || return
    clear
  fi
}
bindkey -s '^F' 'ff\n'
```

Con `Ctrl + F` elijo el proyecto, cambio a su carpeta y entro en el editor. Al salir de Neovim, la terminal sigue situada en ese proyecto.

## Neovim: LazyVim con una interfaz más contenida

La base actual es **LazyVim**, cargada mediante `lazy.nvim`. Sobre ella mantengo ajustes propios de interfaz, navegación y compilación. La antigua lista de plugins con Rose Pine, Telescope y Neo-tree ya no describe esta configuración.

Fuera de Rex uso **Evergarden**, con la variante `fall`, acento verde y fondo transparente. Dentro de Rex uso el esquema integrado `default` y desactivo los colores RGB para que Neovim siga la paleta de la terminal:

```lua
vim.g.rex_terminal = (vim.env.REX_BLOCK or "") ~= "" or vim.env.TERM == "xterm-rex"
if vim.g.rex_terminal then
  vim.opt.termguicolors = false
end
```

Lualine usa en ese caso un tema de 16 colores, con el área del nombre del archivo heredando el primer plano y el fondo de Rex. Así, cambiar el tema de Rex actualiza también los colores del editor abierto. Evergarden se carga cuando es el tema seleccionado.

He desactivado Bufferline, Oil, el explorador de Snacks y su desplazamiento animado. Mantengo la línea de comandos abajo, sin el formato de paleta flotante, y la barra de estado muestra el modo y la ruta del archivo sin separadores.

### Archivos y compilación

Para explorar directorios uso **netrw**. Snacks sigue disponible para los selectores de archivos, proyectos y buffers, con paneles en la parte inferior. El selector de archivos oculta la vista previa y excluye los archivos ocultos y `node_modules`.

Estos son algunos de mis atajos propios; `<leader>` representa la tecla prefijo de los atajos de Neovim:

| Atajo | Acción |
| --- | --- |
| `<leader>e` | Abrir `:Explore` |
| `<leader>E` | Abrir el directorio de trabajo en netrw |
| `<leader>fe` | Preparar `:edit` con la ruta del directorio actual |
| `<leader>fd` | Preparar `:Explore` con esa ruta |
| `<leader>cc` | Ejecutar `:Compile` |
| `<leader>cg` | Repetir con `:Recompile` |

En la edición de rutas, Retroceso elimina un componente completo del camino. Es un ajuste pequeño que facilita subir de directorio sin borrar letra a letra.

La compilación sigue una idea familiar de Emacs: introducir un comando, recoger su salida en un buffer `*compilation*` y poder repetirlo. El comando inicial es `zig build`, pero puedo sustituirlo desde `:Compile`.

## Mist: notas y tareas en Markdown

Otra incorporación es **Mist**, un conjunto de módulos propios dentro de la configuración de Neovim. Trabaja sobre `~/notes`, con una bandeja de entrada en `inbox.md` y notas diarias en `daily/`.

| Comando | Uso |
| --- | --- |
| `:MistCapture` | Capturar una tarea |
| `:MistAgenda` | Consultar la agenda |
| `:MistOutline` | Navegar por los encabezados de una nota |
| `:MistFiles` | Explorar los archivos de notas |
| `:MistInbox` | Abrir la bandeja de entrada |
| `:MistToday` | Abrir o crear la nota del día |

Dentro de las notas Markdown de ese directorio tengo además atajos como `,cc` para capturar, `,aa` para la agenda y `,gt` para la nota de hoy. Espacio marca o desmarca una tarea.

Una de las últimas mejoras ha sido posponer la construcción del índice hasta que se consulta o se guarda una nota. Abrir un archivo de código o un directorio ya no provoca un recorrido inicial por todas las notas. Los resaltados de Mist también siguen la paleta de la terminal.

## Lo que mantengo como criterio

La configuración ha crecido en unas partes y se ha reducido en otras. Tengo más espacios, pero las aplicaciones principales tienen destinos concretos. Neovim parte de LazyVim, y mis ajustes se concentran en la navegación, la lectura y las tareas que repito.

Sigo buscando lo mismo: que abrir un proyecto, encontrar una nota, mover una ventana o cambiar la salida de audio requiera pocas decisiones. Rex, Neovim y el trabajo con agentes forman parte de ese entorno. Los dotfiles me permiten revisar si cada cambio acerca el ordenador a esa forma de trabajar.
