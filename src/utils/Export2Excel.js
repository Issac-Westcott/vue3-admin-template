import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; i += 1) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

export function exportJsonToExcel({
  multiHeader = [],
  header,
  data,
  filename = 'excel-list',
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  const processedFilename = filename || 'excel-list'
  const processedData = [...data]
  processedData.unshift(header)

  for (let i = multiHeader.length - 1; i > -1; i -= 1) {
    processedData.unshift(multiHeader[i])
  }

  const wsName = 'SheetJS'
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(processedData)

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = []
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    const colWidth = processedData.map(row => row.map(val => {
      if (val == null) {
        return { wch: 10 }
      }
      if (val.toString().charCodeAt(0) > 255) {
        return { wch: val.toString().length * 2 }
      }
      return { wch: val.toString().length }
    }))
    
    const result = colWidth[0]
    for (let i = 1; i < colWidth.length; i += 1) {
      for (let j = 0; j < colWidth[i].length; j += 1) {
        if (result[j].wch < colWidth[i][j].wch) {
          result[j].wch = colWidth[i][j].wch
        }
      }
    }
    ws['!cols'] = result
  }

  XLSX.utils.book_append_sheet(wb, ws, wsName)

  const wbout = XLSX.write(wb, {
    bookType,
    bookSST: false,
    type: 'binary'
  })
  
  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${processedFilename}.${bookType}`)
}