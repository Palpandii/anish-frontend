import { formatRupees, formatDate } from './format.js'

const SHOP_NAME = 'Anish Crackers'
const SHOP_PHONE = '9787503426'
const SHOP_ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS || ''

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

// Builds a bill for a customer order and opens the browser print dialog straight away.
// Uses a hidden iframe so it isn't blocked like a popup window would be.
export function printOrderBill(order, serial) {
    const items = order.items || []
    let computedTotal = 0
    const rows = items.map((it, i) => {
        const qty = Number(it.quantity) || 0
        const price = Number(it.unitPrice) || 0
        computedTotal += qty * price
        return `<tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(it.productName)}</td>
            <td class="num">${qty}</td>
            <td class="num">${escapeHtml(formatRupees(price))}</td>
            <td class="num">${escapeHtml(formatRupees(qty * price))}</td>
        </tr>`
    }).join('')

    const total = order.totalAmount != null ? order.totalAmount : computedTotal
    const billNo = serial ?? order.id

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Bill #${escapeHtml(billNo)} - ${escapeHtml(order.customerName)}</title>
<style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 13px; margin: 0; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; }
    .shop h1 { margin: 0 0 4px; font-size: 22px; }
    .shop p { margin: 0 0 2px; font-size: 13px; max-width: 320px; }
    .meta { text-align: right; }
    .meta h2 { margin: 0 0 4px; font-size: 18px; }
    .meta p { margin: 0; }
    .cust { margin: 14px 0; }
    .cust p { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #999; padding: 7px 8px; text-align: left; }
    th { background: #eee; }
    .num { text-align: right; white-space: nowrap; }
    tr { page-break-inside: avoid; }
    .total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 12px; }
    .thanks { margin-top: 32px; text-align: center; font-size: 13px; }
    .note { margin-top: 8px; text-align: center; font-size: 11px; color: #555; }
</style>
</head>
<body>
    <div class="head">
        <div class="shop">
            <h1>${escapeHtml(SHOP_NAME)}</h1>
            ${SHOP_ADDRESS ? `<p>${escapeHtml(SHOP_ADDRESS)}</p>` : ''}
            <p>Phone: ${escapeHtml(SHOP_PHONE)}</p>
        </div>
        <div class="meta">
            <h2>BILL #${escapeHtml(billNo)}</h2>
            <p>${escapeHtml(formatDate(order.createdAt))}</p>
        </div>
    </div>

    <div class="cust">
        <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
        ${order.customerPhone ? `<p><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</p>` : ''}
        ${order.customerAddress ? `<p><strong>Address:</strong> ${escapeHtml(order.customerAddress)}</p>` : ''}
    </div>

    <table>
        <thead>
            <tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Line total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>

    <div class="total">Total: ${escapeHtml(formatRupees(total))}</div>
    <div class="thanks">Thank you for shopping with ${escapeHtml(SHOP_NAME)}!</div>
    <div class="note">Happy Diwali 🎆</div>
</body>
</html>`

    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
    document.body.appendChild(iframe)

    const cleanup = () => { if (iframe.parentNode) iframe.parentNode.removeChild(iframe) }

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(html)
    doc.close()

    iframe.contentWindow.onafterprint = cleanup
    setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
    }, 250)
    // Fallback so the iframe never lingers if onafterprint doesn't fire.
    setTimeout(cleanup, 60000)
}