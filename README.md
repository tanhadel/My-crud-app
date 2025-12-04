 MyCrudApp - BookStore

En fullstack-applikation för att hantera böcker och citat byggd med Angular 21 och .NET 9.

 Beskrivning

BookStore är en modern CRUD-applikation som låter användare hantera sin personliga boksamling och sparade citat. Applikationen har autentisering, användarspecifik data och stöd för både light/dark mode.

Funktioner

Frontend (Angular 21)
Autentisering: Registrering och inloggning med JWT-tokens
Bokhantering: Skapa, läsa, uppdatera och ta bort böcker (CRUD)
Citathantering: Spara och hantera favoritcitat från böcker
Dark Mode: Toggle mellan ljust och mörkt tema med localStorage-persistering
Responsiv design: Fungerar på desktop, tablet och mobil
Användarspecifik data: Varje användare ser endast sina egna böcker och citat
Modern UI: Bootstrap 5.3 med Font Awesome-ikoner

Teknisk stack (Frontend)
Framework: Angular 21 med standalone components
State Management: Signals (Angular's nya reaktiva primitiv)
  - Används i `AuthService` för `currentUser` och `isAuthenticated`
  - Används i `ThemeService` för `isDarkMode`
  - Används i komponenter för att spåra böcker, citat och modal-tillstånd
  - Automatisk UI-uppdatering när data ändras
Routing: Angular Router med route guards (`auth.guard.ts`)
HTTP: HttpClient med interceptors för JWT-tokens (`auth.interceptor.ts`)
Styling: Bootstrap 5.3.0 + CSS med dark mode-stöd
Ikoner: Font Awesome 6.4.0
SSR: Server-Side Rendering stöd

Backend (.NET 9)
- RESTful API med Entity Framework Core
- JWT-baserad autentisering
- InMemory-databas 
- CORS-konfigurerad för Angular frontend


