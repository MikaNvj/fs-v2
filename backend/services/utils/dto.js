export const simpleMember = (member) => {
  let { password, ...rest } = member.get({ plain: true })
  return rest
}