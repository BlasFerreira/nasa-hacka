# Aplicación y despliegue

* [Arquitectura de la app](arquitectura.md) - Sitio estático: HTML autocontenido generado desde plantillas, con el motor y los datos inlineados; sin backend.
* [Climate Twin 3D](climate-twin-3d.md) - Réplica 3D del campo que reproduce una campaña real, por ejemplo la sequía 2022/23, con capas de estrés.
* [Copilot](copilot.md) - Asistente flotante local que interpreta comandos y ejecuta las funciones reales de la app, sin IA generativa.
* [Despliegue en Vercel](despliegue-vercel.md) - Cada push a main publica automáticamente; plan Hobby gratuito, sin cargos.
* [Flujo de trabajo con git](flujo-de-trabajo-git.md) - Una rama por tarea, reconstruir antes de commitear y merge a main que despliega.
* [Páginas y rutas](paginas-y-rutas.md) - Qué sirve cada URL de producción y qué vistas tiene la app.
* [App instalable (PWA)](pwa.md) - Manifest, íconos, service worker y ajustes para celular.
