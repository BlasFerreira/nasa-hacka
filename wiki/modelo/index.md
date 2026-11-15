# Modelo de rendimiento

* [Criterio del gate de ML (D1)](criterio-del-gate.md) - Un cultivo usa modelo solo si explica al menos 20 % de la anomalía y mejora en los tres bloques de años.
* [Features climáticos por ventana fenológica](features-por-ventana.md) - Qué variables se calculan en la ventana crítica de cada cultivo y con qué umbrales.
* [Limitaciones del modelo de rendimiento](limitaciones.md) - Lo que el modelo no puede decir y dónde hace falta criterio local.
* [Modelo de respuesta del rendimiento al clima](modelo-rendimiento-clima.md) - Estima cuánto se aparta el rendimiento de una zona de su tendencia según el clima de la ventana crítica; validado dejando un año afuera.
* [Resultados de la validación](resultados-de-validacion.md) - Habilidad fuera de muestra por zona y cultivo, modelo elegido y si pasa el gate.
* [Validación dejando un año afuera](validacion-loyo.md) - Para cada campaña se entrena sin ella y se predice; la tendencia se ajusta dentro de cada fold para evitar fugas.
