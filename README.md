# LINK Translate 2.0

Una app de subtítulos y sesiones de voz en vivo. No es un traductor de cajas de texto.

## Experiencia

### Personal
Entrada → cuenta → elegir dos idiomas → hablar → subtítulos en pantalla completa.

### Empresas/equipos
Entrada → crear sesión → QR → participantes eligen idioma → subtítulos en su pantalla.

## Ejecutar

```bash
npm install
npm run dev
npm run build
```

## Vercel

Variables obligatorias para traducción:

```env
TRANSLATE_API_URL=https://api.openai.com/v1
TRANSLATE_API_KEY=...
TRANSLATE_MODEL=gpt-5-mini
```

Opcionales para usuarios y B2B real:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_FREE_MINUTES=3
```

Después ejecuta `supabase/001_link_translate.sql`.
