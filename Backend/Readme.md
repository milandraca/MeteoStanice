<a name='assembly'></a>
# Backend

## Contents

- [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController')
  - [#ctor(context)](#M-Backend-Controllers-AutorizacijaController-#ctor-Backend-Data-BackendContext- 'Backend.Controllers.AutorizacijaController.#ctor(Backend.Data.BackendContext)')
  - [_context](#F-Backend-Controllers-AutorizacijaController-_context 'Backend.Controllers.AutorizacijaController._context')
  - [GenerirajToken(operater)](#M-Backend-Controllers-AutorizacijaController-GenerirajToken-Backend-Models-DTO-OperaterDTO- 'Backend.Controllers.AutorizacijaController.GenerirajToken(Backend.Models.DTO.OperaterDTO)')
  - [Registracija(operater)](#M-Backend-Controllers-AutorizacijaController-Registracija-Backend-Models-DTO-OperaterDTO- 'Backend.Controllers.AutorizacijaController.Registracija(Backend.Models.DTO.OperaterDTO)')
- [BackendExtensions](#T-Backend-Extensions-BackendExtensions 'Backend.Extensions.BackendExtensions')
  - [AddBackendCORS(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendCORS-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendCORS(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
  - [AddBackendSecurity(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendSecurity-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendSecurity(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
  - [AddBackendSwaggerGen(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendSwaggerGen-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendSwaggerGen(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
- [Operater](#T-Backend-Models-Operater 'Backend.Models.Operater')
  - [Email](#P-Backend-Models-Operater-Email 'Backend.Models.Operater.Email')
  - [Lozinka](#P-Backend-Models-Operater-Lozinka 'Backend.Models.Operater.Lozinka')
- [OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO')
  - [#ctor(Email,Password)](#M-Backend-Models-DTO-OperaterDTO-#ctor-System-String,System-String- 'Backend.Models.DTO.OperaterDTO.#ctor(System.String,System.String)')
  - [Email](#P-Backend-Models-DTO-OperaterDTO-Email 'Backend.Models.DTO.OperaterDTO.Email')
  - [Password](#P-Backend-Models-DTO-OperaterDTO-Password 'Backend.Models.DTO.OperaterDTO.Password')

<a name='T-Backend-Controllers-AutorizacijaController'></a>
## AutorizacijaController `type`

##### Namespace

Backend.Controllers

##### Summary

Kontroler za autorizaciju korisnika.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [T:Backend.Controllers.AutorizacijaController](#T-T-Backend-Controllers-AutorizacijaController 'T:Backend.Controllers.AutorizacijaController') | Kontekst baze podataka. |

##### Remarks

Inicijalizira novu instancu klase [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController').

<a name='M-Backend-Controllers-AutorizacijaController-#ctor-Backend-Data-BackendContext-'></a>
### #ctor(context) `constructor`

##### Summary

Kontroler za autorizaciju korisnika.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [Backend.Data.BackendContext](#T-Backend-Data-BackendContext 'Backend.Data.BackendContext') | Kontekst baze podataka. |

##### Remarks

Inicijalizira novu instancu klase [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController').

<a name='F-Backend-Controllers-AutorizacijaController-_context'></a>
### _context `constants`

##### Summary

Kontekst baze podataka

<a name='M-Backend-Controllers-AutorizacijaController-GenerirajToken-Backend-Models-DTO-OperaterDTO-'></a>
### GenerirajToken(operater) `method`

##### Summary

Generira token za autorizaciju.

##### Returns

JWT token ako je autorizacija uspješna, inače vraća status 403.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operater | [Backend.Models.DTO.OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO') | DTO objekt koji sadrži email i lozinku operatera. |

##### Remarks

Primjer zahtjeva:

```json
{
  "email": "edunova@edunova.hr",
  "password": "edunova"
}
```

<a name='M-Backend-Controllers-AutorizacijaController-Registracija-Backend-Models-DTO-OperaterDTO-'></a>
### Registracija(operater) `method`

##### Summary

Registrira novog operatera.

##### Returns

Status 201 Created ako je registracija uspješna, inače vraća odgovarajući status greške.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operater | [Backend.Models.DTO.OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO') | DTO objekt koji sadrži email i lozinku operatera. |

##### Remarks

Primjer zahtjeva:

```json
{
  "email": "novi@korisnik.hr",
  "password": "lozinka123"
}
```

<a name='T-Backend-Extensions-BackendExtensions'></a>
## BackendExtensions `type`

##### Namespace

Backend.Extensions

##### Summary

Klasa koja sadrži proširenja za Edunova aplikaciju.

<a name='M-Backend-Extensions-BackendExtensions-AddBackendCORS-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendCORS(Services) `method`

##### Summary

Dodaje konfiguraciju za CORS.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='M-Backend-Extensions-BackendExtensions-AddBackendSecurity-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendSecurity(Services) `method`

##### Summary

Dodaje konfiguraciju za sigurnost.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='M-Backend-Extensions-BackendExtensions-AddBackendSwaggerGen-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendSwaggerGen(Services) `method`

##### Summary

Dodaje konfiguraciju za Swagger dokumentaciju.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='T-Backend-Models-Operater'></a>
## Operater `type`

##### Namespace

Backend.Models

##### Summary

Operater koji se koristi za prijavu u sustav.

<a name='P-Backend-Models-Operater-Email'></a>
### Email `property`

##### Summary

Email operatera.

<a name='P-Backend-Models-Operater-Lozinka'></a>
### Lozinka `property`

##### Summary

Lozinka operatera.

<a name='T-Backend-Models-DTO-OperaterDTO'></a>
## OperaterDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO (Data Transfer Object) za operatera.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Email | [T:Backend.Models.DTO.OperaterDTO](#T-T-Backend-Models-DTO-OperaterDTO 'T:Backend.Models.DTO.OperaterDTO') |  |

<a name='M-Backend-Models-DTO-OperaterDTO-#ctor-System-String,System-String-'></a>
### #ctor(Email,Password) `constructor`

##### Summary

DTO (Data Transfer Object) za operatera.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Email | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') |  |
| Password | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') |  |

<a name='P-Backend-Models-DTO-OperaterDTO-Email'></a>
### Email `property`

##### Summary



<a name='P-Backend-Models-DTO-OperaterDTO-Password'></a>
### Password `property`

##### Summary


