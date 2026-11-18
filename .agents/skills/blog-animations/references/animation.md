# Cronología de una ilustración

## Define los momentos que se leen

Pon en orden el reposo, el gesto, el efecto y el reinicio. Una pulsación baja la tecla por la altura de su sombra, comprime la sombra y activa el color de foco. Retrasa el efecto hasta que pueda atribuirse al gesto. Sostén el resultado mientras haya algo que leer antes de reiniciar. Si al volver al inicio parece que el usuario ejecuta la acción al revés, devuelve la pieza a su posición original mientras está oculta.

| Escena en el blog | Secuencia de referencia |
| --- | --- |
| `KeyboardLayout.astro` | En `4.4s`, Fn baja antes que J. El cursor se desplaza cuando J ya está pulsada, J sube antes que Fn y el cursor vuelve al inicio durante un fundido. |
| `ProjectAutomation.astro` | En `6s`, las filas manuales comparten keyframes y empiezan con intervalos de `0.9s`. A los `3s` empieza la pulsación de «Abrir proyecto». El resultado aparece a continuación y se mantiene visible antes del reinicio. |
| `WindowManagement.astro` | Cada paso dura `2.7s`. Los desfases negativos de las variantes sitúan sus etiquetas y efectos en el tramo correcto desde el primer fotograma. Las etiquetas se muestran con `steps(1, end)` para evitar que se mezclen. |

Convierte segundos a marcas de CSS con `100 × instante / duración`. En un ciclo de `6s`, `3s` equivale al `50%` y `3.72s` al `62%`. Usa dos marcas con el mismo valor para sostener un estado. Usa interpolación para el movimiento y `steps(1, end)` para un texto o contador que deba cambiar de golpe. Comenta el orden y los tiempos que resulte difícil deducir de los porcentajes.

Si varias piezas ejecutan el mismo gesto, usa los mismos keyframes. Calcula el desfase de cada pieza con su índice. Haz positivos los desfases cuando quieran empezar en reposo, como las filas manuales. Usa un desfase negativo cuando la pieza deba estar ya en una fase concreta al cargar la página, como las variantes de un atajo.

## Plantilla de gesto y resultado

Adapta este componente cuando una entrada produzca un cambio discreto. El CSS base muestra el resultado para movimiento reducido. El ciclo de `4s` deja un segundo de reposo, pulsa la tecla entre el `25%` y el `31%`, revela el resultado desde el `31%` y lo mantiene hasta el `88%`. Sustituye el ejemplo por el atajo y el resultado de la sección.

```astro
<figure class="shortcut-demo">
	<div class="stage" aria-hidden="true">
		<kbd class="key">Enter</kbd>
		<span class="arrow">→</span>
		<span class="result">Proyecto abierto</span>
	</div>
	<figcaption>Enter abre el proyecto seleccionado.</figcaption>
</figure>

<style>
	.shortcut-demo { --cycle: 4s; margin: 2rem 0; max-width: 48rem; }
	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		place-items: center;
		gap: 0.5rem;
		min-height: 10rem;
	}
	.stage .key {
		padding: 0.65rem;
		border: 1px solid var(--color-line);
		border-radius: 0.25rem;
		background: var(--color-paper);
		box-shadow: 0 3px 0 var(--color-line);
		font: 0.8rem / 1 var(--font-mono);
	}
	.arrow { color: var(--color-muted); }
	.result {
		padding: 0.65rem;
		background: var(--color-focus);
		color: light-dark(#fff, #08071d);
		font-size: 0.8rem;
		text-align: center;
	}
	figcaption { margin-top: 0.65rem; color: var(--color-muted); font-size: 0.7rem; line-height: 1.6; }

	@media (prefers-reduced-motion: no-preference) {
		.key { animation: press var(--cycle) ease infinite; }
		.result { animation: reveal var(--cycle) ease infinite; }
	}
	@keyframes press {
		0%, 25%, 46%, 100% { transform: translateY(0); box-shadow: 0 3px 0 var(--color-line); background: var(--color-paper); color: var(--color-ink); }
		31%, 40% { transform: translateY(3px); box-shadow: none; background: var(--color-focus); color: light-dark(#fff, #08071d); }
	}
	@keyframes reveal {
		0%, 31%, 100% { transform: translateY(0.35rem); opacity: 0; }
		41%, 88% { transform: translateY(0); opacity: 1; }
	}
</style>
```

## Inspecciona un fotograma

Si dos estados parecen desincronizados, pausa las animaciones de la figura en la consola del navegador y sitúalas en el mismo instante. Cambia `.shortcut-demo` por la clase de la figura y `1500` por el tiempo en milisegundos. Recarga la página cuando termines para volver al ciclo normal.

```js
const figure = document.querySelector('.shortcut-demo');
for (const animation of figure.getAnimations({ subtree: true })) {
  animation.pause();
  animation.currentTime = 1500;
}
```
