// =====================================================
// PLAN DE BARRIO MISIONAL — Scripts
// =====================================================

// --- METAS Y PROGRESS BARS ---
function updateProgress(id, max) {
    const val = parseFloat(document.getElementById(`val-${id}`).value) || 0;
    const bar = document.getElementById(`bar-${id}`);
    const percent = Math.min((val / max) * 100, 100);
    bar.style.width = percent + '%';
}

// --- MODALES ---
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-is-open');
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
    document.body.classList.remove('modal-is-open');
}

// --- FICHA DE SEGUIMIENTO (Agenda Coordinación) ---
function addAmigoItemModal() {
    const container = document.getElementById('agenda-amigos-modal');
    const card = document.createElement('div');
    card.className = 'tracking-card';

    card.innerHTML = `
        <button class="tracking-card-delete no-print" onclick="this.closest('.tracking-card').remove()" title="Eliminar">
            <i data-lucide="trash-2" style="width:15px;height:15px;stroke-width:1.75;color:#EF4444;"></i>
        </button>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="user" style="width:12px;height:12px;stroke-width:2;"></i>
                        Persona / Familia
                    </label>
                    <input type="text" class="input-underlined" style="font-weight:600;">
                </div>
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="trending-up" style="width:12px;height:12px;stroke-width:2;"></i>
                        Estado de Progreso
                    </label>
                    <select class="input-underlined" style="background:transparent;">
                        <option value="">Selecciona...</option>
                        <option>Amigo (Investigador activo)</option>
                        <option>Nuevo Miembro Converso</option>
                        <option>Miembro que regresa</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="flag" style="width:12px;height:12px;stroke-width:2;"></i>
                        Próxima Meta / Ordenanza
                    </label>
                    <input type="date" class="input-underlined" style="color:#0041A3;">
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="calendar" style="width:12px;height:12px;stroke-width:2;"></i>
                        Siguiente Cita / Lección
                    </label>
                    <input type="datetime-local" class="input-underlined">
                </div>
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="car" style="width:12px;height:12px;stroke-width:2;"></i>
                        Coordinación con el Barrio
                    </label>
                    <input type="text" class="input-underlined">
                </div>
                <div>
                    <label style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0054D1;display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                        <i data-lucide="file-text" style="width:12px;height:12px;stroke-width:2;"></i>
                        Notas
                    </label>
                    <textarea class="input-underlined" rows="1" style="resize:none;"></textarea>
                </div>
            </div>
        </div>
    `;

    // Animación de entrada
    card.style.opacity = '0';
    card.style.transform = 'translateY(6px)';
    container.appendChild(card);

    // Registrar iconos de Lucide en el nuevo elemento
    if (window.lucide) window.lucide.createIcons({ nodes: [card] });

    requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}

// --- MATRIZ DE ACCIONES ---
function addRow() {
    const body = document.getElementById('actions-table');
    const row = body.insertRow();
    row.style.borderBottom = '1px solid var(--color-50)';
    row.style.animation = 'none';
    row.innerHTML = `
        <td style="padding:11px 12px;">
            <textarea placeholder="Nueva acción o tarea..." style="width:100%;border:none;outline:none;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:500;color:var(--text-primary);background:transparent;resize:none;" rows="2"></textarea>
        </td>
        <td style="padding:12px;">
            <input type="text" placeholder="Responsable" style="width:100%;border:none;outline:none;font-family:'Montserrat',sans-serif;font-size:12px;color:var(--text-secondary);background:transparent;">
        </td>
        <td style="padding:12px;">
            <input type="date" style="font-family:'Montserrat',sans-serif;font-size:11px;border:none;outline:none;color:var(--text-muted);background:transparent;">
        </td>
        <td style="padding:12px;text-align:center;">
            <input type="checkbox" style="width:16px;height:16px;accent-color:var(--color-500);">
        </td>
    `;
}

// --- EXPORTACIÓN PDF DIRECTA ---
async function previewPDF(elementId, fileName) {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) return;

    // 1. SINCRONIZACIÓN
    syncInputValues(originalElement);

    const isPlan = elementId === 'main-plan-content';
    const btn = event && event.target ? event.target.closest('button') : null;
    let oldText = "";
    if (btn) {
        oldText = btn.innerText;
        btn.innerText = "Exportando...";
        btn.style.opacity = "0.7";
        btn.style.pointerEvents = "none";
    }

    // 2. CREAR IFRAME AISLADO (Igual que el antiguo window.open pero invisible)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '850px'; // Ancho de diseño perfecto para A4
    iframe.style.height = '10000px'; // Altura masiva para evitar barras de scroll internas y recortes
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    document.body.appendChild(iframe);

    const headContent = Array.from(document.head.children)
        .map(child => child.outerHTML)
        .join('\n');

    const contentHtml = isPlan ? originalElement.innerHTML : originalElement.querySelector('.modal-container').innerHTML;

    iframe.contentDocument.open();
    iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            ${headContent}
            <title>${fileName}</title>
            <style>
                @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
                html, body { margin: 0 !important; padding: 0 !important; }
                body { background: white !important; color: black !important; font-family: 'Montserrat', sans-serif !important; line-height: 1.4; width: 100%; height: auto; }
                .print-container { padding: 0; width: 100%; box-sizing: border-box; }
                
                /* Forzar estilos de impresión profesional */
                .no-print, .btn-primary, .btn-secondary, .modal-header-actions, button { display: none !important; }
                #section-liderazgo, #section-agendas { display: ${isPlan ? 'none' : 'block'} !important; }
                
                .institucional-header { display: block !important; text-align: center; border-bottom: 2px solid #000; margin-bottom: 30pt; padding-bottom: 15pt; }
                .institucional-header h1 { margin: 10pt 0 !important; font-weight: 800 !important; color: black !important; }

                /* Evitar cortes */
                .card, .tracking-card, .agenda-section, .metas-container, .program-divider { break-inside: avoid !important; page-break-inside: avoid !important; margin-bottom: 24pt !important; }
                .card { box-shadow: none !important; border: 1px solid #E2E8F0 !important; background: white !important; }

                /* Textos y Tablas */
                .section-header, .section-label { color: black !important; font-weight: 700 !important; text-transform: uppercase !important; border-bottom: 1px solid #eee; margin-bottom: 12pt; }
                #section-matriz { width: 100% !important; margin: 0 !important; }
                table { width: 100% !important; border-collapse: collapse; }
                th, td { border: 1px solid #CBD5E1 !important; padding: 8pt !important; text-align: left !important; }
                th { background-color: #F8FAFC !important; color: black !important; }
                input, textarea, select { color: black !important; border-bottom: 1px solid #CBD5E1 !important; background: transparent !important; font-weight: 600 !important; }
            </style>
        </head>
        <body class="is-exporting-pdf ${isPlan ? 'is-exporting-plan' : ''}">
            <div class="print-container">
                ${contentHtml}
            </div>
        </body>
        </html>
    `);
    iframe.contentDocument.close();

    window.lucide && window.lucide.createIcons({ nodes: [iframe.contentDocument.body] });

    // Dar tiempo a fuentes/iconos para cargar en el iframe
    await new Promise(r => setTimeout(r, 500));

    // 3. CONFIGURACIÓN html2pdf
    const opt = {
      margin:       [15, 15, 20, 15],
      filename:     fileName + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#ffffff',
          scrollY: 0, // CRÍTICO: ignora el scroll de la ventana principal para evitar espacios vacíos arriba
          scrollX: 0
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 4. GENERAR PDF
    try {
        await html2pdf().set(opt).from(iframe.contentDocument.body).save();
    } catch (e) {
        console.error("Error al exportar PDF:", e);
        alert("Ocurrió un error al generar el PDF.");
    } finally {
        iframe.remove();
        if (btn) {
            btn.innerText = oldText;
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        }
    }
}

function syncInputValues(container) {
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) input.setAttribute('checked', '');
            else input.removeAttribute('checked');
        } else {
            // Sincronizar valor actual al atributo para que html2canvas lo detecte
            input.setAttribute('value', input.value);
            if (input.tagName.toLowerCase() === 'textarea') {
                input.innerHTML = input.value;
            }
        }
    });
}

// --- INICIALIZACIÓN ---
window.addEventListener('DOMContentLoaded', () => {
    updateProgress('bautismos', 18);
    updateProgress('lecciones', 12);
    updateProgress('ref', 10);

    // Inicializar iconos Lucide
    if (window.lucide) window.lucide.createIcons();

    // Primera ficha vacía al abrir el modal
    document.getElementById('modal-agenda-coordinacion')
        .addEventListener('click', function handler() {
            const container = document.getElementById('agenda-amigos-modal');
            if (container && container.children.length === 0) {
                addAmigoItemModal();
            }
            this.removeEventListener('click', handler);
        });
});
