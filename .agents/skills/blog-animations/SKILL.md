---
name: blog-animations
description: Crea o modifica las ilustraciones animadas de los artículos MDX de este blog. Úsala para imitar su estilo al mostrar atajos, cambios de estado, comparaciones o secuencias de trabajo con Astro y CSS.
---

# Ilustraciones animadas del blog

## Elige la escena

Lee la sección del artículo y abre la figura más cercana al nuevo ejemplo en `src/components/`. Usa el texto como fuente de los pasos, nombres y atajos. Si faltan detalles sobre la configuración del autor, representa la idea como un ejemplo esquemático y acláralo en el pie.

| Si el texto describe… | Abre este componente | Observa cómo… |
| --- | --- | --- |
| Un atajo que causa un cambio | `WindowManagement.astro` y `src/styles/shortcut-animations.css` | El modificador se pulsa primero, el efecto sigue a la tecla y la etiqueta cambia después de soltarla. |
| Un proceso que avanza en paralelo a su efecto | `FuzzyFinding.astro` o `DeclarativeConfig.astro` | La consulta y los resultados, o el inventario y las aplicaciones, comparten una cronología. |
| Dos disposiciones con el mismo resultado | `KeyboardLayout.astro` | Las dos siluetas quedan visibles y ambas desembocan en un único resultado. |
| Una secuencia manual frente a una acción agrupada | `ProjectAutomation.astro` | Las filas se activan de una en una y la mitad derecha muestra una sola pulsación seguida de su resultado. |

## Dibuja y anima

1. Define qué debe entenderse al ver un ciclo. Escribe el pie en una frase que nombre el gesto y su efecto. Coloca la figura después del párrafo donde se presentan.
2. Compón la escena en `src/components/Nombre.astro`. Usa `figure`, un escenario con `aria-hidden="true"` para el dibujo y un `figcaption` visible que transmita su significado. Rellena las piezas repetidas desde el frontmatter de Astro. El navegador solo necesita `@keyframes` para reproducir una secuencia fija.
3. Conserva la escala editorial del artículo. Usa una figura de hasta `48rem`, margen vertical de `2rem`, etiquetas breves en mayúsculas y un pie discreto. Combina `--color-paper`, `--color-soft` y `--color-line` para las superficies, `--color-muted` para las etiquetas y `--color-focus` para el gesto o resultado activo. Usa `--font-mono` en teclas, texto escrito y comandos. Dibuja el mínimo de una interfaz que permita reconocerla.
4. Reserva sitio para cada estado. Alinea dos columnas con `minmax(0, 1fr)` cuando se comparen o se lean de izquierda a derecha. Usa una flecha cuando haga visible la relación. Las piezas que aparecen o desaparecen pueden superponerse o animar dentro de un escenario de altura fija. Deja un estado de reposo legible en el CSS base y aplica el movimiento en `@media (prefers-reduced-motion: no-preference)`.
5. Comparte una variable de duración por escena. Ordena gesto, efecto, pausa y vuelta al inicio. Consulta [la referencia de animación](references/animation.md) para convertir esa secuencia en keyframes, coordinar desfases o adaptar la plantilla de gesto y resultado.
6. Importa el componente desde el MDX con `import Nombre from '../../components/Nombre.astro';` y añade `<Nombre />` en un bloque propio.

## Comprueba la figura en el artículo

- Ejecuta `npm run build` y abre la ruta del artículo en el servidor local. Mira al menos dos ciclos y comprueba el orden de los estados y el empalme entre ellos.
- Comprueba una ventana de sobremesa y una de `320px`. La caja del artículo conserva su altura durante el ciclo, las etiquetas se leen y las flechas y piezas caben.
- Cambia entre temas claro y oscuro con el selector del blog. Revisa los textos sobre el color de foco y el contorno de las piezas en reposo.
- Emula movimiento reducido. La figura permanece quieta y el estado visible junto al pie sigue explicando la idea.
