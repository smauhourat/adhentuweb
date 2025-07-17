# Sitio Web Adhentux.com

Sitio instucional estatico del tipo *LandingPage*

## Instalacion
1. correr **npm install**

## Build
1. correr **npm run build** (la carpeta para deployment sera ***[dist]***)


## Extras

```mermaid
  graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
```


```mermaid
graph TD
    subgraph Usuario
        A[Browser/Cliente]
    end

    subgraph Next.js App
        B[Servidor Next.js<br/>http://localhost:3000]
        B -->|Autenticación JWT/NextAuth| C[JWT/NextAuth]
        B -->|API Interna| D[API REST]
        B -->|MongoDB| E[(MongoDB)]
        B -->|LDAP| F[(LDAP)]
        B -->|Novu API| G[(Novu Notificaciones)]
        B -->|SSRS| H[(SQL Server Reporting Services)]
        B -->|Docusign| I[(Docusign API)]
        B -->|AdobeSign| J[(AdobeSign API)]
        B -->|Archivos| K[(Uploads/Public)]
        B -->|reCAPTCHA| L[(Google reCAPTCHA)]
    end

    A -->|HTTP/HTTPS| B

    %% Detalles de conexiones externas
    E -.->|MONGODB_URI| B
    F -.->|LDAP_HOST| B
    G -.->|NOVU_API_URL<br/>NOVU_API_KEY| B
    H -.->|SSRS_AS_SERVER_URL<br/>SSRS_DIF_SERVER_URL| B
    I -.->|DS_BASE_URI<br/>DS_CLIENT_ID| B
    J -.->|AS_BASE_URI<br/>AS_ENV_KEY| B
    K -.->|UPLOADS_BASE_URL| B
    L -.->|NEXT_PUBLIC_RECAPTCHA_SITEKEY| B
```