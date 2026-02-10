# 🌍 TravelDreams - Demo Agencia de Turismo

Demo profesional de sitio web para agencia de viajes/turismo, completamente funcional y responsive.

## ✨ Características

- **Diseño Moderno y Atractivo**: Interfaz limpia con gradientes y animaciones
- **Totalmente Responsive**: Se adapta a móviles, tablets y desktop
- **Secciones Completas**:
  - Hero Section con llamada a la acción
  - Buscador de viajes integrado
  - Destinos populares con tarjetas interactivas
  - Paquetes especiales (Luna de Miel, Familiar, Aventura)
  - Servicios ofrecidos
  - Testimonios de clientes
  - Newsletter
  - Formulario de contacto
  - Modal de cotización

## 🚀 Cómo Usar

1. **Abrir el sitio**:
   - Simplemente abre `index.html` en tu navegador
   - O usa Live Server en VS Code (clic derecho > Open with Live Server)

2. **Personalizar**:
   - **Colores**: Edita las variables CSS en `styles.css` (líneas 8-16)
   - **Textos**: Modifica el contenido en `index.html`
   - **Imágenes**: Las imágenes actuales son de Unsplash (puedes reemplazarlas con tus propias URLs)

## 📂 Estructura de Archivos

```
LikeInHouse/
├── index.html      # Página principal
├── styles.css      # Estilos y diseño
├── script.js       # Interactividad
└── README.md       # Este archivo
```

## 🎨 Personalización de Colores

En `styles.css`, puedes cambiar los colores principales:

```css
:root {
    --primary-color: #2196F3;      /* Azul principal */
    --secondary-color: #FF5722;    /* Naranja/rojo */
    --accent-color: #FFC107;       /* Amarillo/dorado */
    --dark-color: #1a1a2e;         /* Oscuro para textos */
}
```

## 🖼️ Cambiar Imágenes

Las imágenes actuales son placeholders de Unsplash. Para usar tus propias imágenes:

1. Busca en `index.html` las URLs que comienzan con `https://images.unsplash.com/`
2. Reemplázalas con la ruta de tus imágenes
3. Ejemplo: `style="background-image: url('ruta/a/tu/imagen.jpg');"`

## 📱 Funcionalidades Interactivas

- ✅ Menú hamburguesa en móviles
- ✅ Scroll suave entre secciones
- ✅ Modal de cotización
- ✅ Formularios funcionales con notificaciones
- ✅ Animaciones al hacer scroll
- ✅ Efectos hover en tarjetas y botones

## 🌐 Navegación

- **Inicio**: Hero section con llamada a la acción
- **Destinos**: Tarjetas de destinos populares
- **Paquetes**: Ofertas especiales por tipo de viaje
- **Servicios**: Todos los servicios ofrecidos
- **Contacto**: Formulario y datos de contacto

## 💼 Información de la Demo

Esta es una plantilla completamente funcional que incluye:
- Diseño profesional y moderno
- Código limpio y bien organizado
- Comentarios en el código
- Optimizado para SEO
- Performance optimizado

## 🔧 Tecnologías Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript Vanilla (ES6+)
- Font Awesome (iconos)
- Google Fonts compatible

## 📝 Notas

- Los formularios muestran notificaciones pero no envían datos reales (requiere backend)
- Las imágenes son de demostración y pueden reemplazarse
- Todo el código está en español para facilitar la personalización

## 🎯 Próximos Pasos Sugeridos

1. Conectar formularios a un servicio de email (EmailJS, Formspree, etc.)
2. Agregar más destinos y paquetes
3. Integrar un sistema de reservas
4. Agregar blog de viajes
5. Implementar sistema de pagos

---

**¡Listo para impresionar a tus clientes!** 🚀✈️
