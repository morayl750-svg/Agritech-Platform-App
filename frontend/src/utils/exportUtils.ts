import type { TransactionRecord } from '@/types/ledger'
import type { MarketplaceOrder } from '@/types'
import type { LedgerTotals } from '@/types/ledger'

/** Export data to CSV / Excel file */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '').replace(/"/g, '""')
          return `"${str}"`
        })
        .join(',')
    ),
  ].join('\n')

  // Add UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Export Financial Ledger transactions to CSV/Excel */
export function exportLedgerToCSV(transactions: TransactionRecord[]) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (USD)']
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.category,
    t.type.toUpperCase(),
    t.amount,
  ])
  exportToCSV(`AgriSmart_Financial_Report_${new Date().toISOString().split('T')[0]}`, headers, rows)
}

/** Export Marketplace Orders to CSV/Excel */
export function exportOrdersToCSV(orders: MarketplaceOrder[]) {
  const headers = ['Order ID', 'Customer Name', 'Phone', 'Location', 'Items Count', 'Total Amount (USD)', 'Status', 'Date']
  const rows = orders.map((o) => [
    o.id,
    o.customer_name,
    o.customer_phone,
    o.location,
    o.items?.length || 1,
    o.total_amount,
    o.status,
    new Date(o.created_at).toLocaleDateString(),
  ])
  exportToCSV(`AgriSmart_Orders_Report_${new Date().toISOString().split('T')[0]}`, headers, rows)
}

/** Print & Save Financial Statement to PDF */
export function printFinancialStatement(
  totals: LedgerTotals,
  transactions: TransactionRecord[]
) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const rowsHtml = transactions
    .map(
      (t) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px;">${t.date}</td>
      <td style="padding: 10px; font-weight: 600;">${t.description}</td>
      <td style="padding: 10px;">${t.category}</td>
      <td style="padding: 10px;"><span style="text-transform: uppercase; font-size: 11px; padding: 2px 8px; border-radius: 4px; background-color: ${t.type === 'income' ? '#d1fae5' : '#f3f4f6'}; color: ${t.type === 'income' ? '#065f46' : '#374151'};">${t.type}</span></td>
      <td style="padding: 10px; text-align: right; font-weight: bold; color: ${t.type === 'income' ? '#047857' : '#111827'};">
        ${t.type === 'income' ? '+' : '-'} $${Number(t.amount).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AgriSmart - Diiwaanka Maaliyadda (Financial Statement)</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1f2937; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: bold; color: #059669; }
          .title { font-size: 18px; font-weight: bold; text-align: right; }
          .date { font-size: 12px; color: #6b7280; }
          .summary-grid { display: flex; gap: 15px; margin-bottom: 25px; }
          .card { flex: 1; padding: 15px; border-radius: 8px; background: #f9fafb; border: 1px solid #e5e7eb; }
          .card-title { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
          .card-val { font-size: 20px; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px; }
          th { background: #f3f4f6; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; color: #4b5563; }
          .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; pt: 15px; text-align: center; font-size: 11px; color: #9ca3af; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div className="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
            🖨️ Daabac / PDF (Print / Save as PDF)
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo">🌿 AgriSmart Somalia</div>
            <div style="font-size: 12px; color: #4b5563;">Diiwaanka Xisaabaadka & Maaliyadda Beerta</div>
          </div>
          <div class="title">
            WARBIXINTA MAALIYADDA
            <div class="date">Taariikhda: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="card">
            <div class="card-title">DAKHLIGA JUMLADA (TOTAL INCOME)</div>
            <div class="card-val" style="color: #059669;">+$${totals.totalIncome.toFixed(2)}</div>
          </div>
          <div class="card">
            <div class="card-title">KHARASHKA BEERTA (TOTAL EXPENSE)</div>
            <div class="card-val" style="color: #dc2626;">-$${totals.totalExpense.toFixed(2)}</div>
          </div>
          <div class="card">
            <div class="card-title">FAA'IIDADA NADIFKA AH (NET BALANCE)</div>
            <div class="card-val" style="color: #111827;">$${totals.totalBalance.toFixed(2)}</div>
          </div>
        </div>

        <h3>Xisaabaadka Diiwaan-gashan (Itemized Transactions)</h3>
        <table>
          <thead>
            <tr>
              <th>Taariikh</th>
              <th>Sharrah</th>
              <th>Qeybta</th>
              <th>Nooca</th>
              <th style="text-align: right;">Qiimaha (USD)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Warbixintan waxaa si toos ah laga soo saaray Platform-ka AgriSmart Somalia — Document ID: AS-FIN-${Math.floor(Math.random() * 100000)}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

/** Print Order Invoice / Receipt */
export function printOrderInvoice(order: MarketplaceOrder) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px; font-weight: bold;">${item.product?.name || 'Agri Product'}</td>
      <td style="padding: 10px;">${item.product?.category || 'Produce'}</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">$${(item.product?.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; text-align: right; font-weight: bold;">$${((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AgriSmart - Risidhka Dalabka (${order.id})</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1f2937; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: bold; color: #059669; }
          .invoice-title { font-size: 20px; font-weight: bold; text-align: right; color: #111827; }
          .info-box { display: flex; justify-content: space-between; background: #f9fafb; border: 1px solid #e5e7eb; p: 15px; border-radius: 8px; margin-bottom: 20px; padding: 15px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px; }
          th { background: #f3f4f6; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; color: #4b5563; }
          .total-box { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; color: #059669; border-top: 2px solid #e5e7eb; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">🌿 AgriSmart Marketplace</div>
            <div style="font-size: 12px; color: #4b5563;">Risidhka Dalabka Ganacsiga</div>
          </div>
          <div class="invoice-title">
            INVOICE ${order.id}
            <div style="font-size: 12px; color: #6b7280;">Taariikhda: ${new Date(order.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="info-box">
          <div>
            <strong style="color: #6b7280; font-size: 11px; text-transform: uppercase;">XOGTA MACMIILKA:</strong>
            <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">${order.customer_name}</div>
            <div style="font-size: 12px; color: #4b5563;">📱 ${order.customer_phone}</div>
            <div style="font-size: 12px; color: #4b5563;">📍 ${order.location}</div>
          </div>
          <div style="text-align: right;">
            <strong style="color: #6b7280; font-size: 11px; text-transform: uppercase;">XAALADDA DALABKA:</strong>
            <div style="font-size: 14px; font-weight: bold; color: #059669; margin-top: 4px;">${order.status}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Alaabta</th>
              <th>Qeybta</th>
              <th style="text-align: center;">Tirada</th>
              <th style="text-align: right;">Qiimaha 1-kiiba</th>
              <th style="text-align: right;">Isku-gayn</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml || `<tr><td colSpan="5" style="padding: 15px; text-align: center;">Standard Agricultural Yield Batch Order</td></tr>`}
          </tbody>
        </table>

        <div class="total-box">
          WARTA ISKU-GAYN (TOTAL): $${order.total_amount.toFixed(2)} USD
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
