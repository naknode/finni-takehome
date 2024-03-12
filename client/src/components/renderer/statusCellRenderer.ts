export default function statusCellRenderer(params: { value: string }) {
  let badgeColor = ''
  switch (params.value) {
    case 'inquiry':
      badgeColor = 'bg-blue-100 text-blue-800'
      break
    case 'active':
      badgeColor = 'bg-green-100 text-green-800'
      break
    case 'onboarding':
      badgeColor = 'bg-yellow-100 text-yellow-800'
      break
    case 'churned':
      badgeColor = 'bg-red-100 text-red-800'
      break
    default:
      badgeColor = 'bg-gray-100 text-gray-800'
  }
  return `<span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}">
    ${params.value}
  </span>`
}
