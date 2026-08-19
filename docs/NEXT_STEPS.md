# Próximos pasos

1. **Deploy primero sin Supabase** para validar la experiencia y la interfaz.
2. **Conectar Supabase Auth** con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Ejecutar `supabase/001_link_translate.sql` en SQL Editor para habilitar sesiones multi-dispositivo.
4. Conectar un proveedor de traducción con `TRANSLATE_API_URL`, `TRANSLATE_API_KEY` y `TRANSLATE_MODEL`.
5. Medir latencia real de traducción antes de elegir proveedor definitivo.
6. Después agregar pagos y planes. No poner pagos antes de validar que la gente quiere mantener la sesión activa.

## Arquitectura de proveedor

La UI nunca llama directamente a un proveedor. Siempre llama `/api/translate`.
Eso permite cambiar OpenAI, Google, DeepL, Azure u otro proveedor sin reconstruir la app.

## Principio de producto

No agregar cajas de texto, categorías, dashboards o funciones visibles por defecto.
Cada nueva función debe responder a una de estas preguntas:
- ¿reduce el tiempo hasta entender?
- ¿reduce la fricción durante la conversación?
- ¿permite que más personas entiendan al mismo tiempo?
