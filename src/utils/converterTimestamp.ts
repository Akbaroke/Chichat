export default function converterTimestamp(timestamp) {
  const date = new Date(timestamp * 1000.0)
  return date.toLocaleTimeString('id-ID', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}
