
'use server'
import QRCode from 'qrcode'

export type QRCodeParams = {
    url: string
}

export async function GenerateQRCode(params: QRCodeParams){
  const qr = await QRCode.toDataURL(params.url, {
    width: 300,
    margin: 1,
  })
  return { qr }
}