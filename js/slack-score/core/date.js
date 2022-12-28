export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }

  return (new Date(date)).toLocaleDateString('fr-FR', options)
}
