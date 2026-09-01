---
title: 'Gestión de Color'
description: ''
pubDate: 'Jul 08 2022'
articleType: 'guides'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

El color en vídeo es primero ciencia y después arte. Antes de ponernos creativos y buscar un *look* específico, necesitamos asegurarnos de que lo que vemos es técnicamente correcto. 

Aquí explicaré las bases del **Color Management** (Gestión de Color), un proceso fundamental para conseguir imágenes profesionales y consistentes. Esta guía está basada en mi experiencia y en recursos como este excelente vídeo de [Teams2Film](https://www.youtube.com/watch?v=w0ubDSzEEYg).

## ¿Qué es la Gestión de Color?
Imagina la gestión de color como un **traductor universal**. 

Tu cámara y tu monitor hablan idiomas diferentes. Capturar imágenes y reproducirlas son dos tareas que requieren de herramientas diversas y, de una manera coherente de traducirlas entre sí. La gestión de color tiene, a mi parecer, dos objetivos fundamentales:
- Capturar y preservar la mayor cantidad de información posible. 
- Que todas las personas involucradas en el proceso vean lo mismo.

La gestión de color es el flujo de trabajo que asegura que esa traducción sea matemáticamente perfecta en tres etapas: **Entrada (Cámara)**, **Proceso (Edición)** y **Salida (Pantalla)**.


## Entrada: Perfiles Logarítmicos (LOG)
La mayoría de cámaras profesionales y *prosumer* graban en lo que llamamos perfiles **Logarítmicos** (S-Log3 de Sony, C-Log de Canon, V-Log de Panasonic, etc.).

Cuando grabamos algo, capturamos información de luz y color. Aquello que capturamos se *transforma* de valores matemáticos a pixeles. Los números se representan como una imagen (muy simplificado). Y en ese proceso, hay varias maneras de *transformar* los valores matemáticos que capturamos en imágenes completas. 

- La primera forma es lineal. Cada valor de luz que captura el sensor corresponde de forma directa a un valor de color y de luz en la imagen final. 
- La segunda forma es logarítmica. Los valores de altas luces y sombras se conservan. En vez de grabarse de manera lineal, se *aplanan* para conservar detalles. 

### ¿Por qué se ven grises y planos?
Cuando ves un archivo LOG sin procesar, se ve gris, con poco contraste y colores apagados. Esto no es un error; es una ventaja.
- **Rango Dinámico**: Al "aplanar" la imagen, la cámara es capaz de guardar mucha más información en las sombras y en las luces altas sin perder detalle (clipping).
- **Flexibilidad**: Es como un negativo digital. Tienes mucha más libertad para corregir la exposición y el color en post-producción sin romper la imagen.

El perfil LOG es el "idioma nativo" de tu cámara.

## Flujo de trabajo en DaVinci Resolve
DaVinci Resolve es el estándar de la industria en gestión de color y entalonaje. Es importante entender que hay dos grandes caminos para gestionar el color: **Manual** y **Automático**.

### Método Manual (DaVinci YRGB)
Es el método que viene por defecto, el manual.
- **Cómo funciona**: Tú eres responsable de todo. El proyecto no gestiona nada. Para convertir un clip LOG a Rec.709, debes añadir manualmente un nodo de efecto llamado **Color Space Transform (CST)** en cada clip o a nivel de timeline.
- **Ventajas**: Control absoluto. Nada pasa sin que tú lo hagas.
- **Desventajas**: Muy lento y cansado, sobre todo en proyectos largos.

### Método Automático (DaVinci YRGB Color Managed)
Aquí activamos el motor inteligente de DaVinci. Se hace desde `Project Settings > Color Management > DaVinci YRGB Color Managed`. Al activarlo, DaVinci lee los metadatos de tus archivos (si es RAW) o tu selección de espacio cromático inicial en base a tu cámara, y él se encarga de todas las transformaciones matemáticas en segundo plano.

¿Qué pasa de fondo?
En esencia, DaVinci está cambiando espacios de color, los está traduciendo. Para hacer esto, DaVinci utiliza un espacio de color de trabajo llamado DaVinci Wide Gamut Intermediate. ste espacio, es un espacio de color muy amplio que puede representar valores cromáticos y luminosos mayores que el espectro visible. Los cambios se hacen en este espacio de trabajo para conseguir la máxima flexibilidad. Pero la visualización final se hace en Rec.709. 

Dentro del método automático, hay niveles de jerarquía:
- **Nivel Proyecto**: Afecta a todo el proyecto. 
- **Nivel Timeline** (Recomendado): Esta es la opción más moderna y flexible. Puedes configurar la gestión de color *por línea de tiempo*.

### Mi Recomendación: Gestión por Timeline
Esta opción nos da lo mejor de los dos mundos. Permite tener, en un mismo proyecto:
- Una línea de tiempo en **Rec.709 SDR** (para YouTube).
- Otra línea de tiempo en **Rec.2020 HDR** (para Netflix o TV moderna).

Al hacer esto, tus clips LOG se verán automáticamente correctos y tendrás la flexibilidad profesional para entregar en cualquier formato.

## Gamma shift 
Uno de los problemas más comunes al trabajar en Mac es el **Gamma Shift**: exportas un vídeo que se ve perfecto en DaVinci, pero al abrirlo en QuickTime o subirlo a la web, la imagen se ve "lavada", con menos contraste y colores más pálidos.

### ¿Por qué ocurre?
El estándar de la industria para vídeo (Rec.709) utiliza un Gamma de **2.4**. Sin embargo, Apple utiliza su propio motor de gestión de color llamado **ColorSync**, que interpreta el contenido Rec.709 con un Gamma aproximado de **1.96**. Esa diferencia matemática es la que hace que las sombras se aclaren artificialmente al salir del entorno de edición.

### La Solución
Para que lo que ves en DaVinci coincida con lo que verás en el ecosistema de Apple, debes "hablar su idioma":

1.  **Output Color Space**: En `Project Settings > Color Management`, establece el espacio de salida como **Rec.709 Scene**. Esto añade una etiqueta específica que ColorSync entiende correctamente.
2.  **Preferencias de DaVinci**: Ve a `Preferences > System > General` y activa la casilla **"Use Mac Display Color Profiles for Viewers"**. Esto hará que el visor de DaVinci use el perfil de tu monitor Mac mientras trabajas.
3.  **Tags de Exportación**: En la pestaña *Deliver*, asegúrate de que los "Gamma Tags" estén en `Same as Project` o explícitamente en `Rec.709`.

Con esto, eliminas la incertidumbre y aseguras que tu contraste se mantenga intacto tras el render.

## Resumen

- **Input**: La cámara captura el máximo detalle posible (LOG).
- **Transformación**: El software convierte esos datos a un espacio de trabajo amplio.
- **Output**: El software "revela" la imagen final compatible con las pantallas (Rec.709).

Entender esto te separa de los aficionados. Dejas de "arreglar" clips y empiezas a "revelar" imágenes.
