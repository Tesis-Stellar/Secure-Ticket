# Matriz de trazabilidad de pruebas

Esta matriz relaciona las pruebas ejecutadas, su estado final y el soporte que debe quedar asociado como anexo del Plan de Pruebas de Secure Ticket. La matriz se alinea con los anexos finales del documento: contratos inteligentes, backend/API e integracion, frontend/E2E, reventa en Testnet, carga y smoke test de despliegue.

| ID | Caso / categoria de prueba | Tipo | Estado final | Evidencia de ejecucion | Anexo asociado |
|---|---|---|---|---|---|
| CONTRACT-01 | Pruebas de contratos Soroban mediante `cargo test` | Contratos inteligentes | Aprobado | 58 pruebas aprobadas, 0 fallidas; salida de consola de `cargo test`; advertencias no bloqueantes del entorno de compilacion | Anexo A: Evidencias de pruebas de contratos inteligentes |
| CONTRACT-ISSUE-01 | Emision de boleto | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test` para `event_contract`, con validacion de creacion de ticket y propietario | Anexo A |
| CONTRACT-RESALE-01 | Reventa de boleto | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, incluyendo compra, reglas de reventa y transferencia de propiedad | Anexo A |
| CONTRACT-BURN-REMINT-01 | Versionamiento del ticket en reventa | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, con incremento de version y control de version vigente | Anexo A |
| CONTRACT-COMMISSION-01 | Comisiones de reventa | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, con validacion de reglas de comision | Anexo A |
| CONTRACT-RESALE-CANCEL-01 | Cancelacion de reventa | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, con retiro del ticket del estado de reventa | Anexo A |
| CONTRACT-INVALIDATE-01 | Invalidacion de boleto | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, con bloqueo de operaciones posteriores | Anexo A |
| CONTRACT-REDEEM-01 | Redencion on-chain por verificador autorizado | Contratos inteligentes | Aprobado | Caso cubierto dentro de `cargo test`, incluyendo rechazo de redencion no autorizada o repetida | Anexo A |
| CONTRACT-NEG-01 | Casos negativos de contrato | Contratos inteligentes | Aprobado | Casos cubiertos dentro de `cargo test`: precios invalidos, ticket inexistente, usuario no autorizado, ticket usado o invalidado | Anexo A |
| BACKEND-UNIT-01 | Pruebas unitarias del backend | Backend/API | Aprobado | `npm run test:unit`, 103 pruebas aprobadas, 0 fallidas | Anexo B: Evidencias de pruebas backend/API e integracion |
| API-01 | Pruebas API e integracion backend | Backend/API | Aprobado | `npm run test:api`, 42 pruebas aprobadas, 0 fallidas | Anexo B |
| API-SCAN-01 | Escaner QR por API | Backend/API | Aprobado | Casos de escaner dentro de `npm run test:api`: QR valido, QR invalido, ticket usado, ticket invalidado, ticket inexistente, token ausente, rol incorrecto y doble escaneo | Anexo B |
| API-ROLE-01 | Validacion de roles y endpoints protegidos | Backend/API | Aprobado | Casos de autenticacion, autorizacion, tokens invalidos o expirados y rechazo por rol dentro de `npm run test:api` | Anexo B |
| API-TICKET-INVALIDATE-01 | Ticket invalidado no puede listarse, comprarse ni aceptarse por escaner | Backend/API | Aprobado | Caso cubierto dentro de `backend/src/api.supertest.test.ts` y ejecutado en `npm run test:api` | Anexo B |
| INT-SYNC-01 | Sincronizacion de eventos normalizados con PostgreSQL | Integracion/indexador | Aprobado | Pruebas de indexador incluidas en `npm run test:api`, 5 de 5 aprobadas | Anexo B |
| INT-SYNC-02 | Evento de boleto creado | Integracion/indexador | Aprobado | Proyeccion del evento sobre PostgreSQL dentro de `backend/src/indexer.integration.test.ts` | Anexo B |
| INT-SYNC-03 | Evento de boleto listado para reventa | Integracion/indexador | Aprobado | Actualizacion de estado de reventa dentro de pruebas de indexador | Anexo B |
| INT-SYNC-04 | Evento de venta cancelada | Integracion/indexador | Aprobado | Cancelacion de listado reflejada en persistencia off-chain | Anexo B |
| INT-SYNC-05 | Evento de boleto revendido | Integracion/indexador | Aprobado | Actualizacion de propietario, version y estado del ticket | Anexo B |
| INT-SYNC-06 | Evento de boleto redimido | Integracion/indexador | Aprobado | Proyeccion de `boleto_redimido` como ticket usado o redimido segun modelo de datos | Anexo B |
| INT-SYNC-07 | Evento de boleto invalidado | Integracion/indexador | Aprobado | Proyeccion de invalidacion y bloqueo de operaciones posteriores | Anexo B |
| INT-SYNC-08 | Evento duplicado | Integracion/indexador | Aprobado | Validacion de idempotencia y ausencia de duplicados | Anexo B |
| INT-SYNC-09 | Evento desconocido o mal formado | Integracion/indexador | Aprobado | Manejo controlado de eventos no reconocidos o invalidos | Anexo B |
| FRONTEND-UNIT-01 | Pruebas unitarias frontend | Frontend | Aprobado | `npm test`, 22 pruebas aprobadas, 0 fallidas | Anexo C: Evidencias de pruebas frontend y end-to-end |
| E2E-STD-01 | Pruebas end-to-end estandar | E2E | Aprobado | `npm run e2e`, 4 pruebas Playwright aprobadas, 0 fallidas | Anexo C |
| E2E-REAL-01 | Flujo end-to-end real | E2E real | Aprobado | `npm run e2e:real`, 1 prueba Playwright aprobada, 0 fallidas | Anexo C |
| E2E-BUY-01 | Compra primaria simulada e inventario | E2E | Aprobado | Flujo validado por Playwright estandar y E2E real | Anexo C |
| E2E-BUY-03 | Error de checkout simulado | Frontend | Aprobado por prueba frontend | Prueba frontend valida que el error de checkout se muestra sin dejar estado inconsistente | Anexo C |
| E2E-SCAN-01 | Escaner QR desde interfaz | E2E | Aprobado | Flujo de escaner validado por Playwright y API | Anexo C |
| E2E-SCAN-02 | Doble escaneo | E2E/API | Aprobado | E2E real y API validan rechazo del segundo escaneo | Anexo C |
| E2E-SCAN-03 | Codigo QR invalido | E2E/API | Aprobado | E2E/API validan rechazo de codigo QR invalido o manipulado | Anexo C |
| E2E-SCAN-04 | Bloqueo de usuario `CUSTOMER` en escaner | E2E/API | Aprobado | Control de rol validado por API y flujo de interfaz | Anexo C |
| REV-01 | Publicacion de ticket para reventa P2P | Manual/Testnet | Ejecutada con observaciones | Captura de marketplace con boleto publicado para reventa P2P | Anexo D: Evidencias de reventa en Stellar/Soroban Testnet |
| REV-02 | Compra de ticket en reventa | Manual/Testnet | Ejecutada con observaciones | Captura del inventario del comprador posterior a la compra en reventa | Anexo D |
| REV-03 | Actividad del contrato en Stellar Expert Testnet | Manual/Testnet | Ejecutada con observaciones | Captura de actividad del contrato en Stellar Expert Testnet | Anexo D |
| REV-04 | Validacion visual de inventario posterior a reventa | Manual/Testnet | Ejecutada con observaciones | Captura adicional del inventario del comprador luego de la reventa | Anexo D |
| REV-05 | Historial de ventas P2P del vendedor | Manual/Testnet | Ejecutada con observaciones | Captura del historial de ventas P2P del vendedor | Anexo D |
| LOAD-01 | Lectura publica con k6 | Carga/k6 | Aprobado | k6 lectura publica: 2240 solicitudes, 0.00% de error | Anexo E: Evidencias de pruebas de carga |
| LOAD-02 | Autenticacion con usuario `CUSTOMER` | Carga/k6 | Aprobado | k6 autenticacion: 11 solicitudes, 0.00% de error, p95 global 2.39 s | Anexo E |
| LOAD-03 | Checkout controlado | Carga/k6 | Aprobado | k6 checkout controlado: 64 solicitudes, 0.00% de error | Anexo E |
| LOAD-04 | Escaner controlado | Carga/k6 | Aprobado | k6 escaner controlado: 31 solicitudes, 0.00% de error | Anexo E |
| LOAD-05 | Transacciones controladas | Carga/k6 | Aprobado | k6 transacciones controladas: 28 solicitudes, 0.00% de error | Anexo E |
| SMOKE-01 | Cuenta autenticada con usuario comprador | Smoke staging | Ejecutado con observaciones | Captura de cuenta `CUSTOMER` autenticada en `https://stellar-ticket-staging.vercel.app/` | Anexo F: Evidencias de smoke test de despliegue |
| SMOKE-02 | Carga de eventos en staging | Smoke staging | Ejecutado con observaciones | Captura de eventos disponibles en staging | Anexo F |
| SMOKE-03 | Inventario del usuario comprador en staging | Smoke staging | Ejecutado con observaciones | Captura de inventario del usuario `CUSTOMER` | Anexo F |
| SMOKE-04 | Cuenta autenticada con usuario staff | Smoke staging | Ejecutado con observaciones | Captura de cuenta `STAFF` autenticada | Anexo F |
| SMOKE-05 | Escaner QR con acceso permitido | Smoke staging | Ejecutado con observaciones | Captura del escaner QR con usuario `STAFF` | Anexo F |
| AUT-01 | Aceptacion de usuario AUT/UAT | Aceptacion usuario | Ejecutada con observaciones | Documento AUT/UAT con 9 participantes, 9 de 9 tareas completadas, promedio 4.24/5 y decision "Aceptado con observaciones" | Soporte complementario AUT/UAT |
| TRACE-01 | Consolidacion de trazabilidad | Documentacion QA | Consolidada | Esta matriz relaciona casos, estados finales, evidencias y anexos asociados | Matriz de trazabilidad |

## Anexos finales asociados

| Anexo | Contenido esperado | Estado |
|---|---|---|
| Anexo A | Capturas de consola de `cargo test` y resumen de 58 pruebas de contratos aprobadas | Disponible |
| Anexo B | Capturas/logs de `npm run test:unit`, `npm run test:api`, pruebas API, escaner, roles, integracion e indexador | Disponible |
| Anexo C | Capturas/logs de `npm test`, `npm run e2e` y `npm run e2e:real` | Disponible |
| Anexo D | Capturas de reventa P2P en Testnet: marketplace, inventario, Stellar Expert y ventas P2P | Disponible |
| Anexo E | Capturas k6 de lectura publica, autenticacion, checkout, escaner y transacciones controladas | Disponible |
| Anexo F | Capturas de smoke staging: cuenta comprador, eventos, inventario, cuenta staff y escaner | Disponible |

## Resumen de ejecucion final

| Categoria | Resultado final | Evidencia principal |
|---|---|---|
| Contratos inteligentes | 58/58 pruebas aprobadas | `cargo test`, Anexo A |
| Backend unitario | 103/103 pruebas aprobadas | `npm run test:unit`, Anexo B |
| Backend/API e integracion | 42/42 pruebas aprobadas | `npm run test:api`, Anexo B |
| Integracion/indexador | 5/5 pruebas aprobadas dentro de API | `backend/src/indexer.integration.test.ts`, Anexo B |
| Frontend unitario | 22/22 pruebas aprobadas | `npm test`, Anexo C |
| E2E estandar | 4/4 pruebas aprobadas | `npm run e2e`, Anexo C |
| E2E real | 1/1 prueba aprobada | `npm run e2e:real`, Anexo C |
| Reventa Freighter/Testnet | Ejecutada con observaciones | Capturas REV-01 a REV-05, Anexo D |
| Carga k6 | 5 escenarios aprobados con 0.00% de error HTTP | Capturas LOAD-01 a LOAD-05, Anexo E |
| Smoke staging | Ejecutado con observaciones | Capturas SMOKE-01 a SMOKE-05, Anexo F |
| AUT/UAT | Ejecutada con observaciones | Documento AUT/UAT, consolidado de respuestas y evidencias de ejecucion |
